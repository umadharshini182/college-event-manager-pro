document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // GET ELEMENTS
    // =========================================

    const selectedMethodText =
        document.getElementById("selectedMethodText");

    const confirmPayment =
        document.getElementById("confirmPayment");


    // =========================================
    // GET SELECTED PAYMENT METHOD
    // =========================================

    const selectedMethod =
        localStorage.getItem("selectedPaymentMethod");


    if (selectedMethod) {

        selectedMethodText.textContent =
            selectedMethod;

    } else {

        selectedMethodText.textContent =
            "UPI Payment";

    }


    // =========================================
    // CONFIRM PAYMENT
    // =========================================

    confirmPayment.addEventListener(
        "click",
        function () {

            // Disable button

            confirmPayment.disabled = true;

            confirmPayment.innerHTML =
                "Processing Payment...";


            // Get old registration data

            const registrationData = JSON.parse(
                localStorage.getItem("registrationData")
            ) || {};


            // =========================================
            // CREATE RECEIPT DATA
            // =========================================

            const receiptData = {

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

                event:
                    registrationData.event ||
                    "Tech Spark 2027",


                // PAYMENT DETAILS

                paymentMethod:
                    selectedMethod ||
                    "QR Payment",

                amount:
                    1000,

                paymentDate:
                    new Date().toLocaleString("en-IN"),

                transactionId:
                    "TXN" +
                    Date.now()

            };


            // =========================================
            // SAVE RECEIPT DATA
            // =========================================

            localStorage.setItem(
                "receiptData",
                JSON.stringify(receiptData)
            );


            // =========================================
            // GO TO RECEIPT
            // =========================================

            setTimeout(function () {

                window.location.href =
                    "receipt.html";

            }, 1800);

        }
    );

});