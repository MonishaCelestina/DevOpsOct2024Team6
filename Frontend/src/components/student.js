document.addEventListener("DOMContentLoaded", async function () {
    const student = JSON.parse(localStorage.getItem("student"));

    if (!student) {
        window.location.href = "loginpage.html";
        return;
    }

    document.getElementById("studentName").textContent = student.studentName;
    document.getElementById("studentPoints").textContent = student.points;

    console.log("Fetching redeemable items on page load...");
    await fetchRedeemableItems(); 
});

async function fetchRedeemableItems() {
    try {
        const student = JSON.parse(localStorage.getItem("student"));
        if (!student) {
            console.error("No student found in localStorage");
            return;
        }

        const response = await fetch(`http://localhost:3000/api/student/${student.studentID}/redeemable-items`);
        
        if (!response.ok) {
            console.error(`Failed to fetch redeemable items. Status: ${response.status}`);
            return;
        }

        const items = await response.json();
        console.log("Fetched redeemable items:", items);

        const itemsContainer = document.getElementById("itemsContainer");

        // Check if the element exists before trying to manipulate it
        if (!itemsContainer) {
            console.error("Error: itemsContainer element not found in the DOM.");
            return;
        }

        itemsContainer.innerHTML = ""; // Clear previous items

        if (items.length > 0) {
            items.forEach(item => {
                const itemDiv = document.createElement("div");
                itemDiv.innerHTML = `
                    <p>${item.itemName} - ${item.pointsRequired} Points</p>
                    <button onclick="redeemItem('${item.itemID}', ${item.pointsRequired})">Redeem</button>
                `;
                itemsContainer.appendChild(itemDiv);
            });
        } else {
            itemsContainer.innerHTML = "<p>No items available for redemption.</p>";
        }
    } catch (error) {
        console.error("Error fetching redeemable items:", error);
    }
}


async function redeemItem(itemID, pointsRequired) {
    const student = JSON.parse(localStorage.getItem("student"));

    if (student.points < pointsRequired) {
        alert("Not enough points!");
        return;
    }

    try {
        console.log(`Attempting to redeem itemID: ${itemID} for studentID: ${student.studentID}`);

        const response = await fetch(`http://localhost:3000/api/student/${student.studentID}/redeem`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ itemID }), 
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(`Failed to redeem item. Status: ${response.status}, Error: ${errorMessage}`);
            alert(`Failed to redeem item: ${errorMessage}`);
            return;
        }

        const data = await response.json();
        alert("Item redeemed successfully!");

        student.points -= pointsRequired;
        localStorage.setItem("student", JSON.stringify(student));
        document.getElementById("studentPoints").textContent = student.points;

        fetchRedeemableItems();
    } catch (error) {
        console.error("Error redeeming item:", error);
    }
}

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("student");
    window.location.href = "loginpage.html";
});
