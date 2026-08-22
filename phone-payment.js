document.addEventListener("DOMContentLoaded", function () {

    const API_URL =
        "https://college-event-manager-pro.onrender.com";

    const params =
        new URLSearchParams(window.location.search);

    const paymentSessionId =
        params.get("session");


    const phoneEvent =
        document.getElementById("phoneEvent");

    const phoneStudent =
        document.getElementById("phoneStudent");

    const paymentStatus =
        document.getElementById("paymentStatus");


    if (!paymentSessionId) {

        if (paymentStatus) {
            paymentStatus.textContent =
                "Invalid payment session.";
        }

        return;

    }


    function getPaymentStatus() {

        return fetch(
            API_URL +
            "/payment-status/" +
            encodeURIComponent(paymentSessionId)
        )
        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "Payment session not found"
                );
            }

            return response.json();

        });

    }


    function showPaymentDetails(data) {

        if (
            data.registrationData &&
            phoneStudent
        ) {

            phoneStudent.textContent =
                data.registrationData.fullname ||
                "Student";

        }


        if (
            data.registrationData &&
            phoneEvent
        ) {

            phoneEvent.textContent =
                data.registrationData.event ||
                "Tech Spark 2027";

        }

    }


    getPaymentStatus()

    .then(function (data) {

        showPaymentDetails(data);

        return fetch(
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
        );

    })

    .then(function (response) {

        if (!response.ok) {
            throw new Error(
                "Unable to start demo payment."
            );
        }

        return response.json();

    })

    .then(function () {

        if (paymentStatus) {

            paymentStatus.textContent =
                "QR verified. Processing secure payment...";

        }

    })

    .catch(function (error) {

        console.error(error);

        if (paymentStatus) {

            paymentStatus.textContent =
                "Unable to connect to payment server.";

        }

    });


    const statusInterval = setInterval(
        function () {

            getPaymentStatus()

            .then(function (data) {

                showPaymentDetails(data);


                if (data.status === "processing") {

                    if (paymentStatus) {

                        paymentStatus.textContent =
                            "Verifying payment...";

                    }

                }


                if (data.status === "paid") {

                    clearInterval(statusInterval);


                    if (paymentStatus) {

                        paymentStatus.textContent =
                            "Payment successful! Opening receipt...";

                    }


                    setTimeout(function () {

                        window.location.href =
                            "receipt.html?session=" +
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