# DevOpsOct2024Team6

Contributions:

Scrum Master - Tracia Lee
- Sprint and Backlog Management
- Development and Testing Support
- Communication and Coordination
- Sprint Review and Retrospective

Technical Lead - Chat Ming Kai
- 

Quality Assurance Lead - Khanh Linh
- Test Case Development
- Test Script Development and Automation
- Test Execution and Results ---> pass/fail test case records.
- Acceptance Testing
- Development Support

Developer - Monisha Celestina
Feature Development
- Designed and implemented the entire backend using Node.js, Express.js, and MySQL.
- Developed the frontend using HTML, CSS, and JavaScript, ensuring seamless integration with the backend.
- Implemented user authentication for students and admins, with secure login handling.
Developed Admin functionalities:
- Manage students: Create, modify, delete, list, and search for student accounts.
- CSV Upload: Enabled bulk student account creation via CSV file uploads.
- Manage redemption items: Create, modify, and delete redeemable items.
Developed Student functionalities:
- View available points and redeemable items.
- Redeem items only if they have enough points (prevents negative balances).
- Track previously redeemed items.

Automated Testing & CI/CD Integration
- Implemented unit testing for API endpoints using Jest to verify: User authentication (students & admins), Fetching student details and redeemable items, Processing item redemptions and updating student points and CRUD operations for students and redeemable items.
- Mocked the database in test cases to allow testing without an active MySQL connection.
- Integrated Jest HTML reports, automatically generating detailed test reports.
- Created and configured the entire GitHub Actions YAML pipeline:
Automated testing and preparation for deployment.
- Pipeline triggers on push and pull request events.
- Runs Jest tests, generates coverage reports, and uploads test results as GitHub Actions artifacts.
- Enabled continue-on-error: true to allow debugging without blocking the CI/CD workflow.

Stakeholder Notifications via Discord Webhooks
- Created and configured the Discord server and webhooks for automated notifications.
- Notifications are structured as follows:
  -  Commits containing "feat" or "fix" notify both business stakeholders and the technical team.
  - All other commits notify only the technical team to avoid unnecessary alerts.
- Secured webhook URLs by storing them in GitHub Secrets, ensuring safe integration.

Database creation
- Designed and optimized MySQL queries for: Student management (creating, updating, and deleting students), Redeemable items , Redemption transactions , Fetching student and admin information

Monitoring Testing Results
- Configured Jest HTML reports to automatically upload after every test execution in GitHub Actions.
