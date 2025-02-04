const db = require('../db'); // Import database connection

const LoginModel = {
    authenticate: (email, password, callback) => {
        const sql = "SELECT * FROM Students WHERE email = ? AND password = ?";
        db.query(sql, [email, password], (err, results) => {
            if (err) return callback(err, null);
            if (results.length > 0) {
                callback(null, results[0]); // Return student data
            } else {
                callback(null, null); // No matching student
            }
        });
    }
};

module.exports = LoginModel;
