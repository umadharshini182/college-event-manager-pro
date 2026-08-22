// ==========================
// REGISTRATION FORM
// ==========================

const form = document.getElementById("registrationForm");

if (form) {

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const studentData = {
            fullname: document.querySelector('input[name="fullname"]').value.trim(),
            email: document.querySelector('input[name="email"]').value.trim(),
            college: document.querySelector('input[name="college"]').value.trim(),
            department: document.getElementById("department").value,
            year: document.getElementById("year").value,
            event: document.getElementById("event").value
        };

        if (
            !studentData.fullname ||
            !studentData.email ||
            !studentData.college ||
            !studentData.department ||
            !studentData.year ||
            !studentData.event
        ) {
            alert("Please fill all registration details.");
            return;
        }

        localStorage.setItem(
            "studentData",
            JSON.stringify(studentData)
        );

        console.log("STUDENT DATA SAVED:", studentData);

        window.location.href = "payment.html";

    });

}