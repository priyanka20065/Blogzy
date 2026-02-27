const nodemailer = require("nodemailer");
const User = require("../models/UserSetting");

const sendContactEmail = async (req, res) => {
    const { name, message } = req.body; // ❌ no email input
    const userId = req.user.id; // logged-in user

    if (!name || !message) {
        return res.status(400).json({ msg: "Please provide all details" });
    }

    try {
        // Get logged-in user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const userEmail = user.email; // ✅ auto email from DB

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: Number(process.env.EMAIL_PORT) === 465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"${name}" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL, // Blogzy owner
            replyTo: userEmail, // user can be replied directly
            subject: `New Contact Message from ${name}`,
            text: `User Email: ${userEmail}\n\nMessage:\n${message}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ msg: "Email sent successfully!" });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ msg: "Failed to send email" });
    }
};

module.exports = { sendContactEmail };