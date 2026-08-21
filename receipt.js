document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // GET RECEIPT DATA
    // =========================================

    const receiptData = JSON.parse(
        localStorage.getItem("receiptData")
    );


    // =========================================
    // IF RECEIPT DATA DOES NOT EXIST
    // =========================================

    if (!receiptData) {

        alert("Receipt data not found.");

        window.location.href = "payment.html";

        return;

    }


    // =========================================
    // SHOW EVENT DETAILS
    // =========================================

    document.getElementById("receiptEvent").textContent =
        receiptData.event || "Event Registration";


    // =========================================
    // SHOW STUDENT DETAILS
    // =========================================

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


    // =========================================
    // SHOW PAYMENT DETAILS
    // =========================================

    document.getElementById("receiptMethod").textContent =
        receiptData.paymentMethod || "-";


    document.getElementById("receiptTransaction").textContent =
        receiptData.transactionId || "-";


    document.getElementById("receiptDate").textContent =
        receiptData.paymentDate || "-";


    document.getElementById("receiptAmount").textContent =
        "₹" +
        Number(
            receiptData.amount || 1000
        ).toLocaleString("en-IN");


    // =========================================
    // VERIFY REGISTRATION BUTTON
    // =========================================

    const openQR =
        document.getElementById("openQR");


    if (openQR) {

        openQR.addEventListener("click", function () {
        window.location.href =
    "verification.html";

        });

    }


    // =========================================
    // PRINT / SAVE RECEIPT
    // =========================================

    const downloadReceipt =
        document.getElementById("downloadReceipt");


    if (downloadReceipt) {

        downloadReceipt.addEventListener(
            "click",
            function () {

                // Change button temporarily

                const originalText =
                    downloadReceipt.innerHTML;


                downloadReceipt.innerHTML =
                    "Preparing Receipt...";


                downloadReceipt.disabled = true;


                // Open browser print dialog

                setTimeout(function () {

                    downloadReceipt.innerHTML =
                        originalText;


                    downloadReceipt.disabled = false;


                    window.print();

                }, 500);

            }
        );

    }

});