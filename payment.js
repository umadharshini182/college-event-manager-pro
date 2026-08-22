document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // BACKEND URL
    // =========================================

    const API_URL =
        "https://college-event-manager-pro.onrender.com";


    // =========================================
    // GET ELEMENTS
    // =========================================

    const paymentMethods =
        document.querySelectorAll(".payment-method");

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


    // =========================================
    // DEFAULT PAYMENT METHOD
    // =========================================

    let selectedMethod = "Google Pay";


    // =========================================
    // SELECT PAYMENT METHOD
    // =========================================

    paymentMethods.forEach(function (method) {

        method.addEventListener("click", function () {

            paymentMethods.forEach(function (item) {

                item.classList.remove("selected");

            });


            method.classList.add("selected");


            selectedMethod =
                method.dataset.method ||
                "Google Pay";

        });

    });


    // =========================================
    // CONTINUE PAYMENT
    // =========================================

    if (continuePayment) {

        continuePayment.addEventListener(
            "click",
            function () {


                // =================================
                // GET SAVED REGISTRATION DATA
                // =================================

                const savedRegistration =
                    JSON.parse(
                        localStorage.getItem(
                            "registrationData"
                        )
                    ) ||
                    JSON.parse(
                        localStorage.getItem(
                            "studentData"
                        )
                    ) ||
                    {};


                // =================================
                // CREATE CLEAN REGISTRATION DATA
                // =================================

                const registrationData = {

                    fullname:
                        savedRegistration.fullname ||
                        savedRegistration.name ||
                        "",

                    email:
                        savedRegistration.email ||
                        "",

                    college:
                        savedRegistration.college ||
                        "",

                    department:
                        savedRegistration.department ||
                        "",

                    year:
                        savedRegistration.year ||
                        "",

                    event:
                        savedRegistration.event ||
                        "Tech Spark 2027"

                };


                // =================================
                // CREATE UNIQUE SESSION ID
                // =================================

                const sessionId =
                    "PAY-" +
                    Date.now() +
                    "-" +
                    Math.random()
                        .toString(36)
                        .substring(2, 8)
                        .toUpperCase();


                console.log(
                    "PAYMENT DATA:",
                    registrationData
                );


                // =================================
                // BUTTON LOADING STATE
                // =================================

                const originalButtonText =
                    continuePayment.innerHTML;


                continuePayment.disabled = true;


                continuePayment.innerHTML =
                    "Preparing secure payment...";


                // =================================
                // CREATE PAYMENT SESSION
                // =================================

                fetch(
                    API_URL +
                    "/create-payment-session",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                sessionId:
                                    sessionId,

                                registrationData:
                                    registrationData,

                                paymentMethod:
                                    selectedMethod

                            })

                    }
                )

                .then(function (response) {

                    if (!response.ok) {

                        throw new Error(
                            "Server returned " +
                            response.status
                        );

                    }

                    return response.json();

                })

                .then(function (data) {

                    if (!data.success) {

                        throw new Error(
                            data.message ||
                            "Unable to create payment session."
                        );

                    }


                    // =============================
                    // OPEN QR MODAL
                    // =============================

                    if (qrModal) {

                        qrModal.classList.add(
                            "active"
                        );

                    }


                    // =============================
                    // CLEAR OLD QR
                    // =============================

                    if (paymentQRCode) {

                        paymentQRCode.innerHTML =
                            "";

                    }


                    // =============================
                    // CREATE PHONE PAYMENT URL
                    // =============================

                    const phonePaymentURL =
                        window.location.origin +
                        window.location.pathname.replace(
                            "payment.html",
                            "phone-payment.html"
                        ) +
                        "?session=" +
                        encodeURIComponent(
                            sessionId
                        );


                    console.log(
                        "PHONE PAYMENT URL:",
                        phonePaymentURL
                    );


                    // =============================
                    // GENERATE QR CODE
                    // =============================

                    if (
                        paymentQRCode &&
                        typeof QRCode !== "undefined"
                    ) {

                        new QRCode(
                            paymentQRCode,
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


                    // =============================
                    // PAYMENT STATUS
                    // =============================

                    if (paymentStatus) {

                        paymentStatus.textContent =
                            "Scan this QR code using another device.";

                    }


                    // =============================
                    // START STATUS CHECKING
                    // =============================

                    checkPaymentStatus(
                        sessionId
                    );

                })

                .catch(function (error) {

                    console.error(
                        "PAYMENT ERROR:",
                        error
                    );


                    alert(
                        "Unable to start payment: " +
                        error.message
                    );

                })

                .finally(function () {

                    continuePayment.disabled =
                        false;

                    continuePayment.innerHTML =
                        originalButtonText;

                });

            }
        );

    }


    // =========================================
    // CLOSE QR MODAL
    // =========================================

    if (closeQR) {

        closeQR.addEventListener(
            "click",
            function () {

                if (qrModal) {

                    qrModal.classList.remove(
                        "active"
                    );

                }

            }
        );

    }


    // =========================================
    // CHECK PAYMENT STATUS
    // =========================================

    function checkPaymentStatus(sessionId) {

        const statusInterval =
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

                        if (!response.ok) {

                            throw new Error(
                                "Unable to check payment."
                            );

                        }

                        return response.json();

                    })

                    .then(function (data) {

                        if (
                            data.status ===
                            "scanned"
                        ) {

                            if (paymentStatus) {

                                paymentStatus.textContent =
                                    "QR scanned. Waiting for payment...";

                            }

                        }


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
                                statusInterval
                            );


                            if (paymentStatus) {

                                paymentStatus.textContent =
                                    "✓ Payment successful! Opening receipt...";

                            }


                            localStorage.setItem(
                                "paymentSessionId",
                                sessionId
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
                            "STATUS ERROR:",
                            error
                        );

                    });

                },

                1000
            );

    }

});