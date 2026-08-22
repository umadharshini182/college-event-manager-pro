// ==========================================
// PAYMENT.JS
// COLLEGE EVENT MANAGER
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("PAYMENT.JS IS RUNNING");

    // ==========================================
    // GET REGISTRATION DATA
    // ==========================================

    let studentData = null;

    try {

        const savedStudentData =
            localStorage.getItem("studentData");

        const savedRegistrationData =
            localStorage.getItem("registrationData");


        if (savedStudentData) {

            studentData = JSON.parse(savedStudentData);

        } else if (savedRegistrationData) {

            studentData = JSON.parse(savedRegistrationData);

        }

    } catch (error) {

        console.error(
            "Error reading registration data:",
            error
        );

    }


    // ==========================================
    // FALLBACK DATA FROM INDIVIDUAL STORAGE
    // ==========================================

    if (!studentData) {

        const studentName =
            localStorage.getItem("studentName");

        const studentEmail =
            localStorage.getItem("studentEmail");

        const college =
            localStorage.getItem("college");

        const department =
            localStorage.getItem("department");

        const year =
            localStorage.getItem("year");

        const eventName =
            localStorage.getItem("eventName");


        if (
            studentName ||
            studentEmail ||
            college ||
            department ||
            year ||
            eventName
        ) {

            studentData = {

                fullname:
                    studentName || "",

                email:
                    studentEmail || "",

                college:
                    college || "",

                department:
                    department || "",

                year:
                    year || "",

                event:
                    eventName ||
                    "Tech Spark 2027"

            };

        }

    }


    console.log(
        "LOADED STUDENT DATA:",
        studentData
    );


    // ==========================================
    // UPDATE EVENT NAME
    // ==========================================

    const paymentEvent =
        document.getElementById("paymentEvent");


    if (paymentEvent && studentData) {

        paymentEvent.textContent =
            studentData.event ||
            "Tech Spark 2027";

    }


    // ==========================================
    // PAYMENT METHOD SELECTION
    // ==========================================
    const paymentMethods =
    document.querySelectorAll(
        ".payment-method, .payment-option, .bank-option"
    );

const selectedMethodDisplay =
    document.getElementById("selectedMethod");


    let selectedMethod =
        "Google Pay";


    // Remove old selection first
    paymentMethods.forEach(function (method) {

        method.classList.remove("selected");

    });

   // =========================================
// SELECT PAYMENT METHOD
// =========================================

