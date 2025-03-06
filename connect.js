require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route for handling form submissions
app.post("/send", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
        // Configure nodemailer
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL, // Your Gmail
                pass: process.env.PASSWORD, // Your App Password (not personal password)
            },
        });

        // Email options
        let mailOptions = {
            from: process.env.EMAIL,
            to: process.env.RECEIVER_EMAIL, // Your email to receive messages
            subject: "New Contact Form Submission",
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: "Message sent successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to send message." });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
