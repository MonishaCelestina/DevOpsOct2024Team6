const db = require("../db");
const bcrypt = require('bcrypt');

const StudentModel = {
    authenticateStudent: (email, password, callback) => {
        const sql = "SELECT * FROM Students WHERE email = ?";
        db.query(sql, [email], (err, results) => {
            if (err) return callback(err, null);
            if (results.length === 0) return callback(null, null); 
            const student = results[0];

            bcrypt.compare(password, student.password, (err, isMatch) => {
                if (err) return callback(err, null);
                if (isMatch) {
                    callback(null, student); // Password matches, return student data
                } else {
                    callback(null, null); // Password incorrect
                }
            });
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

    getRedeemedItems: (studentID, callback) => {
        const sql = `
            SELECT r.itemID, r.redeemDate, i.itemName 
            FROM RedeemedItems r
            JOIN RedeemableItems i ON r.itemID = i.itemID
            WHERE r.studentID = ?
            ORDER BY r.redeemDate DESC;
        `;
        db.query(sql, [studentID], (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    },

    // Check if student has enough points and if item is available
    checkStudentAndItem: (studentID, itemID, callback) => {
        const sql = `
            SELECT s.points AS studentPoints, i.pointsRequired, i.quantity
            FROM Students s
            JOIN RedeemableItems i ON i.itemID = ?
            WHERE s.studentID = ?;
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
                if (callback) callback(err, null); // Ensure callback exists before calling
                return;
            }
            if (callback) callback(null, result); // Ensure callback is used properly
        });
    },
    // Redeem an item (Deduct points and reduce quantity)
    redeemItem: (studentID, itemID, pointsRequired, callback) => {
        const updateStudentPoints = "UPDATE Students SET points = points - ? WHERE studentID = ?";
        const updateItemQuantity = "UPDATE RedeemableItems SET quantity = quantity - 1 WHERE itemID = ?";
        const insertRedeemedItem = "INSERT INTO RedeemedItems (studentID, itemID, redeemDate) VALUES (?, ?, NOW())";
    
        console.log(`🔹 Deducting ${pointsRequired} points from studentID=${studentID}`);
        
        db.query(updateStudentPoints, [pointsRequired, studentID], (err, studentResult) => {
            if (err) {
                console.error(" Error updating student points:", err);
                return callback(err);
            }
    
            console.log(`✔ Points Updated: ${studentResult.affectedRows}`);
    
            db.query(updateItemQuantity, [itemID], (err, itemResult) => {
                if (err) {
                    console.error(" Error updating item quantity:", err);
                    return callback(err);
                }
    
                console.log(` Item Quantity Updated: ${itemResult.affectedRows}`);
    
                db.query(insertRedeemedItem, [studentID, itemID], (err, redeemResult) => {
                    if (err) {
                        console.error("Error inserting into RedeemedItems:", err);
                        return callback(err);
                    }
    
                    console.log(` Redemption Recorded in Database: ${redeemResult.affectedRows}`);
                    callback(null, redeemResult);
                });
            });
        });
    }
    
    
};

module.exports = StudentModel;
