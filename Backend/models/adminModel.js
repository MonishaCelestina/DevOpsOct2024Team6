const db = require("../db"); // Ensure this is your MySQL connection file

const AdminModel = {
    //  Authenticate Admin Login
    authenticateAdmin: (email, password, callback) => {
        const sql = "SELECT * FROM Admins WHERE email = ? AND password = ?";
        db.query(sql, [email, password], (err, results) => {
            if (err) return callback(err, null);
            if (results.length === 0) return callback(null, null);
            callback(null, results[0]); // Return admin data
        });
    },
    // Fetch all students
    getAllStudents: (callback) => {
        const sql = `
            SELECT studentID, studentName, email, diploma, yearOfEntry, points
            FROM Students
        `;
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Database Error:", err);
                return callback(err, null);
            }
            callback(null, results); //  Return all fields
        });
    },

    // Fetch a single student by ID
    getStudentDetails: (studentID, callback) => {
        const sql = `
            SELECT studentID, studentName, email, diploma, yearOfEntry, points
            FROM Students
            WHERE studentID = ?
        `;
        db.query(sql, [studentID], (err, results) => {
            if (err) {
                console.error("Database Error:", err);
                return callback(err, null);
            }
            callback(null, results[0]); // Return the first result
        });
    },

    //  Search Students by ID or Name
    searchStudent: (query, callback) => {
        const sql = "SELECT studentID, studentName, points FROM Students WHERE studentID LIKE ? OR studentName LIKE ?";
        db.query(sql, [`%${query}%`, `%${query}%`], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    },

    //  Create New Student
    createStudent: (studentID, studentName, diploma, yearOfEntry, email, password, points, callback) => {
        const sql = "INSERT INTO Students (studentID, studentName, diploma, yearOfEntry, email, password, points) VALUES (?, ?, ?, ?, ?, ?, ?)";
        db.query(sql, [studentID, studentName, diploma, yearOfEntry, email, password, points], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return callback(err, null);
            }
            callback(null, result.insertId);
        });
    },
    updateStudent: (studentID, studentName, email, diploma, yearOfEntry, points, password, callback) => {
        let sql;
        let values;

        if (password) {
            sql = "UPDATE Students SET studentName = ?, email = ?, diploma = ?, yearOfEntry = ?, points = ?, password = ? WHERE studentID = ?";
            values = [studentName, email, diploma, yearOfEntry, points, password, studentID];
        } else {
            sql = "UPDATE Students SET studentName = ?, email = ?, diploma = ?, yearOfEntry = ?, points = ? WHERE studentID = ?";
            values = [studentName, email, diploma, yearOfEntry, points, studentID];
        }

        db.query(sql, values, (err, result) => {
            if (err) return callback(err, null);
            callback(null, result);
        });
    },
    //  Delete a Student
    deleteStudent: (studentID, callback) => {
        const sql = "DELETE FROM Students WHERE studentID = ?";
        db.query(sql, [studentID], (err, results) => {
            if (err) return callback(err, null);
            callback(null, { message: "Student deleted successfully" });
        });
    },

    // Get All Redeemable Items
    getAllItems: (callback) => {
        const sql = "SELECT * FROM RedeemableItems";
        db.query(sql, (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    },

    //  Create New Redeemable Item
    createItem: (itemName, pointsRequired, quantity, callback) => {
        const sql = "INSERT INTO RedeemableItems (itemName, pointsRequired, quantity) VALUES (?, ?, ?)";
        db.query(sql, [itemName, pointsRequired, quantity], (err, results) => {
            if (err) return callback(err, null);
            callback(null, { message: "Item created successfully" });
        });
    },

    // Update Redeemable Item
    updateItem: (itemID, itemName, pointsRequired, quantity, callback) => {
        const sql = "UPDATE RedeemableItems SET itemName = ?, pointsRequired = ?, quantity = ? WHERE itemID = ?";
        db.query(sql, [itemName, pointsRequired, quantity, itemID], (err, results) => {
            if (err) return callback(err, null);
            callback(null, { message: "Item updated successfully" });
        });
    },

    // Delete Redeemable Item
    deleteItem: (itemID, callback) => {
        const sql = "DELETE FROM RedeemableItems WHERE itemID = ?";
        db.query(sql, [itemID], (err, results) => {
            if (err) return callback(err, null);
            callback(null, { message: "Item deleted successfully" });
        });
    }


};

module.exports = AdminModel;