paymentMethods.forEach(function (method) {

    method.style.cursor = "pointer";

    method.addEventListener("click", function (event) {

        event.preventDefault();

        paymentMethods.forEach(function (item) {

            item.classList.remove("selected");

        });


        this.classList.add("selected");


        selectedMethod =
            this.dataset.method ||
            this.textContent.trim();


        // Update "Selected method" text

        if (selectedMethodDisplay) {

            selectedMethodDisplay.textContent =
                selectedMethod;

        }


        // Save selected method

        localStorage.setItem(
            "selectedPaymentMethod",
            selectedMethod
        );


        console.log(
            "SELECTED PAYMENT METHOD:",
            selectedMethod
        );

    });

});


    // IMPORTANT:
    // Event delegation makes ALL payment
    // methods selectable

    document.addEventListener(
        "click",
        function (event) {

            const clickedMethod =
                event.target.closest(
                    ".payment-method"
                );


            if (!clickedMethod) {

                return;

            }


            console.log(
                "CLICKED:",
                clickedMethod.dataset.method
            );


            // Remove selection from all methods

            paymentMethods.forEach(
                function (method) {

                    method.classList.remove(
                        "selected"
                    );

                }
            );


            // Add selection to clicked method

            clickedMethod.classList.add(
                "selected"
            );


            // Save selected method

            selectedMethod =
                clickedMethod.dataset.method;


            console.log(
                "SELECTED PAYMENT METHOD:",
                selectedMethod
            );


            // Store selected payment method

            localStorage.setItem(
                "selectedPaymentMethod",
                selectedMethod
            );

        },
        true
    );


    // ==========================================
    // QR MODAL ELEMENTS
    // ==========================================

    const continuePayment =
        document.getElementById(
            "continuePayment"
        );


    const qrModal =
        document.getElementById(
            "qrModal"
        );


    const closeQR =
        document.getElementById(
            "closeQR"
        );


    const paymentQRCode =
        document.getElementById(
            "paymentQRCode"
        );


    const paymentStatus =
        document.getElementById(
            "paymentStatus"
        );


    // ==========================================
    // CONTINUE PAYMENT
    // ==========================================

    if (continuePayment) {

        continuePayment.addEventListener(
            "click",
            function () {

                console.log(
                    "CONTINUE PAYMENT CLICKED"
                );


                console.log(
                    "SELECTED METHOD:",
                    selectedMethod
                );


                // Check registration data

                if (!studentData) {

                    alert(
                        "Registration data not found. Please register again."
                    );

                    return;

                }


                // Show modal

                if (qrModal) {

                    qrModal.classList.add(
                        "show"
                    );

                }


                // Clear old QR

                if (paymentQRCode) {

                    paymentQRCode.innerHTML = "";

                }


                // QR payment data

                const paymentId =
                    "PAY-" +
                    Date.now();


                const qrData =
                    "upi://pay?pa=collegeeventmanager@upi" +
                    "&pn=College Event Manager" +
                    "&am=1000" +
                    "&cu=INR" +
                    "&tn=" +
                    encodeURIComponent(
                        studentData.event
                    );


                console.log(
                    "GENERATING QR:",
                    qrData
                );


                // Generate QR

                if (
                    typeof QRCode !==
                    "undefined"
                ) {

                    new QRCode(
                        paymentQRCode,
                        {

                            text: qrData,

                            width: 220,

                            height: 220,

                            correctLevel:
                                QRCode.CorrectLevel.H

                        }
                    );

                } else {

                    paymentQRCode.innerHTML =
                        "<p>QR code could not be loaded.</p>";

                }


                // Update status

                if (paymentStatus) {

                    paymentStatus.textContent =
                        "Waiting for payment confirmation...";

                }


                // ==================================
                // DEMO PAYMENT CONFIRMATION
                // ==================================

                setTimeout(
                    function () {

                        if (paymentStatus) {

                            paymentStatus.textContent =
                                "Payment successful! Redirecting...";

                        }


                        // Create receipt data

                        const receiptData = {

                            paymentId:
                                paymentId,

                            fullname:
                                studentData.fullname,

                            email:
                                studentData.email,

                            college:
                                studentData.college,

                            department:
                                studentData.department,

                            year:
                                studentData.year,

                            event:
                                studentData.event,

                            paymentMethod:
                                selectedMethod,

                            amount:
                                1000,

                            paymentStatus:
                                "Paid",

                            paymentDate:
                                new Date()
                                .toLocaleString()

                        };


                        console.log(
                            "RECEIPT DATA:",
                            receiptData
                        );


                        // Save receipt data

                        localStorage.setItem(
                            "receiptData",
                            JSON.stringify(
                                receiptData
                            )
                        );


                        // Save payment method

                        localStorage.setItem(
                            "selectedPaymentMethod",
                            selectedMethod
                        );


                        // Refresh dashboard

                        localStorage.setItem(
                            "dashboardRefresh",
                            Date.now().toString()
                        );


                        // Go to receipt page

                        setTimeout(
                            function () {

                                window.location.href =
                                    "receipt.html";

                            },
                            1500
                        );

                    },
                    3000
                );

            }
        );

    }


    // ==========================================
    // CLOSE QR MODAL
    // ==========================================

    if (closeQR) {

        closeQR.addEventListener(
            "click",
            function () {

                if (qrModal) {

                    qrModal.classList.remove(
                        "show"
                    );

                }

            }
        );

    }


    // Close when clicking outside QR panel

    if (qrModal) {

        qrModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === qrModal
                ) {

                    qrModal.classList.remove(
                        "show"
                    );

                }

            }
        );

    }


    // ==========================================
    // ESCAPE KEY CLOSES MODAL
    // ==========================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                qrModal
            ) {

                qrModal.classList.remove(
                    "show"
                );

            }

        }
    );

});