document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // BACKEND URL
    // =========================================

    const API_URL =
        "https://college-event-manager-pro.onrender.com";


    // =========================================
    // GET SESSION ID FROM URL
    // =========================================

    const params =
        new URLSearchParams(
            window.location.search
        );

    const paymentSessionId =
        params.get("session");


    // =========================================
    // GET ELEMENTS
    // =========================================

    const selectedMethodText =
        document.getElementById(
            "selectedMethodText"
        );

    const viewReceipt =
        document.getElementById(
            "viewReceipt"
        );


    // =========================================
    // LOAD PAYMENT DETAILS FROM BACKEND
    // =========================================

    if (paymentSessionId) {

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

            if (data.status !== "paid") {

                console.log(
                    "Payment not completed yet."
                );

                return;

            }


            // Show payment method

            if (selectedMethodText) {

                selectedMethodText.textContent =
                    data.paymentMethod ||
                    "QR / UPI Demo";

            }

        })

        .catch(function (error) {

            console.error(
                "Unable to load payment:",
                error
            );

        });

    }


    // =========================================
    // VIEW RECEIPT
    // =========================================

    if (viewReceipt) {

        viewReceipt.addEventListener(
            "click",
            function () {

                viewReceipt.disabled = true;

                viewReceipt.innerHTML =
                    "Opening Receipt... <span>→</span>";


                // IMPORTANT:
                // Send the same payment session
                // to the receipt page.

                setTimeout(function () {

                    if (paymentSessionId) {

                        window.location.href =
                            "receipt.html?session=" +
                            encodeURIComponent(
                                paymentSessionId
                            );

                    } else {

                        // Old fallback flow

                        window.location.href =
                            "receipt.html";

                    }

                }, 700);

            }
        );

    }

});