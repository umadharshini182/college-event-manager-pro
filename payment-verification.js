document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // GET ELEMENTS
    // =========================================

    const selectedMethodText =
        document.getElementById("selectedMethodText");

    const viewReceipt =
        document.getElementById("viewReceipt");


    // =========================================
    // GET SELECTED PAYMENT METHOD
    // =========================================

    const selectedMethod =
        localStorage.getItem("selectedPaymentMethod") ||
        "QR Payment";


    // Show selected payment method

    if (selectedMethodText) {

        selectedMethodText.textContent =
            selectedMethod;

    }


    // =========================================
    // VIEW RECEIPT
    // =========================================

    if (viewReceipt) {

        viewReceipt.addEventListener("click", function () {

            // Button loading state

            viewReceipt.disabled = true;

            viewReceipt.innerHTML =
                "Opening Receipt... <span>→</span>";


            // Get registration data

            const registrationData = JSON.parse(
                localStorage.getItem("registrationData")
            ) || {};


            // =========================================
            // CREATE RECEIPT DATA
            // =========================================

            const receiptData = {

                // STUDENT DETAILS

                fullname:
                    registrationData.fullname || "-",

                email:
                    registrationData.email || "-",

                college:
                    registrationData.college || "-",

                department:
                    registrationData.department || "-",

                year:
                    registrationData.year || "-",


                // EVENT DETAILS

                event:
                    registrationData.event ||
                    "Tech Spark 2027",


                // PAYMENT DETAILS

                paymentMethod:
                    selectedMethod,

                amount:
                    1000,

                paymentDate:
                    new Date().toLocaleString("en-IN"),

                transactionId:
                    "TXN" + Date.now()

            };


            // =========================================
            // SAVE RECEIPT DATA
            // =========================================

            localStorage.setItem(
                "receiptData",
                JSON.stringify(receiptData)
            );


            // =========================================
            // OPEN RECEIPT PAGE
            // =========================================

            setTimeout(function () {

                window.location.href =
                    "receipt.html";

            }, 700);

        });

    }

});