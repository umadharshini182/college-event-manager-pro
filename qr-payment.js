document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // BACKEND URL
    // =========================================

    const API_URL =
        "https://college-event-manager-pro.onrender.com";


    // =========================================
    // GET ELEMENTS
    // =========================================

    const qrContainer =
        document.getElementById("paymentQRCode");

    const qrStudentName =
        document.getElementById("qrStudentName");

    const qrEventName =
        document.getElementById("qrEventName");

    const qrCollegeName =
        document.getElementById("qrCollegeName");

    const qrPayButton =
        document.getElementById("qrPayButton");

    const scanStatus =
        document.querySelector(".scan-status");


    // =========================================
    // GET REGISTRATION DATA
    // =========================================

    const registrationData = JSON.parse(
        localStorage.getItem("registrationData")
    ) || {};


    // =========================================
    // SHOW REGISTRATION DETAILS
    // =========================================

    if (qrStudentName) {

        qrStudentName.textContent =
            registrationData.fullname || "Student";

    }


    if (qrEventName) {

        qrEventName.textContent =
            registrationData.event ||
            "Tech Spark 2027";

    }


    if (qrCollegeName) {

        qrCollegeName.textContent =
            registrationData.college || "College";

    }


    // =========================================
    // CREATE UNIQUE SESSION ID
    // =========================================

    const paymentSessionId =
        "PAY-" +
        Date.now() +
        "-" +
        Math.floor(Math.random() * 100000);


    // =========================================
    // CREATE PAYMENT SESSION
    // =========================================

    fetch(
        API_URL + "/create-payment-session",
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body: JSON.stringify({

                sessionId:
                    paymentSessionId,

                registrationData:
                    registrationData,

                paymentMethod:
                    "QR / UPI Demo"

            })

        }
    )

    .then(function (response) {

        return response.json();

    })

    .then(function (data) {

        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to create payment session."
            );

        }


        // =====================================
        // CREATE PHONE PAYMENT URL
        // =====================================

        const phonePaymentURL =
            window.location.origin +
            window.location.pathname.replace(
                "qr-payment.html",
                "phone-payment.html"
            ) +
            "?session=" +
            encodeURIComponent(
                paymentSessionId
            );


        // =====================================
        // GENERATE QR CODE
        // =====================================

        if (
            qrContainer &&
            typeof QRCode !== "undefined"
        ) {

            qrContainer.innerHTML = "";


            new QRCode(
                qrContainer,
                {

                    text:
                        phonePaymentURL,

                    width:
                        220,

                    height:
                        220,

                    correctLevel:
                        QRCode.CorrectLevel.H

                }
            );

        }


        // Start automatic checking

        checkPaymentStatus();

    })

    .catch(function (error) {

        console.error(error);

        updateStatus(
            "⚠ Unable to connect to payment server."
        );

    });


    // =========================================
    // UPDATE STATUS TEXT
    // =========================================

    function updateStatus(text) {

        if (!scanStatus) {

            return;

        }


        const statusText =
            scanStatus.querySelector(
                "span:last-child"
            );


        if (statusText) {

            statusText.textContent =
                text;

        }

    }


    // =========================================
    // CHECK PAYMENT STATUS
    // =========================================

    let paymentCompleted = false;


    function checkPaymentStatus() {

        const statusInterval = setInterval(
            function () {

                if (paymentCompleted) {

                    clearInterval(
                        statusInterval
                    );

                    return;

                }


                fetch(
                    API_URL +
                    "/payment-status/" +
                    encodeURIComponent(
                        paymentSessionId
                    )
                )

                .then(function (response) {

                    return response.json();

                })

                .then(function (data) {

                    if (!data.success) {

                        return;

                    }


                    // =============================
                    // WAITING
                    // =============================

                    if (
                        data.status === "waiting"
                    ) {

                        updateStatus(
                            "Waiting for QR scan..."
                        );

                    }


                    // =============================
                    // QR SCANNED
                    // =============================

                    if (
                        data.status === "scanned"
                    ) {

                        updateStatus(
                            "📱 QR scanned on another device. Processing payment..."
                        );

                    }


                    // =============================
                    // PROCESSING
                    // =============================

                    if (
                        data.status === "processing"
                    ) {

                        updateStatus(
                            "⏳ Verifying payment securely..."
                        );

                    }


                    // =============================
                    // PAID
                    // =============================

                    if (
                        data.status === "paid"
                    ) {

                        paymentCompleted = true;

                        clearInterval(
                            statusInterval
                        );


                        updateStatus(
                            "✓ Payment successful! Redirecting..."
                        );


                        // =========================
                        // CREATE RECEIPT DATA
                        // =========================

                        const backendRegistrationData =
                            data.registrationData || {};


                        const receiptData = {

                            fullname:
                                backendRegistrationData.fullname ||
                                registrationData.fullname ||
                                "-",

                            email:
                                backendRegistrationData.email ||
                                registrationData.email ||
                                "-",

                            college:
                                backendRegistrationData.college ||
                                registrationData.college ||
                                "-",

                            department:
                                backendRegistrationData.department ||
                                registrationData.department ||
                                "-",

                            year:
                                backendRegistrationData.year ||
                                registrationData.year ||
                                "-",

                            event:
                                backendRegistrationData.event ||
                                registrationData.event ||
                                "Tech Spark 2027",

                            paymentMethod:
                                data.paymentMethod ||
                                "QR / UPI Demo",

                            amount:
                                data.amount || 1000,

                            paymentDate:
                                data.paymentDate ||
                                new Date().toLocaleString(
                                    "en-IN"
                                ),

                            transactionId:
                                data.transactionId ||
                                "TXN" + Date.now()

                        };


                        // Save receipt locally

                        localStorage.setItem(
                            "receiptData",
                            JSON.stringify(
                                receiptData
                            )
                        );


                        // Go to success page

                        setTimeout(function () {

                            window.location.href =
                                "payment-verification.html?session=" +
                                encodeURIComponent(
                                    paymentSessionId
                                );

                        }, 1200);

                    }

                })

                .catch(function (error) {

                    console.error(error);

                });

            },

            1000
        );

    }


    // =========================================
    // SAME DEVICE PAYMENT
    // =========================================

    if (qrPayButton) {

        qrPayButton.addEventListener(
            "click",
            function () {

                qrPayButton.disabled = true;

                qrPayButton.textContent =
                    "Processing Payment...";


                fetch(
                    API_URL +
                    "/start-auto-payment",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body: JSON.stringify({

                            sessionId:
                                paymentSessionId

                        })

                    }
                )

                .then(function (response) {

                    return response.json();

                })

                .then(function (data) {

                    if (!data.success) {

                        qrPayButton.disabled =
                            false;

                        qrPayButton.textContent =
                            "Try Again";

                        return;

                    }


                    updateStatus(
                        "⏳ Processing secure payment..."
                    );

                })

                .catch(function (error) {

                    console.error(error);

                    qrPayButton.disabled =
                        false;

                    qrPayButton.textContent =
                        "Try Again";

                });

            }
        );

    }

});