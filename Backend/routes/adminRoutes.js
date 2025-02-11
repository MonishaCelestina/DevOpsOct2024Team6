const express = require("express");
const AdminController = require("../controllers/adminController"); // Ensure correct import

const router = express.Router();

// Student Management
router.get("/students", AdminController.getAllStudents);
router.get("/students/search", AdminController.searchStudent);
router.post("/students", AdminController.createStudent);
router.put("/students/:studentID", AdminController.updateStudent);
router.delete("/students/:studentID", AdminController.deleteStudent);

// Redeemable Items Management
router.get("/items", AdminController.getAllItems);
router.post("/items", AdminController.createItem);
router.put("/items/:itemID", AdminController.updateItem);
router.delete("/items/:itemID", AdminController.deleteItem);

// Admin Login
router.post("/login", AdminController.loginAdmin);
router.post("/students", AdminController.createStudent);
router.put("/students/:studentID", AdminController.updateStudent);

const multer = require("multer");
const upload = multer({ dest: "uploads/" });
router.post("/upload-csv", upload.single("csvFile"), AdminController.uploadCSV);

module.exports = router;
