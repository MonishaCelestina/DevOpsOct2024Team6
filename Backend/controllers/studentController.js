const StudentModel = require("../models/studentModel");
const db = require('../db')
const StudentController = {

    loginStudent: (req, res) => {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        StudentModel.authenticateStudent(email, password, (err, student) => {
            if (err) return res.status(500).json({ message: "Internal Server Error" });

            if (!student) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            res.json({ message: "Student login successful", student });
        });
    },
    // Fetch all students
    getAllStudents: (req, res) => {
        StudentModel.getAllStudents((err, students) => {
            if (err) {
                console.error("Error fetching students:", err);
                return res.status(500).json({ message: "Internal Server Error" });
            }
            res.json(students); // ✅ Return full student data
        });
    },

    // Fetch a single student by ID
    getStudentDetails: (req, res) => {
        const { studentID } = req.params;

        StudentModel.getStudentByID(studentID, (err, student) => {
            if (err) {
                console.error("Error fetching student:", err);
                return res.status(500).json({ message: "Internal Server Error" });
            }

            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            res.json(student); // ✅ Return full student data for the given ID
        });
    },

    getRedeemableItems: (req, res) => {
        const studentID = req.params.studentID;
        console.log(`Fetching redeemable items for student ID: ${studentID}`);
    
        const sql = "SELECT * FROM RedeemableItems WHERE quantity > 0";
    
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching redeemable items from database:", err); // Log the error
                return res.status(500).json({ message: "Internal Server Error" });
            }
    
            console.log("Fetched items from database:", results); // Log the results
            res.json(results);
        });
    },
    
    getRedeemedItems: (req, res) => {
        const { studentID } = req.params;

        StudentModel.getRedeemedItems(studentID, (err, items) => {
            if (err) {
                console.error("Error fetching redeemed items:", err);
                return res.status(500).json({ message: "Internal Server Error" });
            }

            if (!items || items.length === 0) {
                return res.status(404).json([]); // Return empty array
            }

            res.json(items);
        });
    },

    redeemItem: (req, res) => {
        const { studentID } = req.params;
        const { itemID } = req.body;

        console.log(`Processing redeem request: studentID=${studentID}, itemID=${itemID}`);

        // Step 1: Check if student has enough points and item is available
        StudentModel.checkStudentAndItem(studentID, itemID, (err, results) => {
            if (err) {
                console.error("Error checking student or item:", err);
                return res.status(500).json({ message: "Internal Server Error" });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Student or item not found" });
            }

            const { studentPoints, pointsRequired, quantity } = results[0];
            console.log(`Student Points: ${studentPoints}, Points Required: ${pointsRequired}, Item Quantity: ${quantity}`);

            // Validation: Not enough points
            if (studentPoints < pointsRequired) {
                return res.status(400).json({ message: "Not enough points to redeem this item" });
            }

            // Validation: Item out of stock
            if (quantity <= 0) {
                return res.status(400).json({ message: "Item is out of stock" });
            }

            // Step 2: Redeem the item (deduct points and reduce quantity)
            StudentModel.redeemItem(studentID, itemID, pointsRequired, (err) => {
                if (err) {
                    console.error("Error processing redemption:", err);
                    return res.status(500).json({ message: "Internal Server Error" });
                }

                console.log("Redemption successful.");
                res.json({ message: "Item redeemed successfully!" });
            });
        });
    }
    
    
};

module.exports = StudentController;
