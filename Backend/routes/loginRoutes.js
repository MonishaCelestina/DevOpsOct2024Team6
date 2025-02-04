const express = require('express');
const LoginModel = require('../models/LoginModel'); // Ensure the path is correct

const router = express.Router();

// Login Route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    LoginModel.authenticate(email, password, (err, user) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Ensure correct role is returned
        if (email.includes("admin")) {
            return res.json({ message: "Login successful", admin: user });
        } else {
            return res.json({ message: "Login successful", student: user });
        }
    });
});


module.exports = router;
