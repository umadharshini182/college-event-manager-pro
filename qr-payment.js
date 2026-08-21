document.addEventListener("DOMContentLoaded", function () {

    const API_URL =
        "http://localhost:5000";


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

    const scanStatusText =
        document.getElementById("scanStatusText");


    // =========================================
    // REGISTRATION DATA
    // =========================================

    const registrationData = JSON.parse(
        localStorage.getItem("registrationData")
    ) || {};


    qrStudentName.textContent =
        registrationData.fullname || "Student";

    qrEventName.textContent =
        registrationData.event || "Tech Spark 2027";

    qrCollegeName.textContent =
        registrationData.college || "College";


    // =========================================
    // CREATE SESSION ID
    // =========================================

    const paymentSessionId =
        "PAY-" + Date.now() + "-" +
        Math.floor(Math.random() * 10000);


    // =========================================
    // CREATE SESSION IN BACKEND
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
                    paymentSessionId

            })

        }
    )

    .then(function (response) {

        return response.json();

    })

    .then(function (data) {

        if (!data.success) {

            scanStatusText.textContent =
                "Unable to start payment session.";

            return;

        }


        // =====================================
        // CREATE QR URL
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
        // GENERATE QR
        // =====================================

        if (
            qrContainer &&
            typeof QRCode !== "undefined"
        ) {

            qrContainer.innerHTML = "";

            new QRCode(qrContainer, {

                text:
                    phonePaymentURL,

                width:
                    220,

                height:
                    220,

                correctLevel:
                    QRCode.CorrectLevel.H

            });

        }


        // Start checking payment status

        checkPaymentStatus();

    })

    .catch(function (error) {

        console.error(error);

        scanStatusText.textContent =
            "Payment server is unavailable.";

    });


    // =========================================
    // CHECK PAYMENT STATUS
    // =========================================

    function checkPaymentStatus() {

        setInterval(function () {

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

                if (data.status === "paid") {

                    scanStatusText.textContent =
                        "✓ Payment confirmed successfully!";


                    // Save payment details

                    const receiptData = {

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

                        event:
                            registrationData.event ||
                            "Tech Spark 2027",

                        paymentMethod:
                            "QR / UPI Demo",

                        amount:
                            1000,

                        paymentDate:
                            data.paymentDate ||
                            new Date().toLocaleString("en-IN"),

                        transactionId:
                            data.transactionId ||
                            "TXN" + Date.now()

                    };


                    localStorage.setItem(
                        "receiptData",
                        JSON.stringify(receiptData)
                    );


                    // Go to success page

                    setTimeout(function () {

                        window.location.href =
                            "payment-verification.html";

                    }, 1200);

                }

            })

            .catch(function (error) {

                console.error(error);

            });

        }, 2000);

    }


    // =========================================
    // SAME DEVICE DEMO PAYMENT
    // =========================================

    qrPayButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "phone-payment.html?session=" +
                encodeURIComponent(
                    paymentSessionId
                ) +
                "&sameDevice=true";

        }
    );

});