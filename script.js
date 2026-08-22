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

        localStorage.setItem(
            "studentData",
            JSON.stringify(studentData)
        );

        localStorage.setItem(
            "registrationData",
            JSON.stringify(studentData)
        );

        console.log("SAVED DATA:", studentData);

        window.location.href = "payment.html";

    });

}