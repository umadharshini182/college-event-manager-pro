// ==========================================
// QR PAYMENT FLOW
// COLLEGE EVENT MANAGER
// ==========================================

document.addEventListener("DOMContentLoaded", function () {


    // ======================================
    // READ QR DATA
    // ======================================

    const params =
        new URLSearchParams(
            window.location.search
        );


    const student = {

        fullname:
            params.get("name") || "Student",

        email:
            params.get("email") || "",

        college:
            params.get("college") || "",

        department:
            params.get("department") || "",

        year:
            params.get("year") || "",

        event:
            params.get("event") || "College Event"

    };


    // ======================================
    // DISPLAY STUDENT
    // ======================================

    setText(
        "studentName",
        student.fullname
    );

    setText(
        "eventName",
        student.event
    );

    setText(
        "confirmedStudent",
        student.fullname
    );

    setText(
        "confirmedEvent",
        student.event
    );

    setText(
        "successEvent",
        student.event
    );


    // ======================================
    // GET SCREENS
    // ======================================

    const paymentScreen =
        document.getElementById(
            "paymentScreen"
        );

    const processingScreen =
        document.getElementById(
            "processingScreen"
        );

    const confirmedScreen =
        document.getElementById(
            "confirmedScreen"
        );

    const successScreen =
        document.getElementById(
            "successScreen"
        );


    // ======================================
    // GET STEPS
    // ======================================

    const step1 =
        document.getElementById("step1");

    const step2 =
        document.getElementById("step2");

    const step3 =
        document.getElementById("step3");


    // ======================================
    // BUTTONS
    // ======================================

    const payNowButton =
        document.getElementById(
            "payNowButton"
        );

    const continueButton =
        document.getElementById(
            "continueButton"
        );

    const receiptButton =
        document.getElementById(
            "receiptButton"
        );


    // ======================================
    // CONFIRM & PAY
    // ======================================

    if (payNowButton) {

        payNowButton.addEventListener(
            "click",
            function () {

                startProcessing();

            }
        );

    }


    // ======================================
    // START PROCESSING
    // ======================================

    function startProcessing() {

        showScreen(
            paymentScreen,
            false
        );

        showScreen(
            processingScreen,
            true
        );

        setStep(
            step1,
            "completed"
        );

        setStep(
            step2,
            "active"
        );


        updateProcessing(
            "Processing Payment",
            "Connecting securely to the payment service...",
            25,
            "Step 1 of 3"
        );


        // STEP 2

        setTimeout(
            function () {

                updateProcessing(
                    "Verifying Payment",
                    "Confirming your payment details...",
                    60,
                    "Step 2 of 3"
                );

            },
            1800
        );


        // STEP 3

        setTimeout(
            function () {

                updateProcessing(
                    "Finalizing Transaction",
                    "Please wait while we complete your registration...",
                    88,
                    "Step 3 of 3"
                );

            },
            3600
        );


        // PAYMENT CONFIRMED

        setTimeout(
            function () {

                showPaymentConfirmed();

            },
            5200
        );

    }


    // ======================================
    // PAYMENT CONFIRMED
    // ======================================

    function showPaymentConfirmed() {

        showScreen(
            processingScreen,
            false
        );

        showScreen(
            confirmedScreen,
            true
        );


        setStep(
            step2,
            "completed"
        );

        setStep(
            step3,
            "active"
        );


        // Save payment data

        const transactionId =
            generateTransactionId();


        const paymentDate =
            new Date().toLocaleString();


        const receiptData = {

            fullname:
                student.fullname,

            email:
                student.email,

            college:
                student.college,

            department:
                student.department,

            year:
                student.year,

            event:
                student.event,

            amount:
                1000,

            paymentMethod:
                "QR Payment",

            paymentStatus:
                "Successful",

            paymentDate:
                paymentDate,

            transactionId:
                transactionId

        };


        localStorage.setItem(
            "paymentReceipt",
            JSON.stringify(
                receiptData
            )
        );


        localStorage.setItem(
            "studentData",
            JSON.stringify({
                ...student,

                paymentMethod:
                    "QR Payment",

                paymentStatus:
                    "Successful",

                paymentAmount:
                    1000,

                paymentDate:
                    paymentDate,

                transactionId:
                    transactionId
            })
        );


        setText(
            "transactionId",
            transactionId
        );

    }


    // ======================================
    // CONTINUE TO FINAL SUCCESS
    // ======================================

    if (continueButton) {

        continueButton.addEventListener(
            "click",
            function () {

                showScreen(
                    confirmedScreen,
                    false
                );

                showScreen(
                    successScreen,
                    true
                );


                setStep(
                    step3,
                    "completed"
                );

            }
        );

    }


    // ======================================
    // VIEW RECEIPT
    // ======================================

    if (receiptButton) {

        receiptButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "receipt.html";

            }
        );

    }


    // ======================================
    // PROCESSING UI
    // ======================================

    function updateProcessing(
        title,
        message,
        progress,
        step
    ) {

        const titleElement =
            document.getElementById(
                "processingTitle"
            );

        const messageElement =
            document.getElementById(
                "processingMessage"
            );

        const progressElement =
            document.getElementById(
                "progressBar"
            );

        const stepElement =
            document.getElementById(
                "processingStep"
            );


        if (titleElement) {

            titleElement.textContent =
                title;

        }


        if (messageElement) {

            messageElement.textContent =
                message;

        }


        if (progressElement) {

            progressElement.style.width =
                progress + "%";

        }


        if (stepElement) {

            stepElement.textContent =
                step;

        }

    }


    // ======================================
    // SHOW / HIDE SCREEN
    // ======================================

    function showScreen(
        screen,
        show
    ) {

        if (!screen) {
            return;
        }


        if (show) {

            screen.classList.add(
                "active"
            );

        } else {

            screen.classList.remove(
                "active"
            );

        }

    }


    // ======================================
    // STEP STATUS
    // ======================================

    function setStep(
        step,
        status
    ) {

        if (!step) {
            return;
        }


        step.classList.remove(
            "active",
            "completed"
        );


        step.classList.add(
            status
        );

    }


    // ======================================
    // SET TEXT
    // ======================================

    function setText(
        id,
        value
    ) {

        const element =
            document.getElementById(id);


        if (!element) {
            return;
        }


        element.textContent =
            value || "Not available";

    }


    // ======================================
    // TRANSACTION ID
    // ======================================

    function generateTransactionId() {

        const randomPart =
            Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase();


        return (
            "CEM" +
            Date.now()
                .toString()
                .slice(-8) +
            randomPart
        );

    }

});