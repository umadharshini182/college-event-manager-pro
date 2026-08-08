document.addEventListener("DOMContentLoaded", function () {

    const student =
        JSON.parse(localStorage.getItem("studentData"));

    if (!student) {

        alert("Receipt data not found. Please register again.");

        window.location.href = "register.html";

        return;
    }


    const registrationId =
        student.registrationId;


    if (!registrationId) {

        alert("Registration ID not found.");

        window.location.href = "register.html";

        return;
    }


    // Receipt number
    const receiptNumber =
        "REC-" +
        String(registrationId).padStart(6, "0");


    // Transaction ID
    const transactionId =
        "TXN-" +
        Date.now();


    // Payment date
    const paymentDate =
        new Date().toLocaleString("en-IN");


    // Fill receipt information

    document.getElementById("receiptId").textContent =
        receiptNumber;

    document.getElementById("receiptIdBody").textContent =
        receiptNumber;

    document.getElementById("registrationId").textContent =
        registrationId;

    document.getElementById("transactionId").textContent =
        transactionId;

    document.getElementById("paymentDate").textContent =
        paymentDate;


    // Student details

    document.getElementById("studentName").textContent =
        student.fullname || "-";

    document.getElementById("studentEmail").textContent =
        student.email || "-";

    document.getElementById("college").textContent =
        student.college || "-";

    document.getElementById("department").textContent =
        student.department || "-";

    document.getElementById("year").textContent =
        student.year || "-";

    document.getElementById("event").textContent =
        student.event || "-";

});