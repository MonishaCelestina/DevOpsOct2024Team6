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
