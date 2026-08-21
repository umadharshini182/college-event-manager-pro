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

                // =====================================
                // GET REGISTRATION DATA
                // =====================================

                const registrationData =
                    JSON.parse(
                        localStorage.getItem(
                            "registrationData"
                        )
                    ) || {};


                // =====================================
                // CREATE UNIQUE SESSION ID
                // =====================================

                const sessionId =
                    "PAY-" +
                    Date.now() +
                    "-" +
                    Math.random()
                        .toString(36)
                        .substring(2, 8);


                // =====================================
                // BUTTON LOADING STATE
                // =====================================

                continuePayment.disabled = true;

                continuePayment.innerHTML =
                    "Preparing secure payment...";


                // =====================================
                // CREATE PAYMENT SESSION
                // =====================================

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

                    return response.json()
                        .then(function (data) {

                            if (!response.ok) {

                                throw new Error(
                                    data.message ||
                                    "Server error: " +
                                    response.status
                                );

                            }

                            return data;

                        });

                })

                .then(function (data) {

                    if (!data.success) {

                        throw new Error(
                            data.message ||
                            "Unable to create payment session."
                        );

                    }


                    // =================================
                    // OPEN QR MODAL
                    // =================================

                    if (qrModal) {

                        qrModal.classList.add(
                            "active"
                        );

                    }


                    // =================================
                    // CLEAR OLD QR
                    // =================================

                    if (paymentQRCode) {

                        paymentQRCode.innerHTML = "";

                    }


                    // =================================
                    // CREATE PHONE PAYMENT URL
                    // =================================

                    const phonePaymentURL =
                        window.location.origin +
                        window.location.pathname
                            .replace(
                                "payment.html",
                                "phone-payment.html"
                            ) +
                        "?session=" +
                        encodeURIComponent(
                            sessionId
                        );


                    // =================================
                    // GENERATE QR CODE
                    // =================================

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

                    } else {

                        throw new Error(
                            "QR Code library is not loaded."
                        );

                    }


                    // =================================
                    // SHOW PAYMENT STATUS
                    // =================================

                    if (paymentStatus) {

                        paymentStatus.textContent =
                            "Scan the QR code to continue payment.";

                    }


                    // =================================
                    // SAVE SESSION ID
                    // =================================

                    localStorage.setItem(
                        "paymentSessionId",
                        sessionId
                    );


                    localStorage.setItem(
                        "selectedPaymentMethod",
                        selectedMethod
                    );


                    // =================================
                    // START STATUS CHECK
                    // =================================

                    checkPaymentStatus(
                        sessionId
                    );

                })


                // =====================================
                // ERROR
                // =====================================

                .catch(function (error) {

                    console.error(
                        "PAYMENT ERROR:",
                        error
                    );

                    alert(
                        "Unable to start payment: " +
                        error.message
                    );

                    continuePayment.disabled = false;

                    continuePayment.innerHTML = `
                        <span>
                            Continue securely
                        </span>

                        <span class="button-arrow">
                            →
                        </span>
                    `;

                });

            }
        );

    }


    // =========================================
    // CLOSE QR MODAL
    // =========================================

    if (closeQR && qrModal) {

        closeQR.addEventListener(
            "click",
            function () {

                qrModal.classList.remove(
                    "active"
                );

            }
        );

    }


    // =========================================
    // AUTOMATIC PAYMENT STATUS CHECK
    // =========================================

    function checkPaymentStatus(
        sessionId
    ) {

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
                                "Unable to check payment status."
                            );

                        }

                        return response.json();

                    })

                    .then(function (data) {

                        // PROCESSING

                        if (
                            data.status ===
                            "processing"
                        ) {

                            if (paymentStatus) {

                                paymentStatus.textContent =
                                    "Payment is being processed...";

                            }

                        }


                        // PAID

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

                1500
            );

    }

});