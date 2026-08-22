document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // BACKEND URL
    // =========================================

    const API_URL =
        "https://college-event-manager-pro.onrender.com";


    // =========================================
    // GET STUDENT DATA
    // Supports BOTH studentData and registrationData
    // =========================================

    let studentData = null;

    try {

        studentData =
            JSON.parse(
                localStorage.getItem("studentData")
            );

    } catch (error) {

        console.error(
            "Unable to read studentData:",
            error
        );

    }


    // Fallback for old registrationData storage

    if (!studentData) {

        try {

            studentData =
                JSON.parse(
                    localStorage.getItem(
                        "registrationData"
                    )
                );

        } catch (error) {

            console.error(
                "Unable to read registrationData:",
                error
            );

        }

    }


    // =========================================
    // IF NO DATA, SHOW ERROR
    // =========================================

    if (!studentData) {

        console.error(
            "No student registration data found."
        );

        const qrStatus =
            document.getElementById("qrStatus");

        if (qrStatus) {

            qrStatus.textContent =
                "Registration data not found. Please register again.";

        }

        return;

    }


    console.log(
        "PAYMENT DATA:",
        studentData
    );


    // =========================================
    // GET PAGE ELEMENTS
    // =========================================

    const qrCode =
        document.getElementById("qrCode");

    const qrStatus =
        document.getElementById("qrStatus");

    const paymentAmount =
        document.getElementById("paymentAmount");

    const amount =
        document.getElementById("amount");

    const eventName =
        document.getElementById("eventName");

    const studentName =
        document.getElementById("studentName");


    // =========================================
    // SHOW PAYMENT DETAILS
    // =========================================

    if (paymentAmount) {

        paymentAmount.textContent =
            "₹1,000";

    }


    if (amount) {

        amount.textContent =
            "₹1,000";

    }


    if (eventName) {

        eventName.textContent =
            studentData.event ||
            "Tech Spark 2027";

    }


    if (studentName) {

        studentName.textContent =
            studentData.fullname ||
            "Student";

    }


    // =========================================
    // CREATE PAYMENT SESSION
    // =========================================

    fetch(
        API_URL +
        "/create-payment-session",
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body: JSON.stringify({

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

                amount: 1000

            })

        }
    )

    .then(function (response) {

        if (!response.ok) {

            throw new Error(
                "Server error: " +
                response.status
            );

        }

        return response.json();

    })

    .then(function (data) {

        console.log(
            "PAYMENT SESSION:",
            data
        );


        // =========================================
        // CHECK SESSION ID
        // =========================================

        const sessionId =
            data.sessionId ||
            data.session ||
            data.paymentSessionId;


        if (!sessionId) {

            throw new Error(
                "Payment session ID not received."
            );

        }


        // =========================================
        // SAVE SESSION LOCALLY
        // =========================================

        localStorage.setItem(
            "paymentSessionId",
            sessionId
        );


        // =========================================
        // CREATE PHONE PAYMENT URL
        // =========================================

        const phonePaymentURL =
            API_URL +
            "/phone-payment.html?session=" +
            encodeURIComponent(
                sessionId
            );


        console.log(
            "PHONE PAYMENT URL:",
            phonePaymentURL
        );


        // =========================================
        // GENERATE QR CODE
        // =========================================

        if (qrCode) {

            qrCode.innerHTML = "";


            if (
                typeof QRCode !==
                "undefined"
            ) {

                new QRCode(
                    qrCode,
                    {

                        text:
                            phonePaymentURL,

                        width:
                            280,

                        height:
                            280,

                        correctLevel:
                            QRCode.CorrectLevel.H

                    }
                );

            } else {

                console.error(
                    "QRCode library not loaded."
                );

                if (qrStatus) {

                    qrStatus.textContent =
                        "Unable to generate QR code.";

                }

            }

        }


        // =========================================
        // UPDATE STATUS
        // =========================================

        if (qrStatus) {

            qrStatus.textContent =
                "Scan the QR code to continue payment.";

        }


        // =========================================
        // CHECK PAYMENT STATUS
        // =========================================

        const paymentInterval =
            setInterval(
                function () {

                    fetch(
                        API_URL +
                        "/payment-status/" +
                        encodeURIComponent(
                            sessionId
                        )
                    )

                    .then(function (
                        response
                    ) {

                        if (
                            !response.ok
                        ) {

                            throw new Error(
                                "Unable to check payment status."
                            );

                        }

                        return response.json();

                    })

                    .then(function (
                        paymentData
                    ) {

                        console.log(
                            "PAYMENT STATUS:",
                            paymentData
                        );


                        // ---------------------------------
                        // QR SCANNED
                        // ---------------------------------

                        if (
                            paymentData.status ===
                            "processing"
                        ) {

                            if (qrStatus) {

                                qrStatus.textContent =
                                    "QR scanned. Processing payment...";

                            }

                        }


                        // ---------------------------------
                        // PAYMENT SUCCESS
                        // ---------------------------------

                        if (
                            paymentData.status ===
                            "paid"
                        ) {

                            clearInterval(
                                paymentInterval
                            );


                            if (qrStatus) {

                                qrStatus.textContent =
                                    "✓ Payment successful! Opening receipt...";

                            }


                            // Save complete receipt data

                            localStorage.setItem(
                                "receiptData",
                                JSON.stringify(
                                    paymentData
                                )
                            );


                            // Redirect desktop to receipt

                            setTimeout(
                                function () {

                                    window.location.href =
                                        "receipt.html?session=" +
                                        encodeURIComponent(
                                            sessionId
                                        );

                                },
                                1200
                            );

                        }

                    })

                    .catch(function (
                        error
                    ) {

                        console.error(
                            "STATUS ERROR:",
                            error
                        );

                    });

                },

                1000
            );

    })

    .catch(function (error) {

        console.error(
            "PAYMENT ERROR:",
            error
        );


        if (qrStatus) {

            qrStatus.textContent =
                "Unable to start payment: " +
                error.message;

        }

    });

});