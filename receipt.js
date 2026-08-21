document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // GET RECEIPT DATA
    // ==========================================

    const receiptData = JSON.parse(
        localStorage.getItem("receiptData")
    );


    // ==========================================
    // IF DATA DOES NOT EXIST
    // ==========================================

    if (!receiptData) {

        alert("Receipt data not found.");

        window.location.href = "register.html";

        return;

    }


    // ==========================================
    // SHOW EVENT DETAILS
    // ==========================================

    document.getElementById("receiptEvent").textContent =
        receiptData.event || "Event Registration";


    // ==========================================
    // SHOW STUDENT DETAILS
    // ==========================================

    document.getElementById("receiptName").textContent =
        receiptData.fullname || "-";


    document.getElementById("receiptEmail").textContent =
        receiptData.email || "-";


    document.getElementById("receiptCollege").textContent =
        receiptData.college || "-";


    document.getElementById("receiptDepartment").textContent =
        receiptData.department || "-";


    document.getElementById("receiptYear").textContent =
        receiptData.year || "-";


    // ==========================================
    // SHOW PAYMENT DETAILS
    // ==========================================

    document.getElementById("receiptMethod").textContent =
        receiptData.paymentMethod || "-";


    document.getElementById("receiptTransaction").textContent =
        receiptData.transactionId || "-";


    document.getElementById("receiptDate").textContent =
        receiptData.paymentDate || "-";


    document.getElementById("receiptAmount").textContent =
        "₹" + (
            receiptData.amount || 1000
        ).toLocaleString("en-IN");


    // ==========================================
    // OPEN RECEIPT QR VERIFICATION PAGE
    // ==========================================

    document.getElementById("openQR").addEventListener(
        "click",
        function () {

            window.location.href = "verification.html";

        }
    );


    // ==========================================
    // DOWNLOAD / PRINT RECEIPT
    // ==========================================

    document.getElementById("downloadReceipt").addEventListener(
        "click",
        function () {

            window.print();

        }
    );

});