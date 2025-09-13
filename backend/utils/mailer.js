const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '465', 10),
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendMail = async({ to, subject, html, text }) => {
    const mailOptions = {
        from: `"Healthcare App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html
    };
    return transporter.sendMail(mailOptions);
};

module.exports = { sendMail };