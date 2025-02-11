document.addEventListener("DOMContentLoaded", () => {
    loadStudents();
    loadItems();
});

// Fetch and display all students
function loadStudents() {
    fetch("http://localhost:3000/api/admin/students")
        .then(response => response.json())
        .then(students => {
            const tableBody = document.querySelector("#studentsTable tbody");
            tableBody.innerHTML = ""; 

            students.forEach(student => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${student.studentID || "N/A"}</td>
                    <td>${student.studentName || "N/A"}</td>
                    <td>${student.email || "N/A"}</td>
                    <td>${student.diploma || "N/A"}</td>
                    <td>${student.yearOfEntry || "N/A"}</td>
                    <td>${student.points || 0}</td>
                    <td>
                        <button onclick="openEditStudentModal('${student.studentID}', '${student.studentName}', '${student.email}', '${student.diploma}', '${student.yearOfEntry}', ${student.points})">
                             Edit
                        </button>
                        <button onclick="deleteStudent('${student.studentID}')"> Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error loading students:", error));
}



// Create a new student
function createStudent() {
    const studentID = prompt("Enter Student ID:");
    const studentName = prompt("Enter Student Name:");
    const email = prompt("Enter Student Email:");
    const password = prompt("Enter Student Password:");
    const points = prompt("Enter Initial Points:");

    if (!studentID || !studentName || !email || !password || points === null) {
        alert("All fields are required.");
        return;
    }

    fetch("http://localhost:3000/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            studentID,
            studentName,
            email,
            password,
            points: parseInt(points)
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadStudents();
    })
    .catch(error => console.error("Error creating student:", error));
}

// Edit a student
function editStudent(studentID) {
    const newStudentName = prompt("Enter new student name:");
    const newEmail = prompt("Enter new student email:");
    const newPoints = prompt("Enter new points:");

    if (!newStudentName || !newEmail || newPoints === null) {
        alert("All fields are required.");
        return;
    }

    fetch(`http://localhost:3000/api/admin/students/${studentID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            studentName: newStudentName,
            email: newEmail,
            points: parseInt(newPoints)
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadStudents();
    })
    .catch(error => console.error("Error editing student:", error));
}

// Delete a student
function deleteStudent(studentID) {
    if (!confirm("Are you sure you want to delete this student?")) {
        return;
    }

    fetch(`http://localhost:3000/api/admin/students/${studentID}`, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadStudents();
    })
    .catch(error => console.error("Error deleting student:", error));
}

// Search for students
function searchStudent() {
    const query = document.getElementById("searchStudent").value;
    if (!query) {
        alert("Enter a student ID or Name");
        return;
    }

    fetch(`http://localhost:3000/api/admin/students/search?q=${query}`)
        .then(response => response.json())
        .then(students => {
            const tableBody = document.querySelector("#studentsTable tbody");
            tableBody.innerHTML = ""; 

            students.forEach(student => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${student.studentID}</td>
                    <td>${student.studentName}</td>
                    <td>${student.email}</td>
                    <td>${student.diploma}</td>
                    <td>${student.yearOfEntry}</td>
                    <td>${student.points}</td>
                    <td>
                        <button onclick="editStudent('${student.studentID}')">Edit</button>
                        <button onclick="deleteStudent('${student.studentID}')">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error searching students:", error));
}

// Fetch and display redeemable items
function loadItems() {
    fetch("http://localhost:3000/api/admin/items")
        .then(response => response.json())
        .then(items => {
            const tableBody = document.querySelector("#itemsTable tbody");
            tableBody.innerHTML = ""; 

            items.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.itemName}</td>
                    <td>${item.pointsRequired}</td>
                    <td>${item.quantity}</td>
                    <td>
                        <button onclick="editItem(${item.itemID})">Edit</button>
                        <button onclick="deleteItem(${item.itemID})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error loading items:", error));
}

// Edit a redeemable item
function editItem(itemID) {
    const newItemName = prompt("Enter new item name:");
    const newPointsRequired = prompt("Enter new points required:");
    const newQuantity = prompt("Enter new quantity:");

    if (!newItemName || !newPointsRequired || !newQuantity) {
        alert("All fields are required.");
        return;
    }

    fetch(`http://localhost:3000/api/admin/items/${itemID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            itemName: newItemName,
            pointsRequired: parseInt(newPointsRequired),
            quantity: parseInt(newQuantity)
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadItems();
    })
    .catch(error => console.error("Error editing item:", error));
}

// Delete an item
function deleteItem(itemID) {
    if (!confirm("Are you sure you want to delete this item?")) {
        return;
    }

    fetch(`http://localhost:3000/api/admin/items/${itemID}`, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadItems();
    })
    .catch(error => console.error("Error deleting item:", error));
}

// Show the Create Student Modal
function openStudentModal() {
    document.getElementById("createStudentModal").style.display = "block";
}

// Close the Modal
function closeStudentModal() {
    document.getElementById("createStudentModal").style.display = "none";
}

function openStudentModal() {
    document.getElementById("createStudentModal").style.display = "block";
}

// Handle Student Form Submission
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("createStudentForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const studentID = document.getElementById("studentID").value.trim();
        const studentName = document.getElementById("studentName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const diploma = document.getElementById("diploma").value.trim();
        const yearOfEntry = document.getElementById("yearOfEntry").value.trim();
        const points = document.getElementById("points").value.trim();

        // Ensure studentID is not an email and is within 10 characters
        if (studentID.length > 10 || studentID.includes("@")) {
            alert("Student ID must be a maximum of 10 characters and cannot be an email.");
            return;
        }

        if (!studentID || !studentName || !email || !password || !diploma || !yearOfEntry || points === null) {
            alert("All fields are required.");
            return;
        }

        fetch("http://localhost:3000/api/admin/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                studentID,
                studentName,
                email,
                password,
                diploma,
                yearOfEntry: parseInt(yearOfEntry),
                points: parseInt(points)
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadStudents();
            closeStudentModal();
        })
        .catch(error => console.error("Error creating student:", error));
    });
});

