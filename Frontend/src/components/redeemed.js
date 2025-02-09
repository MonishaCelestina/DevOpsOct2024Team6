document.addEventListener("DOMContentLoaded", async function () {
    const student = JSON.parse(localStorage.getItem("student"));
    const studentName = document.getElementById("studentName");
    const redeemedItemsContainer = document.getElementById("redeemedItemsContainer");

    if (!student) {
        window.location.href = "loginpage.html";
        return;
    }

    studentName.textContent = student.studentName;

    try {
        console.log(`Fetching redeemed items for student ID: ${student.studentID}`); // Debug log

        const response = await fetch(`http://localhost:3000/api/student/${student.studentID}/redeemed-items`);

        console.log("Backend Response Status:", response.status); // Debug log

        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`);
        }

        const redeemedItems = await response.json();
        console.log("Redeemed Items Response:", redeemedItems); // Debug log

        if (redeemedItems.length > 0) {
            redeemedItemsContainer.innerHTML = "";
            redeemedItems.forEach(item => {
                const redeemDate = item.redeemDate ? new Date(item.redeemDate).toLocaleString() : "Date not available";
                const itemDiv = document.createElement("div");
                itemDiv.innerHTML = `<p>${item.itemName} - Redeemed on ${redeemDate}</p>`;
                redeemedItemsContainer.appendChild(itemDiv);
            });
        } else {
            redeemedItemsContainer.innerHTML = "<p>You haven't redeemed any items yet.</p>";
        }
    } catch (error) {
        console.error(" Error fetching redeemed items:", error);
        redeemedItemsContainer.innerHTML = "<p>Failed to load redeemed items.</p>";
    }
});
