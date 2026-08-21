document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // GET ELEMENTS
    // =========================================

    const paymentOptions =
        document.querySelectorAll(".payment-option");

    const selectedMethod =
        document.getElementById("selectedMethod");

    const selectedStatus =
        document.getElementById("selectedStatus");

    const payButton =
        document.getElementById("payButton");

    const showQR =
        document.getElementById("showQR");

    const qrModal =
        document.getElementById("qrModal");

    const closeQR =
        document.getElementById("closeQR");

    const paidButton =
        document.getElementById("paidButton");

    const processingModal =
        document.getElementById("processingModal");

    const qrContainer =
        document.getElementById("paymentQRCode");

    const paymentEvent =
        document.getElementById("paymentEvent");


    // =========================================
    // VARIABLES
    // =========================================

    let selectedPaymentMethod = "";


    // =========================================
    // GET REGISTRATION DATA
    // =========================================

    const registrationData = JSON.parse(
        localStorage.getItem("registrationData")
    ) || {};


    if (registrationData.event) {

        paymentEvent.textContent =
            registrationData.event;

    }


    // =========================================
    // SELECT PAYMENT METHOD
    // =========================================

    paymentOptions.forEach(function (option) {

        option.addEventListener("click", function () {

            // Remove selection from all options

            paymentOptions.forEach(function (item) {

                item.classList.remove("selected");

            });


            // Select clicked option

            option.classList.add("selected");


            // Get payment method

            selectedPaymentMethod =
                option.dataset.method;


            // Show selected method

            selectedMethod.textContent =
                selectedPaymentMethod;


            // Update status

            selectedStatus.textContent =
                "Selected ✓";

            selectedStatus.classList.add("active");


            // Enable button

            payButton.disabled = false;


            // Save selected method

            localStorage.setItem(
                "selectedPaymentMethod",
                selectedPaymentMethod
            );

        });

    });


    // =========================================
    // SHOW QR MODAL
    // =========================================

    showQR.addEventListener("click", function () {

        selectedPaymentMethod = "QR Payment";


        selectedMethod.textContent =
            selectedPaymentMethod;


        selectedStatus.textContent =
            "Selected ✓";

        selectedStatus.classList.add("active");


        payButton.disabled = false;


        localStorage.setItem(
            "selectedPaymentMethod",
            selectedPaymentMethod
        );


        qrModal.classList.add("show");


        // Generate QR only once

        if (
            qrContainer &&
            qrContainer.innerHTML === "" &&
            typeof QRCode !== "undefined"
        ) {

            // Demo QR data
            // After scanning, it opens your website home page
         const qrData =
    window.location.origin +
    window.location.pathname.replace(
        "payment.html",
        "payment-verification.html"
    );

            new QRCode(qrContainer, {

                text: qrData,

                width: 220,

                height: 220,

                correctLevel:
                    QRCode.CorrectLevel.H

            });

        }

    });


    // =========================================
    // CLOSE QR MODAL
    // =========================================

    closeQR.addEventListener("click", function () {

        qrModal.classList.remove("show");

    });


    // Close when clicking outside card

    qrModal.addEventListener("click", function (event) {

        if (event.target === qrModal) {

            qrModal.classList.remove("show");

        }

    });


    // =========================================
    // NORMAL PAYMENT BUTTON
    // =========================================

    payButton.addEventListener("click", function () {

        if (!selectedPaymentMethod) {

            return;

        }


        qrModal.classList.remove("show");

        startProcessing();

    });


    // =========================================
    // QR PAYMENT COMPLETED BUTTON
    // =========================================

    paidButton.addEventListener("click", function () {

        qrModal.classList.remove("show");

        startProcessing();

    });


    // =========================================
    // PROCESS PAYMENT
    // =========================================

    function startProcessing() {

        processingModal.classList.add("show");


        const steps =
            document.querySelectorAll(".process-step");


        // Reset steps

        steps.forEach(function (step) {

            step.classList.remove(
                "active",
                "done"
            );

            const check =
                step.querySelector(".step-check");

            check.textContent = "○";

        });


        // Step 1

        setTimeout(function () {

            completeStep(steps[0]);

        }, 600);


        // Step 2

        setTimeout(function () {

            completeStep(steps[1]);

        }, 1500);


        // Step 3

        setTimeout(function () {

            completeStep(steps[2]);

        }, 2400);


        // Step 4 + receipt

        setTimeout(function () {

            completeStep(steps[3]);

            createReceiptData();

        }, 3300);


        // Go to receipt page

        setTimeout(function () {

            window.location.href =
                "receipt.html";

        }, 4400);

    }


    // =========================================
    // COMPLETE STEP
    // =========================================

    function completeStep(step) {

        step.classList.add("active");


        setTimeout(function () {

            step.classList.remove("active");

            step.classList.add("done");


            const check =
                step.querySelector(".step-check");

            check.textContent = "✓";

        }, 350);

    }


    // =========================================
    // CREATE RECEIPT DATA
    // =========================================

    function createReceiptData() {

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
                selectedPaymentMethod ||
                "UPI Payment",

            amount: 1000,

            paymentDate:
                new Date().toLocaleString("en-IN"),

            transactionId:
                "TXN" +
                Date.now()

        };


        // Save receipt

        localStorage.setItem(
            "receiptData",
            JSON.stringify(receiptData)
        );

    }

});