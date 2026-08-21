document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // GET RECEIPT DATA
    // =========================================

    const receiptData = JSON.parse(
        localStorage.getItem("receiptData")
    );


    // =========================================
    // IF DATA DOES NOT EXIST
    // =========================================

    if (!receiptData) {

        alert("Registration verification data not found.");

        window.location.href = "index.html";

        return;

    }


    // =========================================
    // STUDENT INFORMATION
    // =========================================

    document.getElementById("verifyName").textContent =
        receiptData.fullname || "-";


    document.getElementById("verifyCollege").textContent =
        receiptData.college || "-";


    document.getElementById("verifyDepartment").textContent =
        receiptData.department || "-";


    document.getElementById("verifyYear").textContent =
        receiptData.year || "-";


    // =========================================
    // EVENT INFORMATION
    // =========================================

    document.getElementById("verifyEvent").textContent =
        receiptData.event || "Event Registration";


    // =========================================
    // PAYMENT INFORMATION
    // =========================================

    document.getElementById("verifyMethod").textContent =
        receiptData.paymentMethod || "-";


    document.getElementById("verifyTransaction").textContent =
        receiptData.transactionId || "-";


    document.getElementById("verifyAmount").textContent =
        "₹" +
        Number(
            receiptData.amount || 1000
        ).toLocaleString("en-IN");

});