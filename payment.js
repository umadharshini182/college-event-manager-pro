// ==========================================
// COLLEGE EVENT MANAGER
// PROFESSIONAL PAYMENT FLOW
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // GET REGISTRATION DATA
    // ==========================================

    let student = null;

    const savedData =
        localStorage.getItem("studentData");

    if (savedData) {

        try {
            student = JSON.parse(savedData);

        } catch (error) {

            console.error(
                "Unable to read student data:",
                error
            );

        }

    }


    // Fallback for older registration data

    if (!student) {

        student = {

            fullname:
                localStorage.getItem("fullname") || "",

            email:
                localStorage.getItem("email") || "",

            college:
                localStorage.getItem("college") || "",

            department:
                localStorage.getItem("department") || "",

            year:
                localStorage.getItem("year") || "",

            event:
                localStorage.getItem("event") || ""

        };

    }


    // ==========================================
    // ELEMENTS
    // ==========================================

    const studentName =
        document.getElementById("studentName");

    const studentEmail =
        document.getElementById("studentEmail");

    const collegeName =
        document.getElementById("collegeName");

    const departmentName =
        document.getElementById("departmentName");

    const studentYear =
        document.getElementById("studentYear");

    const eventName =
        document.getElementById("eventName");


    // ==========================================
    // DISPLAY REGISTRATION DETAILS
    // ==========================================

    if (studentName) {

        studentName.textContent =
            student.fullname || "Student";

    }


    if (studentEmail) {

        studentEmail.textContent =
            student.email || "Not available";

    }


    if (collegeName) {

        collegeName.textContent =
            student.college || "Not available";

    }


    if (departmentName) {

        departmentName.textContent =
            student.department || "Not available";

    }


    if (studentYear) {

        studentYear.textContent =
            student.year || "Not available";

    }


    if (eventName) {

        eventName.textContent =
            student.event || "College Event";

    }


    // ==========================================
    // PAYMENT OPTIONS
    // ==========================================

    const paymentOptions =
        document.querySelectorAll(
            ".payment-option, .bank-option"
        );

    const selectedMethod =
        document.getElementById(
            "selectedMethod"
        );

    const continueButton =
        document.getElementById(
            "continuePayment"
        );


    let selectedPaymentMethod = "";


    // ==========================================
    // SELECT PAYMENT METHOD
    // ==========================================

    paymentOptions.forEach(function (option) {

        option.addEventListener(
            "click",
            function () {

                // Remove old selection

                paymentOptions.forEach(
                    function (item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                // Select clicked option

                this.classList.add(
                    "selected"
                );


                // Store method

                selectedPaymentMethod =
                    this.dataset.method;


                // Display selected method

                if (selectedMethod) {

                    selectedMethod.textContent =
                        selectedPaymentMethod;

                }


                // Enable continue button

                if (continueButton) {

                    continueButton.disabled =
                        false;

                }

            }
        );

    });


    // ==========================================
    // QR BUTTON
    // ==========================================

    const scanQrButton =
        document.getElementById(
            "scanQrButton"
        );


    if (scanQrButton) {

        scanQrButton.addEventListener(
            "click",
            function () {

                /*
                 * QR is intentionally a separate page.
                 * Registration details are already stored
                 * in localStorage.
                 */

                window.location.href =
                    "qr-payment.html";

            }
        );

    }


    // ==========================================
    // CONTINUE PAYMENT
    // ==========================================

    if (continueButton) {

        continueButton.addEventListener(
            "click",
            function () {

                if (!selectedPaymentMethod) {

                    return;

                }


                startPaymentProcess(
                    selectedPaymentMethod
                );

            }
        );

    }


    // ==========================================
    // PAYMENT PROCESSING ELEMENTS
    // ==========================================

    const processingOverlay =
        document.getElementById(
            "paymentProcessing"
        );

    const processingTitle =
        document.getElementById(
            "processingTitle"
        );

    const processingMessage =
        document.getElementById(
            "processingMessage"
        );

    const processingProgressBar =
        document.getElementById(
            "processingProgressBar"
        );

    const processingStep =
        document.getElementById(
            "processingStep"
        );


    // ==========================================
    // SUCCESS ELEMENTS
    // ==========================================

    const paymentSuccess =
        document.getElementById(
            "paymentSuccess"
        );

    const successMethod =
        document.getElementById(
            "successMethod"
        );

    const successEvent =
        document.getElementById(
            "successEvent"
        );

    const viewReceiptButton =
        document.getElementById(
            "viewReceiptButton"
        );


    // ==========================================
    // START PAYMENT PROCESS
    // ==========================================

    function startPaymentProcess(method) {

        // Save selected method

        student.paymentMethod =
            method;


        // Save current registration

        localStorage.setItem(
            "studentData",
            JSON.stringify(student)
        );


        // Open processing screen

        if (processingOverlay) {

            processingOverlay.classList.add(
                "active"
            );

        }


        // Prevent page scrolling

        document.body.style.overflow =
            "hidden";


        // --------------------------------------
        // STAGE 1
        // --------------------------------------

        updateProcessing(

            "Processing Payment",

            "Connecting securely to the payment service...",

            25,

            "Step 1 of 3"

        );


        setTimeout(
            function () {

                // --------------------------------
                // STAGE 2
                // --------------------------------

                updateProcessing(

                    "Verifying Payment",

                    "Confirming your payment details...",

                    60,

                    "Step 2 of 3"

                );

            },

            1800
        );


        setTimeout(
            function () {

                // --------------------------------
                // STAGE 3
                // --------------------------------

                updateProcessing(

                    "Finalizing Transaction",

                    "Please wait while we complete your registration...",

                    88,

                    "Step 3 of 3"

                );

            },

            3600
        );


        setTimeout(
            function () {

                completePayment(
                    method
                );

            },

            5200
        );

    }


    // ==========================================
    // UPDATE PROCESSING SCREEN
    // ==========================================

    function updateProcessing(
        title,
        message,
        progress,
        step
    ) {

        if (processingTitle) {

            processingTitle.textContent =
                title;

        }


        if (processingMessage) {

            processingMessage.textContent =
                message;

        }


        if (processingProgressBar) {

            processingProgressBar.style.width =
                progress + "%";

        }


        if (processingStep) {

            processingStep.textContent =
                step;

        }

    }


    // ==========================================
    // PAYMENT COMPLETE
    // ==========================================

    function completePayment(method) {

        // Finish progress

        updateProcessing(

            "Transaction Successful",

            "Your registration payment has been confirmed.",

            100,

            "Completed"

        );


        // Wait briefly before showing success

        setTimeout(
            function () {

                if (processingOverlay) {

                    processingOverlay.classList.remove(
                        "active"
                    );

                }


                showSuccessScreen(
                    method
                );

            },

            900
        );

    }


    // ==========================================
    // SUCCESS SCREEN
    // ==========================================

    function showSuccessScreen(method) {

        // Save payment status

        student.paymentStatus =
            "Successful";

        student.paymentAmount =
            1000;

        student.paymentMethod =
            method;

        student.paymentDate =
            new Date().toLocaleString();


        // Save updated data

        localStorage.setItem(
            "studentData",
            JSON.stringify(student)
        );


        // Also save a separate receipt object

        const receiptData = {

            fullname:
                student.fullname || "Student",

            email:
                student.email || "",

            college:
                student.college || "",

            department:
                student.department || "",

            year:
                student.year || "",

            event:
                student.event || "College Event",

            amount:
                1000,

            paymentMethod:
                method,

            paymentStatus:
                "Successful",

            paymentDate:
                new Date().toLocaleString(),

            transactionId:
                generateTransactionId()

        };


        localStorage.setItem(
            "paymentReceipt",
            JSON.stringify(receiptData)
        );


        // Display success information

        if (successMethod) {

            successMethod.textContent =
                method;

        }


        if (successEvent) {

            successEvent.textContent =
                student.event ||
                "College Event";

        }


        // Show success screen

        if (paymentSuccess) {

            paymentSuccess.classList.add(
                "active"
            );

        }

    }


    // ==========================================
    // TRANSACTION ID
    // ==========================================

    function generateTransactionId() {

        const randomPart =
            Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase();


        return (
            "CEM" +
            Date.now().toString().slice(-8) +
            randomPart
        );

    }


    // ==========================================
    // VIEW RECEIPT
    // ==========================================

    if (viewReceiptButton) {

        viewReceiptButton.addEventListener(
            "click",
            function () {

                /*
                 * Payment is complete.
                 * Open the existing receipt page.
                 */

                document.body.style.overflow =
                    "";

                window.location.href =
                    "receipt.html";

            }
        );

    }


});