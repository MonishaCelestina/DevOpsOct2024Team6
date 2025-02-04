const express = require("express");
const router = express.Router();
const StudentController = require("../controllers/studentController"); // Import the controller


router.post("/login", StudentController.loginStudent);

// Route to fetch student details
router.get("/students/:studentID", StudentController.getStudentDetails);

router.get("/:studentID/redeemable-items", StudentController.getRedeemableItems);


router.post("/:studentID/redeem", StudentController.redeemItem);

// Route to get redeemed items (Uses Controller)
router.get('/:studentID/redeemed-items', StudentController.getRedeemedItems);



module.exports = router;
