const request = require("supertest");
const app = require("../app"); // Import the Express app
const db = require("../Backend/db"); // Import the mocked database connection
const fs = require("fs");
const path = require("path");

// Mock the database connection
jest.mock("../Backend/db", () => ({
    query: jest.fn(), // Mock database query function
}));

describe("Admin API Tests", () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    //  1. Test Fetching All Students //
    it("should fetch all students", async () => {
        db.query.mockImplementation((sql, callback) => {
            callback(null, [
                { studentID: "123", studentName: "Alice", email: "alice@example.com", points: 100 },
                { studentID: "456", studentName: "Bob", email: "bob@example.com", points: 150 }
            ]);
        });

        const response = await request(app).get("/api/admin/students");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });

    // 2. Test Searching Students //
    it("should search students by name or ID", async () => {
        db.query.mockImplementation((sql, values, callback) => {
            callback(null, [{ studentID: "123", studentName: "Alice", email: "alice@example.com" }]);
        });

        const response = await request(app).get("/api/admin/students/search?q=Alice");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].studentName).toBe("Alice");
    });

//  2. Test Searching Students //
it("should search students by name or ID and return all fields", async () => {
    db.query.mockImplementation((sql, values, callback) => {
        callback(null, [{
            studentID: "123",
            studentName: "Alice",
            email: "alice@example.com",
            diploma: "Computer Science",
            yearOfEntry: 2023,
            points: 100
        }]);
    });

    const response = await request(app).get("/api/admin/students/search?q=Alice");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].studentID).toBe("123");
    expect(response.body[0].studentName).toBe("Alice");
    expect(response.body[0].email).toBe("alice@example.com");
    expect(response.body[0].diploma).toBe("Computer Science");
    expect(response.body[0].yearOfEntry).toBe(2023);
    expect(response.body[0].points).toBe(100);
});

    //  4. Test Updating a Student //
    it("should update student details", async () => {
        db.query.mockImplementation((sql, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const response = await request(app)
        .put("/api/admin/students/123")
        .send({
            studentName: "Alice Updated",
            email: "alice.updated@example.com",
            diploma: "Mathematics", 
            yearOfEntry: 2023, 
            points: 200
        });
    
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Student updated successfully");
    });

    //  5. Test Deleting a Student //
    it("should delete a student", async () => {
        db.query.mockImplementation((sql, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const response = await request(app).delete("/api/admin/students/123");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Student deleted successfully");
    });

    //  6. Test Fetching All Redeemable Items //
    it("should fetch all redeemable items", async () => {
        db.query.mockImplementation((sql, callback) => {
            callback(null, [
                { itemID: 1, itemName: "Notebook", pointsRequired: 50, quantity: 10 },
                { itemID: 2, itemName: "Pen", pointsRequired: 20, quantity: 15 }
            ]);
        });

        const response = await request(app).get("/api/admin/items");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });

    //  7. Test Creating a Redeemable Item //
    it("should create a new redeemable item", async () => {
        db.query.mockImplementation((sql, values, callback) => {
            callback(null, { insertId: 3 });
        });

        const response = await request(app)
            .post("/api/admin/items")
            .send({ itemName: "Gift Card", pointsRequired: 100, quantity: 5 });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Item created successfully");
    });

    //  8. Test Updating a Redeemable Item //
    it("should update a redeemable item", async () => {
        db.query.mockImplementation((sql, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const response = await request(app)
            .put("/api/admin/items/1")
            .send({ itemName: "Notebook Updated", pointsRequired: 60, quantity: 8 });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Item updated successfully");
    });

    //  9. Test Deleting a Redeemable Item //
    it("should delete a redeemable item", async () => {
        db.query.mockImplementation((sql, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const response = await request(app).delete("/api/admin/items/1");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Item deleted successfully");
    });

    // 10. Test Admin Login //
    it("should login an admin with correct credentials", async () => {
        db.query.mockImplementation((sql, values, callback) => {
            callback(null, [{ id: 1, email: "admin@example.com", name: "Library Admin" }]);
        });

        const response = await request(app)
            .post("/api/admin/login")
            .send({ email: "admin@example.com", password: "adminpass123" });

        expect(response.status).toBe(200);
        expect(response.body.admin).toBeDefined();
        expect(response.body.admin.email).toBe("admin@example.com");
    });

    //  11. Test Admin Login with Incorrect Credentials //
    it("should return an error for incorrect admin credentials", async () => {
        db.query.mockImplementation((sql, values, callback) => {
            callback(null, []);
        });

        const response = await request(app)
            .post("/api/admin/login")
            .send({ email: "wrong@admin.com", password: "wrongpassword" });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid email or password");
    });

    it("should upload a CSV file and insert students", async () => {
        //  Create a mock CSV file
        const csvPath = path.join(process.cwd(), "students.csv");

        fs.writeFileSync(csvPath, "studentID,studentName,diploma,yearOfEntry,email,password,points\nA1234570A,Emily Chen,Diploma in Design,2022,emily.chen@example.edu,pass12345,100\nA1234571B,David Lee,Diploma in Marketing,2021,david.lee@example.edu,password321,75");
    
        //  Send the file using Supertest
        const response = await request(app)
            .post("/api/admin/upload-csv")
            .attach("csvFile", csvPath);
    
        fs.unlinkSync(csvPath); //  Delete the test file after the test
    
        //  Assertions
        expect(response.status).toBe(200);
        expect(response.body.message).toContain("Successfully added");
    });

        // 1. Test Uploading a CSV File */
        it("should upload a CSV file and insert students", async () => {
            const csvPath = path.join(__dirname, "students.csv");
    
            //  Ensure the file exists before using it
            if (!fs.existsSync(csvPath)) {
                fs.writeFileSync(csvPath, "studentID,studentName,diploma,yearOfEntry,email,password,points\nA1234570A,Emily Chen,Diploma in Design,2022,emily.chen@example.edu,pass12345,100\nA1234571B,David Lee,Diploma in Marketing,2021,david.lee@example.edu,password321,75");
    
                //  Send the file using Supertest
            }
    
            //  Mock the database bulk insert query
            db.query.mockImplementation((sql, values, callback) => {
                if (sql.startsWith("INSERT INTO Students")) {
                    callback(null, { affectedRows: values.length }); // Simulate successful insertion
                } else {
                    callback(null, []);
                }
            });
    
            //  Upload the file using Supertest
            const response = await request(app)
                .post("/api/admin/upload-csv")
                .attach("csvFile", csvPath);
    
            // Cleanup: Delete the test CSV file after test
            fs.unlinkSync(csvPath);
    
            // Assertions
            expect(response.status).toBe(200);
            expect(response.body.message).toContain("Successfully added");
        });
    
    
        // 3. Test Searching Students (With Updated Fields) //
        it("should search students by name or ID", async () => {
            db.query.mockImplementation((sql, values, callback) => {
                callback(null, [{ 
                    studentID: "A1234570A", 
                    studentName: "Emily Chen", 
                    email: "emily.chen@example.edu", 
                    diploma: "Diploma in Design", 
                    yearOfEntry: 2022, 
                    points: 100 
                }]);
            });
    
            const response = await request(app).get("/api/admin/students/search?q=Emily");
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0].studentName).toBe("Emily Chen");
            expect(response.body[0].diploma).toBe("Diploma in Design");
            expect(response.body[0].yearOfEntry).toBe(2022);
        });
    
});
