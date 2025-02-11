const express = require('express');
const bcrypt = require('bcrypt');
const db = require("../db");

const router = express.Router();

router.post('/verify-email', (req, res) => {
    const { email } = req.body;

    const findUserQuery = "SELECT * FROM Students WHERE email = ?";
    db.query(findUserQuery, [email], (err, results) => {
        if (err) {
            console.error("Database Query Error:", err);
            return res.status(500).send('Database error');
        }

        if (results.length === 0) {
            return res.status(404).send('Email not found');
        }

        res.status(200).send('Email verified. You can reset your password.');
    });
});

router.post('/update-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateQuery = "UPDATE Students SET password = ? WHERE email = ?";

        db.query(updateQuery, [hashedPassword, email], (err, result) => {
            if (err) {
                console.error("Password Update Error:", err);
                return res.status(500).send('Database error');
            }

            res.status(200).send('Password successfully updated');
            
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
