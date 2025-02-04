const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const studentRoutes = require('./Backend/routes/studentRoutes'); // Student-related routes
const loginRoutes = require('./Backend/routes/loginRoutes'); // Login and authentication routes
const adminRoutes = require("./Backend/routes/adminRoutes");

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Middleware for parsing JSON request bodies
app.use(bodyParser.json());

// Attach Routes
app.use('/', loginRoutes); // Keep login routes at root "/"
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);

// **Only start the server if not in test mode**
if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}

// **Export app for testing**
module.exports = app;
