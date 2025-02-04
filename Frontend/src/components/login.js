document.addEventListener("DOMContentLoaded", function () {
    const loginRole = localStorage.getItem("loginRole");
    const loginForm = document.getElementById("loginForm");
    const errorMessage = document.getElementById("errorMessage");

    if (!loginRole) {
        window.location.href = "login.html";
        return;
    }

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const endpoint = loginRole === "admin" ? "admin" : "student";
            const response = await fetch(`http://localhost:3000/api/${endpoint}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                //  role matches selected role
                if ((loginRole === "admin" && !data.admin) || (loginRole === "student" && !data.student)) {
                    alert("Incorrect role selected. Please choose the correct login option.");
                    localStorage.removeItem("loginRole");
                    window.location.href = "login.html"; 
                    return;
                }

                alert(`${loginRole.charAt(0).toUpperCase() + loginRole.slice(1)} Login Successful!`);

                if (loginRole === "admin") {
                    localStorage.setItem("admin", JSON.stringify(data.admin));
                    window.location.href = "admin.html";
                } else {
                    localStorage.setItem("student", JSON.stringify(data.student));
                    window.location.href = "student.html";
                }
            } else {
                errorMessage.textContent = data.message;
            }
        } catch (error) {
            console.error("Login Error:", error);
            errorMessage.textContent = "Something went wrong. Try again.";
        }
    });
});
