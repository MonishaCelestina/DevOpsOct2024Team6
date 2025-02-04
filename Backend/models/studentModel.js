const db = require("../db");

const StudentModel = {

    authenticateStudent: (email, password, callback) => {
        const sql = "SELECT * FROM Students WHERE email = ? AND password = ?";

        db.query(sql, [email, password], (err, results) => {
            if (err) return callback(err, null);
            if (results.length === 0) return callback(null, null);

            callback(null, results[0]); // Return student data
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

    getRedeemedItems: (studentID, callback) => {
        const sql = `
            SELECT RedeemableItems.itemName, RedeemedItems.redeemDate
            FROM RedeemedItems
            JOIN RedeemableItems ON RedeemableItems.itemID = RedeemedItems.itemID
            WHERE RedeemedItems.studentID = ?
            ORDER BY RedeemedItems.redeemDate DESC
        `;
    
        db.query(sql, [studentID], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    },

    
    // Fetch redeemable items
    getRedeemableItems: (callback) => {
        const sql = "SELECT * FROM RedeemableItems WHERE quantity > 0";
        db.query(sql, [studentID], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);})
    },

    // Check student points and item availability
    checkStudentAndItem: (studentID, itemID, callback) => {
        const sql = `
            SELECT Students.points AS studentPoints, 
                   RedeemableItems.pointsRequired, 
                   RedeemableItems.quantity
            FROM Students
            JOIN RedeemableItems ON RedeemableItems.itemID = ?
            WHERE Students.studentID = ?
        `;
        db.query(sql, [itemID, studentID], callback);
    },

    createStudent: (studentID, studentName, diploma, yearOfEntry, email, password, points, callback) => {
        const sql = "INSERT INTO Students (studentID, studentName, diploma, yearOfEntry, email, password, points) VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        db.query(sql, [studentID, studentName, diploma, yearOfEntry, email, password, points], (err, result) => {
            if (err) {
                console.error("Database Query Error:", err);
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
            if (err) {
                console.error("Database Query Error:", err);
                if (callback) callback(err, null); // ✅ Ensure callback exists before calling
                return;
            }
            if (callback) callback(null, result); // ✅ Ensure callback is used properly
        });
    },
    // Redeem an item (Deduct points and reduce quantity)
    redeemItem: (studentID, itemID, pointsRequired, callback) => {
        const updateStudentPoints = "UPDATE Students SET points = points - ? WHERE studentID = ?";
        const updateItemQuantity = "UPDATE RedeemableItems SET quantity = quantity - 1 WHERE itemID = ?";

        // Execute the two queries separately
        db.query(updateStudentPoints, [pointsRequired, studentID], (err, results) => {
            if (err) {
                console.error("Error updating student points:", err);
                return callback(err);
            }

            db.query(updateItemQuantity, [itemID], (err, results) => {
                if (err) {
                    console.error("Error updating item quantity:", err);
                    return callback(err);
                }

                callback(null, results); // No errors, return success
            });
        });
    }

    
};

module.exports = StudentModel;
