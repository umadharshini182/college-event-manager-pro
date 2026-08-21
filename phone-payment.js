document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // BACKEND URL
    // =========================================
     const API_URL = "https://college-event-manager-pro.onrender.com";


    // =========================================
    // GET ELEMENTS
    // =========================================

    const phoneEvent =
        document.getElementById("phoneEvent");

    const phoneStudent =
        document.getElementById("phoneStudent");

    const completeDemoPayment =
        document.getElementById("completeDemoPayment");


    // =========================================
    // GET URL PARAMETERS
    // =========================================

    const params =
        new URLSearchParams(
            window.location.search
        );

    const paymentSessionId =
        params.get("session");

    const sameDevice =
        params.get("sameDevice");


    // =========================================
    // GET REGISTRATION DATA
    // =========================================

    const registrationData = JSON.parse(
        localStorage.getItem("registrationData")
    ) || {};


    // =========================================
    // SHOW DETAILS
    // =========================================

    phoneEvent.textContent =
        registrationData.event || "Tech Spark 2027";

    phoneStudent.textContent =
        registrationData.fullname || "Student";


    // =========================================
    // COMPLETE DEMO PAYMENT
    // =========================================

    completeDemoPayment.addEventListener(
        "click",
        function () {

            // Check session

            if (!paymentSessionId) {

                alert(
                    "Payment session not found."
                );

                return;

            }


            // Disable button

            completeDemoPayment.disabled = true;

            completeDemoPayment.innerHTML =
                "Processing Payment...";


            // =================================
            // SEND PAYMENT TO BACKEND
            // =================================

            fetch(
                API_URL + "/complete-demo-payment",
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

                // Payment failed

                if (!data.success) {

                    alert(
                        data.message ||
                        "Payment could not be completed."
                    );

                    completeDemoPayment.disabled =
                        false;

                    completeDemoPayment.innerHTML =
                        "Complete Demo Payment →";

                    return;

                }


                // =============================
                // PAYMENT SUCCESS
                // =============================

                completeDemoPayment.innerHTML =
                    "✓ Payment Successful";


                // =============================
                // SAME DEVICE
                // =============================

                if (sameDevice === "true") {

                    setTimeout(function () {

                        window.location.href =
                            "payment-verification.html";

                    }, 1200);

                }


                // =============================
                // ANOTHER DEVICE
                // =============================

                else {

                    document.body.innerHTML = `
                    
                    <div style="
                        min-height:100vh;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-family:Poppins, sans-serif;
                        padding:20px;
                        text-align:center;
                    ">

                        <div>

                            <div style="
                                width:80px;
                                height:80px;
                                margin:auto;
                                display:flex;
                                align-items:center;
                                justify-content:center;
                                border-radius:50%;
                                font-size:40px;
                                background:#dcfce7;
                            ">
                                ✓
                            </div>

                            <h1>
                                Payment Successful!
                            </h1>

                            <p>
                                Your payment has been completed successfully.
                            </p>

                            <p>
                                You can now return to your original device.
                            </p>

                        </div>

                    </div>

                    `;

                }

            })

            .catch(function (error) {

                console.error(error);

                alert(
                    "Unable to connect to payment server."
                );

                completeDemoPayment.disabled =
                    false;

                completeDemoPayment.innerHTML =
                    "Complete Demo Payment →";

            });

        }
    );

});