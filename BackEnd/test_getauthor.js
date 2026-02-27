const mongoose = require("mongoose");
const User = require("./models/UserSetting");
require("dotenv").config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const id = "6991a9280f3219d21542821e";
        console.log("Testing with ID:", id);

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
                    blogsCount: { $size: "$authorBlogs" },
                    followersCount: { $size: { $ifNull: ["$followers", []] } },
                }
            }
        ]);

        console.log("Result:", JSON.stringify(author, null, 2));
        process.exit(0);
    } catch (err) {
        console.error("Aggregation Failed:", err);
        process.exit(1);
    }
};

test();
