const request = require("supertest");
const app = require("../app"); // Import the Express app
const db = require("../Backend/db"); // Import the mocked database connection

// Mock the database connection
jest.mock("../Backend/db", () => ({
    query: jest.fn(), // Mock database query function
}));

describe("Admin API Tests", () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    /** ✅ 1. Test Fetching All Students */
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

    /** ✅ 2. Test Searching Students */
    it("should search students by name or ID", async () => {
        db.query.mockImplementation((sql, values, callback) => {
            callback(null, [{ studentID: "123", studentName: "Alice", email: "alice@example.com" }]);
        });

        const response = await request(app).get("/api/admin/students/search?q=Alice");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].studentName).toBe("Alice");
    });

    /** ✅ 3. Test Creating a New Student */
    it("should create a new student", async () => {
        db.query.mockImplementation((sql, values, callback) => {
            callback(null, { insertId: 789 });
        });

        const response = await request(app)
        .post("/api/admin/students")
        .send({
            studentID: "789",
            studentName: "Charlie",
            email: "charlie@example.com",
            password: "test123",
            diploma: "Computer Science", //  Added missing field
            yearOfEntry: 2024, //  Added missing field
            points: 50
        });
    

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Student created successfully");
    });

    /** ✅ 4. Test Updating a Student */
    it("should update student details", async () => {
        db.query.mockImplementation((sql, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const response = await request(app)
        .put("/api/admin/students/123")
        .send({
            studentName: "Alice Updated",
            email: "alice.updated@example.com",
            diploma: "Mathematics", //  Added missing field
            yearOfEntry: 2023, //  Added missing field
            points: 200
        });
    
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Student updated successfully");
    });

    /** ✅ 5. Test Deleting a Student */
    it("should delete a student", async () => {
        db.query.mockImplementation((sql, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const response = await request(app).delete("/api/admin/students/123");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Student deleted successfully");
    });

    /** ✅ 6. Test Fetching All Redeemable Items */
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

    /** ✅ 7. Test Creating a Redeemable Item */
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

    /** ✅ 8. Test Updating a Redeemable Item */
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

    /** ✅ 9. Test Deleting a Redeemable Item */
    it("should delete a redeemable item", async () => {
        db.query.mockImplementation((sql, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const response = await request(app).delete("/api/admin/items/1");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Item deleted successfully");
    });

    /** ✅ 10. Test Admin Login */
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

    /** ✅ 11. Test Admin Login with Incorrect Credentials */
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
});
