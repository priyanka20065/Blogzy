const User = require("../models/UserSetting");

const toggleBookmark = async (req, res) => {
    try {
        const { id: blogId } = req.params;
        const userId = req.user.id;

        console.log(`[ToggleBookmark] Attempting to toggle bookmark. User: ${userId}, Blog: ${blogId}`);

        const user = await User.findById(userId);
        if (!user) {
            console.error(`[ToggleBookmark] User ${userId} not found in database.`);
            return res.status(404).json({
                msg: "User not found. Your session may be stale, please re-login.",
                debugUserId: userId
            });
        }

        // ACCESS CONTROL: Only Premium or Authors can bookmark
        if (!user.isPremium && user.role !== "author") {
            console.warn(`[ToggleBookmark] Access denied for User ${userId}. Role: ${user.role}, Premium: ${user.isPremium}`);
            return res.status(403).json({ msg: "This is a Premium feature." });
        }

        // Check if blog is already bookmarked
        const isBookmarked = user.bookmarks.some(id => id.toString() === blogId);

        if (isBookmarked) {
            console.log(`[ToggleBookmark] Removing blog ${blogId} from User ${userId}'s bookmarks.`);
            user.bookmarks = user.bookmarks.filter(
                (id) => id.toString() !== blogId
            );
        } else {
            console.log(`[ToggleBookmark] Adding blog ${blogId} to User ${userId}'s bookmarks.`);
            user.bookmarks.push(blogId);
        }

        await user.save();

        res.status(200).json({
            msg: isBookmarked ? "Bookmark removed" : "Bookmark added",
            bookmarks: user.bookmarks,
            user
        });

    } catch (error) {
        console.error("[ToggleBookmark] Error:", error);
        res.status(500).json({ msg: "Internal Server Error", error: error.message });
    }
};

const getBookmarks = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate({
            path: "bookmarks",
            populate: {
                path: "author",
            },
        });

        // ACCESS CONTROL
        if (!user.isPremium && user.role !== "author") {
            return res.status(403).json({ msg: "This is a Premium feature." });
        }

        res.status(200).json({ bookmarks: user.bookmarks });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const toggleFollow = async (req, res) => {
    try {
        const { id: authorId } = req.params;
        const userId = req.user.id;

        if (authorId === userId) {
            return res.status(400).json({ msg: "You cannot follow yourself." });
        }

        const [author, user] = await Promise.all([
            User.findById(authorId),
            User.findById(userId)
        ]);

        if (!author) return res.status(404).json({ msg: "Author not found" });

        const isFollowing = user.following.some(id => id.toString() === authorId);

        if (isFollowing) {
            // Unfollow
            user.following = user.following.filter(id => id.toString() !== authorId);
            author.followers = author.followers.filter(id => id.toString() !== userId);
        } else {
            // Follow
            user.following.push(authorId);
            author.followers.push(userId);
        }

        await Promise.all([user.save(), author.save()]);

        res.status(200).json({
            msg: isFollowing ? "Unfollowed successfully" : "Followed successfully",
            following: user.following,
            followerCount: author.followers.length
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getFollowing = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate("following", "name image bio social");
        res.status(200).json({ following: user.following });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports = { toggleFollow, getFollowing, toggleBookmark, getBookmarks };
