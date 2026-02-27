const mongoose = require("mongoose");
const User = require("./BackEnd/models/UserSetting");
require("dotenv").config({ path: "./BackEnd/.env" });

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const users = await User.find({}, "name email role isPremium");
        console.log("All Users:");
        console.table(users.map(u => ({
            id: u._id.toString(),
            name: u.name,
            email: u.email,
            role: u.role,
            isPremium: u.isPremium
        })));

        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkUsers();
