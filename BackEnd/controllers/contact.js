const nodemailer = require("nodemailer");
const User = require("../models/UserSetting"); // now points to 'User' collection

const sendContactEmail = async (req, res) => {
    console.log('[CONTACT] Incoming request:', req.method, req.url);
    const { name, message } = req.body;
    const userId = req.user && req.user.id;
    console.log('[CONTACT] Body:', req.body);
    console.log('[CONTACT] User ID from token:', userId);

    if (!name || !message) {
        console.log('[CONTACT] Missing name or message');
        return res.status(400).json({ msg: "Please provide all details" });
    }

    try {
        // Get logged-in user
        const user = await User.findById(userId);
        if (!user) {
            console.log('[CONTACT] User not found in DB');
            return res.status(404).json({ msg: "User not found" });
        }

        const userEmail = user.email;
        console.log('[CONTACT] User email:', userEmail);

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
            to: process.env.ADMIN_EMAIL,
            replyTo: userEmail,
            subject: `New Contact Message from ${name}`,
            text: `User Email: ${userEmail}\n\nMessage:\n${message}`,
        };

        console.log('[CONTACT] Sending email with options:', mailOptions);
        await transporter.sendMail(mailOptions);
        console.log('[CONTACT] Email sent successfully!');
        res.status(200).json({ msg: "Email sent successfully!" });

    } catch (error) {
        console.error('[CONTACT] Error sending email:', error);
        res.status(500).json({ msg: "Failed to send email", error: error.message });
    }
};

module.exports = { sendContactEmail };