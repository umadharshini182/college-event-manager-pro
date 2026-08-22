document.addEventListener("DOMContentLoaded", function () {

    const API_URL =
        "https://college-event-manager-pro.onrender.com";


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

    const scanStatus =
        document.querySelector(".scan-status");


    // =========================================
    // SAFE LOCAL STORAGE READER
    // =========================================

    function getStoredObject(key) {

        try {

            const value =
                localStorage.getItem(key);

            return value ?
                JSON.parse(value) :
                {};

        } catch (error) {

            console.error(
                "Storage error:",
                key,
                error
            );

            return {};

        }

    }


    // =========================================
    // GET DATA FROM ALL PROJECT STORAGE FORMATS
    // =========================================

    const registrationDataStored =
        getStoredObject("registrationData");

    const studentDataStored =
        getStoredObject("studentData");


    // Merge old + new project data
    const registrationData = {

        fullname:
            registrationDataStored.fullname ||
            studentDataStored.fullname ||
            localStorage.getItem("fullname") ||
            "",

        email:
            registrationDataStored.email ||
            studentDataStored.email ||
            localStorage.getItem("email") ||
            "",

        college:
            registrationDataStored.college ||
            studentDataStored.college ||
            localStorage.getItem("college") ||
            "",

        department:
            registrationDataStored.department ||
            studentDataStored.department ||
            localStorage.getItem("department") ||
            "",

        year:
            registrationDataStored.year ||
            studentDataStored.year ||
            localStorage.getItem("year") ||
            "",

        event:
            registrationDataStored.event ||
            studentDataStored.event ||
            localStorage.getItem("event") ||
            "Tech Spark 2027"

    };


    // Save one clean format for all pages
    localStorage.setItem(
        "registrationData",
        JSON.stringify(registrationData)
    );

    localStorage.setItem(
        "studentData",
        JSON.stringify({
            ...studentDataStored,
            ...registrationData
        })
    );


    // =========================================
    // SHOW DETAILS ON QR PAGE
    // =========================================

    if (qrStudentName) {

        qrStudentName.textContent =
            registrationData.fullname ||
            "Student";

    }


    if (qrEventName) {

        qrEventName.textContent =
            registrationData.event ||
            "Tech Spark 2027";

    }


    if (qrCollegeName) {

        qrCollegeName.textContent =
            registrationData.college ||
            "College";

    }


    // =========================================
    // CREATE UNIQUE PAYMENT SESSION
    // =========================================

    const paymentSessionId =
        "PAY-" +
        Date.now() +
        "-" +
        Math.floor(
            Math.random() * 100000
        );


    localStorage.setItem(
        "paymentSessionId",
        paymentSessionId
    );


    // =========================================
    // UPDATE STATUS
    // =========================================

    function updateStatus(text) {

        if (!scanStatus) {

            return;

        }

        const statusText =
            scanStatus.querySelector(
                "span:last-child"
            );

        if (statusText) {

            statusText.textContent =
                text;

        } else {

            scanStatus.textContent =
                text;

        }

    }


    // =========================================
    // CREATE PAYMENT SESSION
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
                    paymentSessionId,

                registrationData:
                    registrationData,

                paymentMethod:
                    "QR / UPI Demo"

            })

        }
    )

    .then(function (response) {

        if (!response.ok) {

            throw new Error(
                "Server error: " +
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


        // =====================================
        // CREATE PHONE PAYMENT URL
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
        // GENERATE QR CODE
        // =====================================

        if (!qrContainer) {

            throw new Error(
                "QR container not found."
            );

        }


        if (
            typeof QRCode ===
            "undefined"
        ) {

            throw new Error(
                "QR code library not loaded."
            );

        }


        qrContainer.innerHTML = "";


        new QRCode(
            qrContainer,
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


        updateStatus(
            "Scan the QR code to continue payment."
        );


        // Start laptop status checking
        checkPaymentStatus();

    })

    .catch(function (error) {

        console.error(
            "QR PAYMENT ERROR:",
            error
        );

        updateStatus(
            "Unable to start secure payment."
        );

    });


    // =========================================
    // CHECK PAYMENT STATUS
    // =========================================

    let paymentCompleted =
        false;

    let statusInterval =
        null;


    function checkPaymentStatus() {

        statusInterval =
            setInterval(
                function () {

                    if (paymentCompleted) {

                        clearInterval(
                            statusInterval
                        );

                        return;

                    }


                    fetch(
                        API_URL +
                        "/payment-status/" +
                        encodeURIComponent(
                            paymentSessionId
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

                        if (!data.success) {

                            return;

                        }


                        // Update local data from backend
                        if (
                            data.registrationData
                        ) {

                            Object.assign(
                                registrationData,
                                data.registrationData
                            );

                            localStorage.setItem(
                                "registrationData",
                                JSON.stringify(
                                    registrationData
                                )
                            );

                            localStorage.setItem(
                                "studentData",
                                JSON.stringify(
                                    registrationData
                                )
                            );

                        }


                        if (
                            data.status ===
                            "waiting"
                        ) {

                            updateStatus(
                                "Waiting for QR scan..."
                            );

                        }


                        if (
                            data.status ===
                            "scanned"
                        ) {

                            updateStatus(
                                "QR scanned. Processing payment..."
                            );

                        }


                        if (
                            data.status ===
                            "processing"
                        ) {

                            updateStatus(
                                "Verifying secure payment..."
                            );

                        }


                        if (
                            data.status ===
                            "paid" &&
                            !paymentCompleted
                        ) {

                            paymentCompleted =
                                true;

                            clearInterval(
                                statusInterval
                            );


                            const finalRegistrationData =
                                data.registrationData ||
                                registrationData;


                            const receiptData = {

                                fullname:
                                    finalRegistrationData.fullname ||
                                    registrationData.fullname ||
                                    "Student",

                                email:
                                    finalRegistrationData.email ||
                                    registrationData.email ||
                                    "-",

                                college:
                                    finalRegistrationData.college ||
                                    registrationData.college ||
                                    "-",

                                department:
                                    finalRegistrationData.department ||
                                    registrationData.department ||
                                    "-",

                                year:
                                    finalRegistrationData.year ||
                                    registrationData.year ||
                                    "-",

                                event:
                                    finalRegistrationData.event ||
                                    registrationData.event ||
                                    "Tech Spark 2027",

                                paymentMethod:
                                    data.paymentMethod ||
                                    "QR / UPI Demo",

                                amount:
                                    data.amount ||
                                    1000,

                                transactionId:
                                    data.transactionId ||
                                    "TXN" +
                                    Date.now(),

                                paymentDate:
                                    data.paymentDate ||
                                    new Date().toLocaleString(
                                        "en-IN"
                                    )

                            };


                            // IMPORTANT:
                            // Save for receipt fallback

                            localStorage.setItem(
                                "receiptData",
                                JSON.stringify(
                                    receiptData
                                )
                            );


                            localStorage.setItem(
                                "registrationData",
                                JSON.stringify(
                                    {
                                        fullname:
                                            receiptData.fullname,

                                        email:
                                            receiptData.email,

                                        college:
                                            receiptData.college,

                                        department:
                                            receiptData.department,

                                        year:
                                            receiptData.year,

                                        event:
                                            receiptData.event
                                    }
                                )
                            );


                            localStorage.setItem(
                                "studentData",
                                JSON.stringify(
                                    {
                                        fullname:
                                            receiptData.fullname,

                                        email:
                                            receiptData.email,

                                        college:
                                            receiptData.college,

                                        department:
                                            receiptData.department,

                                        year:
                                            receiptData.year,

                                        event:
                                            receiptData.event
                                    }
                                )
                            );


                            updateStatus(
                                "Payment successful! Opening receipt..."
                            );


                            setTimeout(
                                function () {

                                    window.location.href =
                                        "receipt.html?session=" +
                                        encodeURIComponent(
                                            paymentSessionId
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


    // =========================================
    // SAME DEVICE PAYMENT
    // =========================================

    if (qrPayButton) {

        qrPayButton.addEventListener(
            "click",
            function () {

                qrPayButton.disabled =
                    true;

                qrPayButton.textContent =
                    "Processing Payment...";


                fetch(
                    API_URL +
                    "/start-auto-payment",
                    {

                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                {

                                    sessionId:
                                        paymentSessionId

                                }
                            )

                    }
                )

                .then(function (response) {

                    if (!response.ok) {

                        throw new Error(
                            "Unable to start payment."
                        );

                    }

                    return response.json();

                })

                .then(function (data) {

                    if (!data.success) {

                        throw new Error(
                            data.message ||
                            "Payment failed."
                        );

                    }


                    updateStatus(
                        "Processing secure payment..."
                    );

                })

                .catch(function (error) {

                    console.error(
                        "AUTO PAYMENT ERROR:",
                        error
                    );

                    qrPayButton.disabled =
                        false;

                    qrPayButton.textContent =
                        "Try Again";

                    updateStatus(
                        "Unable to start payment."
                    );

                });

            }
        );

    }

});