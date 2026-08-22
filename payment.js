document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // BACKEND URL
    // =========================================

    const API_URL =
        "https://college-event-manager-pro.onrender.com";


    // =========================================
    // GET STUDENT DATA
    // =========================================

    let studentData = null;

    try {

        studentData =
            JSON.parse(
                localStorage.getItem("studentData")
            );

    } catch (error) {

        console.error(error);

    }


    // Fallback: create student data from
    // individual localStorage values

    if (!studentData) {

        studentData = {

            fullname:
                localStorage.getItem("fullname"),

            email:
                localStorage.getItem("email"),

            college:
                localStorage.getItem("college"),

            department:
                localStorage.getItem("department"),

            year:
                localStorage.getItem("year"),

            event:
                localStorage.getItem("event")

        };

    }


    // =========================================
    // PAGE ELEMENTS
    // =========================================

    const paymentEvent =
        document.getElementById("paymentEvent");

    const continuePayment =
        document.getElementById("continuePayment");

    const qrModal =
        document.getElementById("qrModal");

    const closeQR =
        document.getElementById("closeQR");

    const paymentQRCode =
        document.getElementById("paymentQRCode");

    const paymentStatus =
        document.getElementById("paymentStatus");

    const paymentMethods =
        document.querySelectorAll(
            ".payment-method"
        );


    // =========================================
    // SHOW EVENT NAME
    // =========================================

    if (paymentEvent) {

        paymentEvent.textContent =
            studentData.event ||
            "Tech Spark 2027";

    }


    // =========================================
    // SELECT PAYMENT METHOD
    // =========================================

    let selectedMethod =
        "Google Pay";


    paymentMethods.forEach(
        function (method) {

            method.addEventListener(
                "click",
                function () {

                    paymentMethods.forEach(
                        function (item) {

                            item.classList.remove(
                                "selected"
                            );

                        }
                    );


                    this.classList.add(
                        "selected"
                    );


                    selectedMethod =
                        this.dataset.method;


                    console.log(
                        "SELECTED PAYMENT METHOD:",
                        selectedMethod
                    );

                }
            );

        }
    );


    // =========================================
    // CLOSE QR MODAL
    // =========================================

    if (closeQR) {

        closeQR.addEventListener(
            "click",
            function () {

                qrModal.style.display =
                    "none";

            }
        );

    }


    // =========================================
    // CONTINUE PAYMENT
    // =========================================

    if (continuePayment) {

        continuePayment.addEventListener(
            "click",
            function () {

                // Check student data

                if (
                    !studentData.fullname ||
                    !studentData.email
                ) {

                    alert(
                        "Registration data not found. Please register again."
                    );

                    return;

                }


                // Show QR modal

                if (qrModal) {

                    qrModal.style.display =
                        "flex";

                }


                if (paymentStatus) {

                    paymentStatus.textContent =
                        "Creating secure payment...";

                }


                // Create payment session

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

                            amount: 1000,

                            paymentMethod:
                                selectedMethod

                        })

                    }
                )

                .then(function (response) {

                    if (!response.ok) {

                        throw new Error(
                            "Unable to create payment session."
                        );

                    }

                    return response.json();

                })

                .then(function (data) {

                    console.log(
                        "PAYMENT SESSION:",
                        data
                    );


                    const sessionId =
                        data.sessionId ||
                        data.session ||
                        data.paymentSessionId;


                    if (!sessionId) {

                        throw new Error(
                            "Payment session ID not received."
                        );

                    }


                    localStorage.setItem(
                        "paymentSessionId",
                        sessionId
                    );


                    // Generate phone payment URL

                    const phonePaymentURL =
                        API_URL +
                        "/phone-payment.html?session=" +
                        encodeURIComponent(
                            sessionId
                        );


                    console.log(
                        "QR URL:",
                        phonePaymentURL
                    );


                    // Clear old QR

                    if (paymentQRCode) {

                        paymentQRCode.innerHTML =
                            "";


                        // Generate QR

                        if (
                            typeof QRCode !==
                            "undefined"
                        ) {

                            new QRCode(
                                paymentQRCode,
                                {

                                    text:
                                        phonePaymentURL,

                                    width:
                                        230,

                                    height:
                                        230,

                                    correctLevel:
                                        QRCode.CorrectLevel.H

                                }
                            );

                        }

                    }


                    if (paymentStatus) {

                        paymentStatus.textContent =
                            selectedMethod +
                            " selected. Scan the QR code.";

                    }


                    // Start checking payment

                    checkPaymentStatus(
                        sessionId
                    );

                })

                .catch(function (error) {

                    console.error(
                        "PAYMENT ERROR:",
                        error
                    );


                    if (paymentStatus) {

                        paymentStatus.textContent =
                            "Unable to start payment.";

                    }

                });

            }
        );

    }


    // =========================================
    // CHECK PAYMENT STATUS
    // =========================================

    function checkPaymentStatus(sessionId) {

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

                    .then(function (response) {

                        return response.json();

                    })

                    .then(function (data) {

                        console.log(
                            "PAYMENT STATUS:",
                            data
                        );


                        if (
                            data.status ===
                            "processing"
                        ) {

                            if (paymentStatus) {

                                paymentStatus.textContent =
                                    "Payment is being processed...";

                            }

                        }


                        if (
                            data.status ===
                            "paid"
                        ) {

                            clearInterval(
                                paymentInterval
                            );


                            if (paymentStatus) {

                                paymentStatus.textContent =
                                    "✓ Payment successful!";

                            }


                            localStorage.setItem(
                                "receiptData",
                                JSON.stringify(data)
                            );


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

                    .catch(function (error) {

                        console.error(
                            error
                        );

                    });

                },

                1000
            );

    }

});