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


    console.log("PAYMENT SESSION ID:", paymentSessionId);


    if (!paymentSessionId) {

        console.error("NO SESSION ID FOUND IN URL");

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

            console.log(
                "Payment status response:",
                response.status
            );

            if (!response.ok) {

                throw new Error(
                    "Payment session not found"
                );

            }

            return response.json();

        });

    }


    function showPaymentDetails(data) {

        console.log(
            "PAYMENT STATUS DATA:",
            data
        );

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


    // FIRST CHECK SESSION
    getPaymentStatus()

        .then(function (data) {

            showPaymentDetails(data);

            if (paymentStatus) {

                paymentStatus.textContent =
                    "QR verified. Processing secure payment...";

            }

            // START PAYMENT PROCESS
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
                    "Unable to start payment"
                );

            }

            return response.json();

        })

        .then(function (data) {

            console.log(
                "PAYMENT SCANNED:",
                data
            );

            startStatusChecking();

        })

        .catch(function (error) {

            console.error(
                "PAYMENT ERROR:",
                error
            );

            if (paymentStatus) {

                paymentStatus.textContent =
                    "Payment session not found. Please start payment again.";

            }

        });


    function startStatusChecking() {

        const statusInterval = setInterval(
            function () {

                getPaymentStatus()

                    .then(function (data) {

                        showPaymentDetails(data);

                        console.log(
                            "CURRENT STATUS:",
                            data.status
                        );


                        if (
                            data.status === "waiting"
                        ) {

                            paymentStatus.textContent =
                                "Waiting for payment...";

                        }


                        else if (
                            data.status === "scanned"
                        ) {

                            paymentStatus.textContent =
                                "QR verified. Processing...";

                        }


                        else if (
                            data.status === "processing"
                        ) {

                            paymentStatus.textContent =
                                "Verifying payment...";

                        }


                        else if (
                            data.status === "paid"
                        ) {

                            clearInterval(
                                statusInterval
                            );

                            paymentStatus.textContent =
                                "Payment successful! Opening receipt...";


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

                        console.error(
                            "STATUS ERROR:",
                            error
                        );

                        clearInterval(
                            statusInterval
                        );

                    });

            },

            1000
        );

    }

});