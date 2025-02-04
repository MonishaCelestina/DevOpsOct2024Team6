const mysql = require('mysql2');
const dbConfig = require('../Backend/dbConfig'); // Import dbConfig.js

// Create a connection
const connection = mysql.createConnection(dbConfig);

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL Database');
});

// Export connection to use in other files
module.exports = connection;
