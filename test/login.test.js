const request = require("supertest");
const app = require("../app"); // Import the Express app
const db = require("../Backend/db"); // Import the database connection

// Mock the database connection
jest.mock("../Backend/db", () => ({
    query: jest.fn(), // Mock the `query` function for testing
}));

describe("POST /login", () => {
    
    //  Test Student Login - Correct Credentials
    it("should return student data for correct credentials", async () => {
        // Mock DB query returning a student record
        db.query.mockImplementation((sql, values, callback) => {
            callback(null, [{ id: 1, email: "john.tan.2024@example.edu", name: "Test Student" }]);
        });

        const response = await request(app)
            .post("/login") // Student login route
            .send({ email: "john.tan.2024@example.edu", password: "password123" });

        expect(response.status).toBe(200);
        expect(response.body.student).toBeDefined();
        expect(response.body.student.email).toBe("john.tan.2024@example.edu");
    });

    //  Test Student Login - Incorrect Credentials
    it("should return an error for incorrect student credentials", async () => {
        // Mock DB query returning no matching student
        db.query.mockImplementation((sql, values, callback) => {
            callback(null, []);
        });

        const response = await request(app)
            .post("/login") // Student login route
            .send({ email: "wrong@student.com", password: "wrongpassword" });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid email or password");
    });

    //  Test Admin Login - Correct Credentials
    it("should return admin data for correct credentials", async () => {
        // Mock DB query returning an admin record
        db.query.mockImplementation((sql, values, callback) => {
            callback(null, [{ id: 1, email: "admin@example.com", name: "Library Admin" }]);
        });
    
        const response = await request(app)
            .post("/login") // Admin login route
            .send({ email: "admin@example.com", password: "adminpass123" });
    
        console.log("Admin Login Response:", response.body); // Debugging line
    
        expect(response.status).toBe(200);
        expect(response.body.admin).toBeDefined();
        expect(response.body.admin.email).toBe("admin@example.com");
    });
    
});


describe("POST /login - Failing Cases", () => {
    
    // Failing Case: Student Login - Incorrect Password
    it("should return an error for a student with a correct email but incorrect password", async () => {
        const response = await request(app)
            .post("/login")
            .send({ email: "john.tan.2024@example.edu", password: "wrongpassword" });

        expect(response.status).toBe(401); // Unauthorized
        expect(response.body.message).toBe("Invalid email or password");
    });

    // Failing Case: Student Login - Non-existent Email
    it("should return an error for a student with a non-existent email", async () => {
        const response = await request(app)
            .post("/login")
            .send({ email: "nonexistent@student.com", password: "password123" });

        expect(response.status).toBe(401); // Unauthorized
        expect(response.body.message).toBe("Invalid email or password");
    });

    // Failing Case: Admin Login - Incorrect Password
    it("should return an error for an admin with a correct email but incorrect password", async () => {
        const response = await request(app)
            .post("/login")
            .send({ email: "admin@example.com", password: "wrongpassword" });

        expect(response.status).toBe(401); // Unauthorized
        expect(response.body.message).toBe("Invalid email or password");
    });

    // Failing Case: Admin Login - Non-existent Email
    it("should return an error for an admin with a non-existent email", async () => {
        const response = await request(app)
            .post("/login")
            .send({ email: "wrongadmin@example.com", password: "adminpass123" });

        expect(response.status).toBe(401); // Unauthorized
        expect(response.body.message).toBe("Invalid email or password");
    });

    // Failing Case: Missing Email or Password
    it("should return an error if email or password is missing", async () => {
        const response = await request(app)
            .post("/login")
            .send({ email: "admin@example.com" }); // Missing password

        expect(response.status).toBe(400); // Bad Request
        expect(response.body.message).toBe("Email and password are required");
    });

});
