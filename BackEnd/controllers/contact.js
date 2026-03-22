const { Resend } = require('resend');
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

        const resend = new Resend(process.env.RESEND_API_KEY);
        const emailData = {
            from: `onboarding@resend.dev`,
            to: process.env.ADMIN_EMAIL,
            reply_to: userEmail,
            subject: `New Contact Message from ${name}`,
            html: `<p><strong>From:</strong> ${name} (${userEmail})</p><p><strong>Message:</strong></p><p>${message}</p>`
        };
        console.log('[CONTACT] Sending email with Resend:', emailData);
        const resendResult = await resend.emails.send(emailData);
        console.log('[CONTACT] Resend API result:', resendResult);
        if (resendResult.error) {
            throw new Error(resendResult.error.message || 'Resend API error');
        }
        res.status(200).json({ msg: "Email sent successfully!" });
    } catch (error) {
        console.error('[CONTACT] Error sending email:', error);
        res.status(500).json({ msg: "Failed to send email", error: error.message });
    }
};

module.exports = { sendContactEmail };