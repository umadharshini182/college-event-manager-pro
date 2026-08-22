document.addEventListener("DOMContentLoaded", function () {

    const API_URL =
        "https://college-event-manager-pro.onrender.com";


    // =========================================
    // GET SESSION ID FROM URL
    // =========================================

    const params =
        new URLSearchParams(
            window.location.search
        );

    const sessionId =
        params.get("session");


    // =========================================
    // GET RECEIPT ELEMENTS
    // =========================================

    const receiptEvent =
        document.getElementById("receiptEvent");

    const receiptName =
        document.getElementById("receiptName");

    const receiptEmail =
        document.getElementById("receiptEmail");

    const receiptCollege =
        document.getElementById("receiptCollege");

    const receiptDepartment =
        document.getElementById("receiptDepartment");

    const receiptYear =
        document.getElementById("receiptYear");

    const receiptMethod =
        document.getElementById("receiptMethod");

    const receiptTransaction =
        document.getElementById("receiptTransaction");

    const receiptDate =
        document.getElementById("receiptDate");

    const receiptAmount =
        document.getElementById("receiptAmount");


    // =========================================
    // SET TEXT SAFELY
    // =========================================

    function setText(element, value) {

        if (element) {

            element.textContent =
                value !== undefined &&
                value !== null &&
                value !== ""
                    ? value
                    : "-";

        }

    }


    // =========================================
    // FORMAT DATE AND TIME - INDIA
    // =========================================

    function formatIndianDateTime(dateValue) {

        if (!dateValue) {

            return "-";

        }

        const date =
            new Date(dateValue);


        if (isNaN(date.getTime())) {

            return dateValue;

        }


        return date.toLocaleString(
            "en-IN",
            {
                timeZone: "Asia/Kolkata",
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            }
        );

    }


    // =========================================
    // SHOW RECEIPT
    // =========================================

    function showReceipt(data) {

        console.log(
            "RECEIPT DATA:",
            data
        );


        const registrationData =
            data.registrationData ||
            data.registration ||
            {};


        setText(
            receiptEvent,
            registrationData.event ||
            data.event ||
            "Tech Spark 2027"
        );

        setText(
            receiptName,
            registrationData.fullname ||
            registrationData.name ||
            data.fullname ||
            data.name
        );

        setText(
            receiptEmail,
            registrationData.email ||
            data.email
        );

        setText(
            receiptCollege,
            registrationData.college ||
            data.college
        );

        setText(
            receiptDepartment,
            registrationData.department ||
            data.department
        );

        setText(
            receiptYear,
            registrationData.year ||
            data.year
        );

        setText(
            receiptMethod,
            data.paymentMethod ||
            registrationData.paymentMethod ||
            "QR / UPI Demo"
        );

        setText(
            receiptTransaction,
            data.transactionId ||
            data.sessionId ||
            sessionId
        );


        // =====================================
        // CORRECT INDIA DATE AND TIME
        // =====================================

        const paymentDate =
            data.paymentDate ||
            data.paidAt ||
            data.createdAt;


        setText(
            receiptDate,
            formatIndianDateTime(
                paymentDate
            )
        );


        // =====================================
        // AMOUNT
        // =====================================

        if (receiptAmount) {

            const amount =
                Number(
                    data.amount ||
                    registrationData.amount ||
                    1000
                );

            receiptAmount.textContent =
                "₹" +
                amount.toLocaleString(
                    "en-IN"
                );

        }


        // =====================================
        // SAVE LOCAL BACKUP
        // =====================================

        localStorage.setItem(
            "receiptData",
            JSON.stringify({

                fullname:
                    registrationData.fullname ||
                    registrationData.name ||
                    data.fullname ||
                    data.name,

                email:
                    registrationData.email ||
                    data.email,

                college:
                    registrationData.college ||
                    data.college,

                department:
                    registrationData.department ||
                    data.department,

                year:
                    registrationData.year ||
                    data.year,

                event:
                    registrationData.event ||
                    data.event,

                paymentMethod:
                    data.paymentMethod ||
                    registrationData.paymentMethod ||
                    "QR / UPI Demo",

                transactionId:
                    data.transactionId ||
                    data.sessionId ||
                    sessionId,

                paymentDate:
                    paymentDate,

                amount:
                    data.amount ||
                    registrationData.amount ||
                    1000

            })
        );

    }


    // =========================================
    // LOAD FROM BACKEND
    // =========================================

    if (sessionId) {

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
                    "Unable to load receipt. Server returned " +
                    response.status
                );

            }

            return response.json();

        })

        .then(function (data) {

            showReceipt(data);

        })

        .catch(function (error) {

            console.error(
                "RECEIPT ERROR:",
                error
            );


            // =================================
            // FALLBACK TO LOCAL DATA
            // =================================

            const savedData =
                JSON.parse(
                    localStorage.getItem(
                        "receiptData"
                    )
                );


            if (savedData) {

                showReceipt({

                    registrationData: savedData,

                    paymentMethod:
                        savedData.paymentMethod,

                    transactionId:
                        savedData.transactionId,

                    paymentDate:
                        savedData.paymentDate,

                    amount:
                        savedData.amount

                });

            }

        });

    }


    // =========================================
    // NO SESSION - LOCAL FALLBACK
    // =========================================

    else {

        const savedData =
            JSON.parse(
                localStorage.getItem(
                    "receiptData"
                )
            );


        if (savedData) {

            showReceipt({

                registrationData:
                    savedData,

                paymentMethod:
                    savedData.paymentMethod,

                transactionId:
                    savedData.transactionId,

                paymentDate:
                    savedData.paymentDate,

                amount:
                    savedData.amount

            });

        }

    }


    // =========================================
    // PRINT RECEIPT
    // =========================================

    const downloadReceipt =
        document.getElementById(
            "downloadReceipt"
        );


    if (downloadReceipt) {

        downloadReceipt.addEventListener(
            "click",
            function () {

                window.print();

            }
        );

    }

});
const openQR = document.getElementById("openQR");

if (openQR) {

    openQR.addEventListener("click", function () {

        // Get the real payment session ID from receipt page URL
        const params = new URLSearchParams(
            window.location.search
        );

        const paymentSessionId =
            params.get("session");

        if (!paymentSessionId) {

            alert(
                "Payment session not found. Please complete payment again."
            );

            return;

        }

        // Open verification page with the SESSION parameter
        window.location.href =
            "verification.html?session=" +
            encodeURIComponent(paymentSessionId);

    });

}