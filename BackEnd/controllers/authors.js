const mongoose = require("mongoose");
const User = require("../models/UserSetting"); // unified User model

// Get all authors with real-time blog counts
const getAllAuthors = async (req, res) => {
  try {
    const authors = await User.aggregate([
      { $match: { role: "author" } },
      // Look up in 'blogs' collection
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "author",
          as: "blogsFromBlogs",
        },
      },
      // Look up in 'authors' collection (just in case some blogs are wrongly assigned there)
      {
        $lookup: {
          from: "authors",
          localField: "_id",
          foreignField: "author",
          as: "blogsFromAuthors",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          image: 1,
          bio: 1,
          isPremium: 1,
          blogsCount: {
            $add: [
              { $size: "$blogsFromBlogs" },
              { $size: "$blogsFromAuthors" }
            ]
          },
        },
      },
    ]);

    res.status(200).json({ authors });
  } catch (error) {
    console.error("Fetch Authors Error:", error);
    res.status(500).json({ msg: error.message });
  }
};

// Get a single author by ID with real-time stats
const getAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[Backend] Fetching author detail for ID: ${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Author ID format" });
    }

    const author = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id), role: "author" } },
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "author",
          as: "authorBlogs",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          image: 1,
          bio: 1,
          isPremium: 1,
          followers: 1,
          followingCount: { $size: { $ifNull: ["$following", []] } },
          followersCount: { $size: { $ifNull: ["$followers", []] } },
          blogsCount: { $size: "$authorBlogs" },
        },
      },
    ]);

    if (!author || author.length === 0) {
      return res.status(404).json({ msg: "Author not found" });
    }
    return res.status(200).json(author[0]);
  } catch (error) {
    console.error(`[Backend] getAuthor Error:`, error);
    res.status(500).json({ msg: error.message });
  }
};

// Create a new author (optional, mostly used for manual creation)
const newAuthor = async (req, res) => {
  try {
    const { name, email, password, bio, isPremium } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password, // make sure to hash before saving if using plaintext now
      role: "author",
      bio: bio || "",
      isPremium: isPremium || true,
    });

    res.status(201).json({ author: user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Upgrade existing user to author (membership purchase)
const upgradeToAuthor = async (req, res) => {
  try {
    const { userId, bio } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.role = "author";
    user.isPremium = true;
    user.bio = bio || user.bio;
    await user.save();

    res.status(200).json({ msg: "User upgraded to author", author: user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { getAllAuthors, getAuthor, newAuthor, upgradeToAuthor };
