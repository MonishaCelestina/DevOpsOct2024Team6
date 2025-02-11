*** Settings ***
Library    SeleniumLibrary
Documentation   Automated test cases for the student gamification system

*** Variables ***
${BROWSER}         chrome
${BASE_URL}        file:///C:/Users/tracia/OneDrive/Desktop/school/DOP/DOP%20ASG%20(team%206)/DEVOPS%20ASG/DevOpsOct2024Team6/admin.html
${STUDENT_ID}      28483
${STUDENT_NAME}    John Lee
${DIPLOMA}         Computer Science
${YEAR_OF_ENTRY}   2025
${EMAIL}           john.lee@example.com
${PASSWORD}        password123
${POINTS}          100

*** Test Cases ***


Create Student
    [Documentation]    Verify that a new student can be created successfully through the modal
    Open Browser    ${BASE_URL}    ${BROWSER}
    Click Button    id=create-new-student    # Assuming there’s a button to open the modal
    Wait Until Element Is Visible    name=modal-content    timeout=3s
    Input Text    id=studentID    ${STUDENT_ID}
    Input Text    id=studentName    ${STUDENT_NAME}
    Input Text    id=diploma    ${DIPLOMA}
    Input Text    id=yearOfEntry    ${YEAR_OF_ENTRY}
    Input Text    id=email    ${EMAIL}
    Input Text    id=password    ${PASSWORD}
    Input Text    id=points    ${POINTS}
    Click Button    id=create-student    # Clicking the create button to submit the form
    