// Open Edit Student Modal
function openEditStudentModal(studentID, studentName, email, diploma, yearOfEntry, points) {
    document.getElementById("editStudentID").value = studentID;
    document.getElementById("editStudentName").value = studentName;
    document.getElementById("editEmail").value = email;
    document.getElementById("editDiploma").value = diploma;
    document.getElementById("editYearOfEntry").value = yearOfEntry;
    document.getElementById("editPoints").value = points;

    document.getElementById("editStudentModal").style.display = "block";
}

// Close Edit Student Modal
function closeEditStudentModal() {
    document.getElementById("editStudentModal").style.display = "none";
}
// Submit Edited Student Data
document.getElementById("editStudentForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const studentID = document.getElementById("editStudentID").value;
    const studentName = document.getElementById("editStudentName").value;
    const email = document.getElementById("editEmail").value;
    const diploma = document.getElementById("editDiploma").value;
    const yearOfEntry = document.getElementById("editYearOfEntry").value;
    const password = document.getElementById("editPassword").value; // Optional field
    const points = document.getElementById("editPoints").value;

    const updatedStudent = {
        studentName,
        email,
        diploma,
        yearOfEntry: parseInt(yearOfEntry),
        points: parseInt(points),
    };

    if (password) {
        updatedStudent.password = password; // Only include password if entered
    }

    fetch(`http://localhost:3000/api/admin/students/${studentID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStudent)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadStudents();
        closeEditStudentModal();
    })
    .catch(error => console.error("Error updating student:", error));
});
// Logout function
function logout() {
    localStorage.removeItem("admin");
    window.location.href = "loginpage.html";
}

function handleCSVUpload(event) {
    event.preventDefault(); // Prevent page reload

    const fileInput = document.getElementById("csvFileInput");
    const file = fileInput.files[0];
    const uploadStatus = document.getElementById("uploadStatus");

    if (!file) {
        alert("Please select a CSV file.");
        return;
    }

    const formData = new FormData();
    formData.append("csvFile", file);

    fetch("http://localhost:3000/api/admin/upload-csv", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Show success message
        uploadStatus.textContent = ` ${data.message}`;
        uploadStatus.style.color = "green";

        // Refresh student list
        loadStudents();
    })
    .catch(error => {
        console.error("Error uploading CSV:", error);
        uploadStatus.textContent = " Upload failed!";
        uploadStatus.style.color = "red";
    });
}
