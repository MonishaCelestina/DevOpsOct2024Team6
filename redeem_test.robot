*** Settings ***
Library    SeleniumLibrary
Documentation   Automated test cases for the student gamification system

*** Variables ***
${BROWSER}         chrome
${BASE_URL}        file:///C:/Users/tracia/OneDrive/Desktop/school/DOP/DOP%20ASG%20(team%206)/DEVOPS%20ASG/DevOpsOct2024Team6/redeemed.html

*** Test Cases ***

Redeem Points
    [Documentation]    Verify that the Student can log in successfully
    Open Browser    ${BASE_URL}    ${BROWSER}
    Click Button    id=student-page
    Wait Until Element Is Visible    name=studentPoints    timeout=5s
    Click Button    id=redeem-btn 
    Alert Should Be Present     Item redeemed successfully!
    Handle Alert    OK
    Close Browser
    

    

