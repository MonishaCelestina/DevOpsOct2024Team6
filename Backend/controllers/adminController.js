const AdminModel = require("../models/adminModel");
const StudentModel = require("../models/studentModel");
const db = require("../db");

const AdminController = {
    loginAdmin: (req, res) => {
        const { email, password } = req.body;
        const sql = "SELECT * FROM Admins WHERE email = ? AND password = ?";

        db.query(sql, [email, password], (err, results) => {
            if (err) return res.status(500).json({ message: "Internal Server Error" });
            if (results.length === 0) return res.status(401).json({ message: "Invalid email or password" });

            res.json({ message: "Admin login successful", admin: results[0] });
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
    

    searchStudent: (req, res) => {
        const { q } = req.query;
        AdminModel.searchStudent(q, (err, students) => {
            if (err) return res.status(500).json({ message: "Internal Server Error" });
            res.json(students);
        });
    },

    createStudent: (req, res) => {
        console.log("Received request body:", req.body); // Debugging log

        const { studentID, studentName, email, password, diploma, yearOfEntry, points } = req.body;

        if (!studentID || !studentName || !email || !password || !diploma || !yearOfEntry || points === undefined) {
            console.error("Validation Error: Missing fields");
            return res.status(400).json({ message: "All fields are required." });
        }

        if (studentID.length > 10 || studentID.includes("@")) {
            console.error("Validation Error: Invalid studentID");
            return res.status(400).json({ message: "Student ID must be max 10 characters and cannot be an email." });
        }

        // Call StudentModel to insert into the database
        StudentModel.createStudent(studentID, studentName, diploma, yearOfEntry, email, password, points, (err, studentID) => {
            if (err) {
                return res.status(500).json({ message: "Error creating student", error: err.sqlMessage || err });
            }
            res.status(201).json({ message: "Student created successfully", studentID });

        });
    },
    updateStudent: (req, res) => {
        const { studentID } = req.params;
        const { studentName, email, diploma, yearOfEntry, points, password } = req.body;

        if (!studentName || !email || !diploma || !yearOfEntry || points === undefined) {
            return res.status(400).json({ message: "All fields are required." });
        }

        StudentModel.updateStudent(studentID, studentName, email, diploma, yearOfEntry, points, password, (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Error updating student", error: err.sqlMessage });
            }
            res.json({ message: "Student updated successfully" });
        });
    },
    deleteStudent: (req, res) => {
        const { studentID } = req.params;
        AdminModel.deleteStudent(studentID, (err) => {
            if (err) return res.status(500).json({ message: "Error deleting student" });
            res.json({ message: "Student deleted successfully" });
        });
    },

    getAllItems: (req, res) => {
        AdminModel.getAllItems((err, items) => {
            if (err) return res.status(500).json({ message: "Internal Server Error" });
            res.json(items);
        });
    },

    createItem: (req, res) => {
        const { itemName, pointsRequired, quantity } = req.body;
    
        // Check if all fields are provided
        if (!itemName || pointsRequired === undefined || quantity === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }
    
        // Ensure pointsRequired and quantity are valid numbers greater than 0
        if (isNaN(pointsRequired) || isNaN(quantity) || pointsRequired <= 0 || quantity <= 0) {
            return res.status(400).json({ message: "Points and quantity must be positive numbers" });
        }
    
    
        res.status(201).json({ message: "Item created successfully" });
    },
    

    updateItem: (req, res) => {
        const { itemID } = req.params;
        const { itemName, pointsRequired, quantity } = req.body;

        if (!itemName || pointsRequired === undefined || quantity === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        AdminModel.updateItem(itemID, itemName, pointsRequired, quantity, (err, result) => {
            if (err) return res.status(500).json({ message: "Internal Server Error" });
            res.json(result);
        });
    },

    deleteItem: (req, res) => {
        const { itemID } = req.params;
        AdminModel.deleteItem(itemID, (err) => {
            if (err) return res.status(500).json({ message: "Error deleting item" });
            res.json({ message: "Item deleted successfully" });
        });
    }

    
};

module.exports = AdminController;
