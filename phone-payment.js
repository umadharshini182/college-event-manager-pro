document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // BACKEND URL
    // =========================================

    const API_URL =
        "https://college-event-manager-pro.onrender.com";


    // =========================================
    // GET SESSION ID FROM QR URL
    // =========================================

    const params =
        new URLSearchParams(
            window.location.search
        );

    const paymentSessionId =
        params.get("session");


    // =========================================
    // GET PAGE ELEMENTS
    // =========================================

    const phoneEvent =
        document.getElementById("phoneEvent");

    const phoneStudent =
        document.getElementById("phoneStudent");

    const paymentStatus =
        document.getElementById("paymentStatus");


    // =========================================
    // CHECK SESSION
    // =========================================

    if (!paymentSessionId) {

        document.body.innerHTML = `
            <div style="
                min-height:100vh;
                display:flex;
                align-items:center;
                justify-content:center;
                font-family:Arial;
                text-align:center;
                padding:20px;
            ">
                <div>
                    <h1>Invalid Payment Link</h1>
                    <p>
                        This QR payment session could not be found.
                    </p>
                </div>
            </div>
        `;

        return;

    }


    // =========================================
    // QR OPENED = SCANNED
    // =========================================

    fetch(
        API_URL + "/payment-scanned",
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

            throw new Error(
                data.message ||
                "Unable to start payment."
            );

        }


        // Show processing

        if (paymentStatus) {

            paymentStatus.textContent =
                "QR verified. Processing payment...";

        }


        // Get complete session details

        return fetch(
            API_URL +
            "/payment-status/" +
            encodeURIComponent(
                paymentSessionId
            )
        );

    })

    .then(function (response) {

        return response.json();

    })

    .then(function (data) {

        if (data.registrationData) {

            if (phoneStudent) {

                phoneStudent.textContent =
                    data.registrationData.fullname ||
                    "Student";

            }


            if (phoneEvent) {

                phoneEvent.textContent =
                    data.registrationData.event ||
                    "Tech Spark 2027";

            }

        }

    })

    .catch(function (error) {

        console.error(error);


        if (paymentStatus) {

            paymentStatus.textContent =
                "Unable to connect to payment server.";

        }

    });


    // =========================================
    // AUTOMATIC STATUS CHECK
    // =========================================

    const statusInterval = setInterval(
        function () {

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

                if (data.status === "processing") {

                    if (paymentStatus) {

                        paymentStatus.textContent =
                            "Verifying secure payment...";

                    }

                }


                if (data.status === "paid") {

                    clearInterval(
                        statusInterval
                    );


                    if (paymentStatus) {

                        paymentStatus.textContent =
                            "✓ Payment Successful!";

                    }


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

});