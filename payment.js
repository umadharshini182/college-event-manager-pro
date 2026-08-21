document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // GET ELEMENTS
    // =========================================

    const paymentOptions = document.querySelectorAll(".payment-option");
    const selectedMethod = document.getElementById("selectedMethod");
    const selectedStatus = document.getElementById("selectedStatus");
    const payButton = document.getElementById("payButton");
    const showQR = document.getElementById("showQR");
    const qrModal = document.getElementById("qrModal");
    const closeQR = document.getElementById("closeQR");
    const paidButton = document.getElementById("paidButton");
    const processingModal = document.getElementById("processingModal");
    const qrContainer = document.getElementById("paymentQRCode");
    const paymentEvent = document.getElementById("paymentEvent");

    let selectedPaymentMethod = "";

    // =========================================
    // GET REGISTRATION DATA
    // =========================================

    const registrationData = JSON.parse(
        localStorage.getItem("registrationData")
    ) || {};

    if (registrationData.event && paymentEvent) {
        paymentEvent.textContent = registrationData.event;
    }

    // =========================================
    // SELECT PAYMENT METHOD
    // =========================================

    paymentOptions.forEach(function (option) {

        option.addEventListener("click", function () {

            paymentOptions.forEach(function (item) {
                item.classList.remove("selected");
            });

            option.classList.add("selected");

            selectedPaymentMethod = option.dataset.method;

            selectedMethod.textContent = selectedPaymentMethod;

            selectedStatus.textContent = "Selected ✓";
            selectedStatus.classList.add("active");

            payButton.disabled = false;

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

        selectedMethod.textContent = selectedPaymentMethod;

        selectedStatus.textContent = "Selected ✓";
        selectedStatus.classList.add("active");

        payButton.disabled = false;

        localStorage.setItem(
            "selectedPaymentMethod",
            selectedPaymentMethod
        );

        qrModal.classList.add("show");

        // Clear QR box first
        qrContainer.innerHTML = "";

        // Create demo verification page URL
        const qrData =
            window.location.origin +
            "/payment-verification.html";

        // Generate QR
        if (typeof QRCode !== "undefined") {

            new QRCode(qrContainer, {
                text: qrData,
                width: 250,
                height: 250,
                colorDark: "#111827",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

        } else {

            qrContainer.innerHTML =
                "<p style='color:white;'>QR code failed to load.</p>";

        }

    });

    // =========================================
    // CLOSE QR MODAL
    // =========================================

    closeQR.addEventListener("click", function () {
        qrModal.classList.remove("show");
    });

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
    // QR PAYMENT COMPLETED
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

        steps.forEach(function (step) {

            step.classList.remove("active", "done");

            const check =
                step.querySelector(".step-check");

            check.textContent = "○";

        });

        setTimeout(function () {
            completeStep(steps[0]);
        }, 600);

        setTimeout(function () {
            completeStep(steps[1]);
        }, 1500);

        setTimeout(function () {
            completeStep(steps[2]);
        }, 2400);

        setTimeout(function () {

            completeStep(steps[3]);

            createReceiptData();

        }, 3300);

        setTimeout(function () {

            window.location.href = "receipt.html";

        }, 4400);

    }

    // =========================================
    // COMPLETE STEP
    // =========================================

    function completeStep(step) {

        if (!step) return;

        step.classList.add("active");

        setTimeout(function () {

            step.classList.remove("active");
            step.classList.add("done");

            const check =
                step.querySelector(".step-check");

            if (check) {
                check.textContent = "✓";
            }

        }, 350);

    }

    // =========================================
    // CREATE RECEIPT DATA
    // =========================================

    function createReceiptData() {

        const receiptData = {

            fullname: registrationData.fullname || "-",
            email: registrationData.email || "-",
            college: registrationData.college || "-",
            department: registrationData.department || "-",
            year: registrationData.year || "-",

            event:
                registrationData.event ||
                "Tech Spark 2027",

            paymentMethod:
                selectedPaymentMethod ||
                "UPI Payment",

            amount: 1000,

            paymentDate:
                new Date().toLocaleString("en-IN"),

            transactionId:
                "TXN" + Date.now()

        };

        localStorage.setItem(
            "receiptData",
            JSON.stringify(receiptData)
        );

    }

});