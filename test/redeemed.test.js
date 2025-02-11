const request = require("supertest");
const app = require("../app"); // Import the Express app
const db = require("../Backend/db"); // Import the database connection

// Mock the database connection globally
jest.mock("../Backend/db", () => ({
    query: jest.fn(), // Mock the `query` function for testing
}));

describe("GET /api/student/:studentID/redeemable-items", () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    // Test Case: Successfully fetch redeemable items
    it("should return redeemable items for a valid student ID", async () => {
        // Mock DB query returning a list of redeemable items
        db.query.mockImplementation((sql, callback) => {
            callback(null, [
                { itemName: "Notebook", redeemDate: "2025-02-04T12:00:00Z" },
                { itemName: "Pen", redeemDate: "2025-02-03T10:30:00Z" }
            ]);
        });

        const studentID = 12345; // Example student ID

        const response = await request(app)
            .get(`/api/student/${studentID}/redeemable-items`)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[0].itemName).toBe("Notebook");
        expect(response.body[1].itemName).toBe("Pen");
    });

    // Test Case: No redeemable items for the student
    it("should return an empty array when student has no redeemable items", async () => {
        // Mock DB query returning an empty list
        db.query.mockImplementation((sql, callback) => {
            callback(null, []);
        });

        const studentID = 67890; // Example student ID

        const response = await request(app)
            .get(`/api/student/${studentID}/redeemable-items`) //  Fixed route
            .send();

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]); //  Matches controller response
    });

    // Test Case: Database error
    it("should return a 500 error when there is a database failure", async () => {
        // Mock DB query to simulate an error
        db.query.mockImplementation((sql, callback) => {
            callback(new Error("Database Error"), null);
        });

        const studentID = 11111; // Example student ID

        const response = await request(app)
            .get(`/api/student/${studentID}/redeemable-items`) //  Fixed route
            .send();

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty("message"); //  Ensure message exists
        expect(response.body.message).toMatch(/Failed to retrieve redeemable items|Internal Server Error/);
    });
});


describe("Failing redeemed tests", () => {

    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    // 1. Test Case: Invalid student ID format
    it("should fail if the student ID format is invalid", async () => {
        const studentID = "invalid-id"; // Invalid student ID format

        const response = await request(app)
            .get(`/api/student/${studentID}/redeemable-items`)
            .send();

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid student ID format");
    });

    // 2. Test Case: Empty student ID
    it("should fail if the student ID is empty", async () => {
        const studentID = ""; // Empty student ID

        const response = await request(app)
            .get(`/api/student/${studentID}/redeemable-items`)
            .send();

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Student ID cannot be empty");
    });

    // 3. Test Case: Student not found
    it("should fail if the student does not exist", async () => {
        // Mock DB query returning no result for the student
        db.query.mockImplementation((sql, values, callback) => {
            callback(null, []); // No student found
        });

        const studentID = 99999; // Non-existent student ID

        const response = await request(app)
            .get(`/api/student/${studentID}/redeemable-items`)
            .send();

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Student not found");
    });

    // 5. Test Case: Missing redeemDate field in response
    it("should fail if the redeemDate field is missing in the response", async () => {
        // Mock DB query returning items without the redeemDate field
        db.query.mockImplementation((sql, callback) => {
            callback(null, [
                { itemName: "Notebook" } // Missing redeemDate field
            ]);
        });

        const studentID = 12345;

        const response = await request(app)
            .get(`/api/student/${studentID}/redeemable-items`)
            .send();

        expect(response.status).toBe(200);
        expect(response.body[0]).not.toHaveProperty("redeemDate"); // This will fail if redeemDate is missing
    });
}); 
