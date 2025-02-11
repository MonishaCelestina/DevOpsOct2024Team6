*** Settings ***
Library    SeleniumLibrary
Documentation   Automated test cases for the student gamification system

*** Variables ***
${BROWSER}         chrome
${BASE_URL}        file:///C:/Users/tracia/OneDrive/Desktop/school/DOP/DOP%20ASG%20(team%206)/DEVOPS%20ASG/DevOpsOct2024Team6/loginpage.html
${ADMIN_USER}      admin@example.com
${ADMIN_PASS}      adminpass123
${ADMIN_WRONGPASS}      adminpass
${STUDENT_USER}    john.tan.2024@example.edu
${STUDENT_PASS}    password123
${STUDENT_WRONGPASS}      password
${EXPECTED_PAGE}  recover_password.html

*** Test Cases ***


Login as Admin
    [Documentation]    Verify that the Admin can log in successfully
    Open Browser    ${BASE_URL}    ${BROWSER}
    Click Button    id=admin-role
    Wait Until Element Is Visible    name=email    timeout=5s
    Input Text    name=email    ${ADMIN_USER}
    Input Text    name=password    ${ADMIN_PASS}
    Click Button    id=submit-button  # Using the id of the login button now
    Close Browser


Login as Student
    [Documentation]    Verify that the Student can log in successfully
    Open Browser    ${BASE_URL}    ${BROWSER}
    Click Button    id=student-role
    Wait Until Element Is Visible    name=email    timeout=5s
    Input Text    name=email    ${STUDENT_USER}
    Input Text    name=password    ${STUDENT_PASS}
    Click Button    id=submit-button  # Using the id of the login button now
    Close Browser

Login as Student Invalid Password
    [Documentation]    Verify that the Student can log in successfully
    Open Browser    ${BASE_URL}    ${BROWSER}
    Click Button    id=student-role
    Wait Until Element Is Visible    name=email    timeout=5s
    Input Text    name=email    ${STUDENT_USER}
    Input Text    name=password    ${STUDENT_WRONGPASS}
    Click Button    id=submit-button  # Using the id of the login button now
    Wait Until Element Is Visible    xpath=//div[@class='error-message']    timeout=5s  # Wait for the error message to be visible
    Element Should Contain    xpath=//div[@class='error-message']    Invalid email or password  # Verify error message
    Close Browser


Recover Password
    [Documentation]    Allows user to recover password
    [tags]    acceptance
    Open Browser    ${BASE_URL}    ${BROWSER}
    Click Button    id=admin-role
    Wait Until Element Is Visible  id=recover-password  10s  # Wait for the link to be visible
    Click Element  id=recover-password
    Title Should Be   Recover Password  # Verify that the page title is correct 
    Close Browser