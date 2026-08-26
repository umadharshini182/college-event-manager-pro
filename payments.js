// ======================================================
// STUDENT PAYMENT PAGE
// ======================================================

const BACKEND_URL =
    "https://college-event-manager-pro.onrender.com";

let selectedPaymentMethod = "Google Pay";
let currentSessionId = null;
let paymentStatusInterval = null;


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("PAYMENT PAGE LOADED");

    initializePaymentMethods();

    initializeContinueButton();

    initializeQRModal();

});


// ======================================================
// PAYMENT METHOD SELECTION
// ======================================================

function initializePaymentMethods() {

    const methods =
        document.querySelectorAll(".payment-method");

    methods.forEach(function (method) {

        method.addEventListener("click", function () {

            methods.forEach(function (item) {

                item.classList.remove("selected");

            });

            method.classList.add("selected");

            selectedPaymentMethod =
                method.dataset.method;

            console.log(
                "Selected payment method:",
                selectedPaymentMethod
            );

        });

    });

}


// ======================================================
// CONTINUE PAYMENT
// ======================================================

function initializeContinueButton() {

    const continueButton =
        document.getElementById("continuePayment");

    if (!continueButton) {

        console.error(
            "CONTINUE BUTTON NOT FOUND"
        );

        return;

    }


    continueButton.addEventListener(
        "click",
        async function () {

            console.log(
                "Continue clicked:",
                selectedPaymentMethod
            );

            const registrationData =
                JSON.parse(
                    localStorage.getItem(
                        "registrationData"
                    ) || "{}"
                );


            currentSessionId =
                "PAY-" +
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .substring(2, 8);


            try {

                const response =
                    await fetch(
                        BACKEND_URL +
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
                                        currentSessionId,

                                    registrationData:
                                        registrationData,

                                    paymentMethod:
                                        selectedPaymentMethod

                                })

                        }
                    );


                const data =
                    await response.json();


                if (!data.success) {

                    alert(
                        data.message ||
                        "Unable to create payment session."
                    );

                    return;

                }


                openQRModal();

            }

            catch (error) {

                console.error(
                    "Payment session error:",
                    error
                );

                alert(
                    "Unable to connect to payment server."
                );

            }

        }
    );

}


// ======================================================
// QR MODAL
// ======================================================

function initializeQRModal() {

    const closeButton =
        document.getElementById("closeQR");

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeQRModal
        );

    }

}


function openQRModal() {

    const modal =
        document.getElementById("qrModal");

    const qrContainer =
        document.getElementById("paymentQRCode");

    const status =
        document.getElementById("paymentStatus");


    if (!modal || !qrContainer) {

        console.error(
            "QR MODAL OR QR CONTAINER NOT FOUND"
        );

        return;

    }


    modal.classList.add("show");

    qrContainer.innerHTML = "";

    status.textContent =
        "Waiting for payment confirmation...";


    const paymentURL =
        window.location.origin +
        "/payment-confirm.html?sessionId=" +
        encodeURIComponent(currentSessionId);


    if (typeof QRCode !== "undefined") {

        new QRCode(
            qrContainer,
            {

                text: paymentURL,

                width: 220,

                height: 220

            }
        );

    }

    else {

        qrContainer.innerHTML =
            "<p>QR code could not be loaded.</p>";

        console.error(
            "QRCode library not loaded"
        );

    }


    startPaymentStatusCheck();

}


// ======================================================
// CLOSE QR MODAL
// ======================================================

function closeQRModal() {

    const modal =
        document.getElementById("qrModal");

    if (modal) {

        modal.classList.remove("show");

    }


    if (paymentStatusInterval) {

        clearInterval(
            paymentStatusInterval
        );

        paymentStatusInterval = null;

    }

}


// ======================================================
// CHECK PAYMENT STATUS
// ======================================================

function startPaymentStatusCheck() {

    if (paymentStatusInterval) {

        clearInterval(
            paymentStatusInterval
        );

    }


    paymentStatusInterval =
        setInterval(
            async function () {

                if (!currentSessionId) {

                    return;

                }


                try {

                    const response =
                        await fetch(
                            BACKEND_URL +
                            "/payment-status/" +
                            encodeURIComponent(
                                currentSessionId
                            )
                        );


                    const data =
                        await response.json();


                    if (!data.success) {

                        return;

                    }


                    const statusElement =
                        document.getElementById(
                            "paymentStatus"
                        );


                    if (
                        data.status === "waiting"
                    ) {

                        statusElement.textContent =
                            "Waiting for payment confirmation...";

                    }


                    if (
                        data.status === "scanned"
                    ) {

                        statusElement.textContent =
                            "QR scanned. Processing payment...";

                    }


                    if (
                        data.status === "processing"
                    ) {

                        statusElement.textContent =
                            "Payment is being processed...";

                    }


                    if (
                        data.status === "paid"
                    ) {

                        clearInterval(
                            paymentStatusInterval
                        );

                        paymentStatusInterval =
                            null;


                        statusElement.textContent =
                            "Payment successful!";


                        await saveRegistration(
                            data
                        );

                    }

                }

                catch (error) {

                    console.error(
                        "Payment status error:",
                        error
                    );

                }

            },
            1500
        );

}


// ======================================================
// SAVE COMPLETED REGISTRATION
// ======================================================

async function saveRegistration(
    paymentData
) {

    const registrationData =
        JSON.parse(
            localStorage.getItem(
                "registrationData"
            ) || "{}"
        );


    try {

        const response =
            await fetch(
                BACKEND_URL + "/register",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            ...registrationData,

                            paymentMethod:
                                paymentData.paymentMethod ||
                                selectedPaymentMethod,

                            paymentStatus:
                                "Paid",

                            paymentAmount:
                                paymentData.amount ||
                                1000,

                            paymentDate:
                                paymentData.paymentDate,

                            paymentId:
                                paymentData.transactionId

                        })

                }
            );


        const data =
            await response.json();


        if (!data.success) {

            alert(
                "Payment succeeded, but registration could not be saved."
            );

            return;

        }


        localStorage.setItem(
            "paymentReceipt",
            JSON.stringify(data)
        );


        window.location.href =
            "receipt.html?id=" +
            encodeURIComponent(data.id);

    }

    catch (error) {

        console.error(
            "Registration save error:",
            error
        );

        alert(
            "Payment succeeded, but there was an error saving your registration."
        );

    }

}