module.exports = {
    testEnvironment: "node",
    reporters: ["default", "jest-html-reporter"],
    globals: {
      "jest-html-reporter": {
        outputPath: "jest-report.html",  // Name of the report file
        includeFailureMsg: true,        // Include failure messages in the report
        includeConsoleLog: true,        // Include console logs in the report
        theme: "lightTheme"             // Use light theme for the report
      }
    }
  };
  