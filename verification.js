document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // GET RECEIPT DATA
    // ==========================================

    const receiptData = JSON.parse(
        localStorage.getItem("receiptData")
    );


    // ==========================================
    // CHECK DATA
    // ==========================================

    if (!receiptData) {

        alert("Verification data not found.");

        window.location.href = "index.html";

        return;

    }


    // ==========================================
    // STUDENT INFORMATION
    // ==========================================

    document.getElementById("verifyName").textContent =
        receiptData.fullname || "-";


    document.getElementById("verifyCollege").textContent =
        receiptData.college || "-";


    document.getElementById("verifyDepartment").textContent =
        receiptData.department || "-";


    document.getElementById("verifyYear").textContent =
        receiptData.year || "-";


    // ==========================================
    // EVENT INFORMATION
    // ==========================================

    document.getElementById("verifyEvent").textContent =
        receiptData.event || "-";


    // ==========================================
    // PAYMENT INFORMATION
    // ==========================================

    document.getElementById("verifyMethod").textContent =
        receiptData.paymentMethod || "-";


    document.getElementById("verifyTransaction").textContent =
        receiptData.transactionId || "-";


    document.getElementById("verifyAmount").textContent =
        "₹" + (
            receiptData.amount || 1000
        ).toLocaleString("en-IN");

});