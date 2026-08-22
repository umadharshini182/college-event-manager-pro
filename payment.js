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
    // SAFE LOCAL STORAGE FUNCTION
    // =========================================

    function getStorageData(key) {

        try {

            const value = localStorage.getItem(key);

            if (!value) {
                return null;
            }

            return JSON.parse(value);

        } catch (error) {

            console.error(
                "Storage error for " + key + ":",
                error
            );

            return null;
        }
    }


    // =========================================
    // GET REGISTRATION DATA
    // =========================================

    function getRegistrationData() {

        const registrationData =
            getStorageData("registrationData");

        const studentData =
            getStorageData("studentData");

        const receiptData =
            getStorageData("receiptData");


        const data =
            registrationData ||
            studentData ||
            receiptData ||
            {};


        return {

            fullname:
                data.fullname ||
                data.name ||
                localStorage.getItem("studentName") ||
                "",

            email:
                data.email ||
                localStorage.getItem("studentEmail") ||
                "",

            college:
                data.college ||
                localStorage.getItem("college") ||
                "",

            department:
                data.department ||
                localStorage.getItem("department") ||
                "",

            year:
                data.year ||
                localStorage.getItem("year") ||
                "",

            event:
                data.event ||
                localStorage.getItem("eventName") ||
                "Tech Spark 2027"
        };
    }


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
                method.getAttribute("data-method") ||
                method.textContent.trim() ||
                "Google Pay";


            localStorage.setItem(
                "selectedPaymentMethod",
                selectedMethod
            );


            console.log(
                "SELECTED PAYMENT METHOD:",
                selectedMethod
            );

        });

    });


    // =========================================
    // CONTINUE PAYMENT
    // =========================================

    if (continuePayment) {

        continuePayment.addEventListener(
            "click",
            function () {

                const registrationData =
                    getRegistrationData();

  

                // =================================
                // CHECK REQUIRED DATA
                // =================================

                if (
                    !registrationData.fullname ||
                    !registrationData.email ||
                    !registrationData.college ||
                    !registrationData.department ||
                    !registrationData.year ||
                    !registrationData.event
                ) {

                    alert(
                        "Registration data not found. Please register again."
                    );

                    return;
                }


                // =================================
                // SAVE DATA
                // =================================

                localStorage.setItem(
                    "registrationData",
                    JSON.stringify(registrationData)
                );

                localStorage.setItem(
                    "studentData",
                    JSON.stringify(registrationData)
                );


                // =================================
                // CREATE SESSION ID
                // =================================

                const sessionId =
                    "PAY-" +
                    Date.now() +
                    "-" +
                    Math.random()
                        .toString(36)
                        .substring(2, 8)
                        .toUpperCase();


                const originalButtonText =
                    continuePayment.innerHTML;


                continuePayment.disabled = true;

                continuePayment.innerHTML =
                    "Preparing secure payment...";


                // =================================
                // CREATE PAYMENT SESSION
                // =================================

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


                    // =================================
                    // SAVE SESSION ID
                    // =================================

                    localStorage.setItem(
                        "paymentSessionId",
                        sessionId
                    );


                    // =================================
                    // OPEN QR MODAL
                    // IMPORTANT: USE "show"
                    // =================================
                 console.log("QR MODAL:", qrModal);
console.log("QR CONTAINER:", paymentQRCode);
console.log("QRCODE LIBRARY:", typeof QRCode);

if (!qrModal) {
    alert("QR modal not found in payment.html");
    return;
}

if (!paymentQRCode) {
    alert("QR container not found in payment.html");
    return;
}

qrModal.classList.add("show");
qrModal.classList.add("active");

qrModal.style.display = "flex";
qrModal.style.visibility = "visible";
qrModal.style.opacity = "1";
qrModal.style.zIndex = "999999";

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
                        window.location.pathname.replace(
                            "payment.html",
                            "phone-payment.html"
                        ) +
                        "?session=" +
                        encodeURIComponent(sessionId);





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

                        console.error(
                            "QR Code library not loaded"
                        );

                    }


                    // =================================
                    // PAYMENT STATUS
                    // =================================

                    if (paymentStatus) {

                        paymentStatus.textContent =
                            "Scan this QR code using another device.";

                    }


                    // =================================
                    // START STATUS CHECKING
                    // =================================

                    checkPaymentStatus(sessionId);

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

                    continuePayment.disabled = false;

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

    closeQR.addEventListener("click", function () {

        if (qrModal) {

            qrModal.classList.remove("show");
            qrModal.classList.remove("active");

            qrModal.style.display = "none";
            qrModal.style.visibility = "hidden";
            qrModal.style.opacity = "0";

        }

    });

}
    // =========================================
    // CLICK OUTSIDE MODAL TO CLOSE
    // =========================================

    if (qrModal) {

        qrModal.addEventListener(
            "click",
            function (event) {

                if (event.target === qrModal) {

                    qrModal.classList.remove("show");
qrModal.classList.remove("active");
qrModal.style.display = "none";

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
                        encodeURIComponent(sessionId)
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
                            data.status === "waiting"
                        ) {

                            if (paymentStatus) {

                                paymentStatus.textContent =
                                    "Waiting for QR scan...";

                            }

                        }


                        if (
                            data.status === "scanned"
                        ) {

                            if (paymentStatus) {

                                paymentStatus.textContent =
                                    "QR scanned. Waiting for payment...";

                            }

                        }


                        if (
                            data.status === "processing"
                        ) {

                            if (paymentStatus) {

                                paymentStatus.textContent =
                                    "Payment is being processed...";

                            }

                        }


                        if (
                            data.status === "paid"
                        ) {

                            clearInterval(statusInterval);


                            if (paymentStatus) {

                                paymentStatus.textContent =
                                    "✓ Payment successful! Opening receipt...";

                            }


                            const backendRegistrationData =
                                data.registrationData ||
                                getRegistrationData();


                            const receiptData = {

                                fullname:
                                    backendRegistrationData.fullname ||
                                    "",

                                email:
                                    backendRegistrationData.email ||
                                    "",

                                college:
                                    backendRegistrationData.college ||
                                    "",

                                department:
                                    backendRegistrationData.department ||
                                    "",

                                year:
                                    backendRegistrationData.year ||
                                    "",

                                event:
                                    backendRegistrationData.event ||
                                    "Tech Spark 2027",

                                paymentMethod:
                                    data.paymentMethod ||
                                    selectedMethod,

                                transactionId:
                                    data.transactionId ||
                                    "",

                                paymentDate:
                                    data.paymentDate ||
                                    new Date().toLocaleString("en-IN"),

                                amount:
                                    data.amount ||
                                    1000

                            };


                            localStorage.setItem(
                                "receiptData",
                                JSON.stringify(receiptData)
                            );


                            setTimeout(
                                function () {

                                    window.location.href =
                                        "receipt.html?session=" +
                                        encodeURIComponent(sessionId);

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