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
    // LOAD RECEIPT
    // =========================================

    if (paymentSessionId) {

        loadReceiptFromBackend();

    } else {

        // Fallback for old same-device flow

        const receiptData = JSON.parse(
            localStorage.getItem("receiptData")
        );

        if (!receiptData) {

            alert("Receipt data not found.");

            window.location.href =
                "payment.html";

            return;

        }

        showReceipt(receiptData);

    }


    // =========================================
    // LOAD DATA FROM BACKEND
    // =========================================

    function loadReceiptFromBackend() {

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
                    "Unable to load payment details."
                );

            }

            return response.json();

        })

        .then(function (data) {

            if (data.status !== "paid") {

                alert(
                    "Payment is not completed yet."
                );

                window.location.href =
                    "payment.html";

                return;

            }


            // =========================================
            // CREATE RECEIPT DATA
            // =========================================

            const registrationData =
                data.registrationData || {};


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
                    data.paymentMethod ||
                    "QR / UPI Demo",

                amount:
                    data.amount || 1000,

                transactionId:
                    data.transactionId || "-",

                paymentDate:
                    data.paymentDate || "-"

            };


            // Save locally too

            localStorage.setItem(
                "receiptData",
                JSON.stringify(receiptData)
            );


            // Show receipt

            showReceipt(receiptData);

        })

        .catch(function (error) {

            console.error(
                "Receipt loading error:",
                error
            );

            alert(
                "Unable to load receipt details."
            );

        });

    }


    // =========================================
    // SHOW RECEIPT DATA
    // =========================================

    function showReceipt(receiptData) {


        // EVENT

        document.getElementById(
            "receiptEvent"
        ).textContent =
            receiptData.event ||
            "Event Registration";


        // STUDENT DETAILS

        document.getElementById(
            "receiptName"
        ).textContent =
            receiptData.fullname || "-";


        document.getElementById(
            "receiptEmail"
        ).textContent =
            receiptData.email || "-";


        document.getElementById(
            "receiptCollege"
        ).textContent =
            receiptData.college || "-";


        document.getElementById(
            "receiptDepartment"
        ).textContent =
            receiptData.department || "-";


        document.getElementById(
            "receiptYear"
        ).textContent =
            receiptData.year || "-";


        // PAYMENT DETAILS

        document.getElementById(
            "receiptMethod"
        ).textContent =
            receiptData.paymentMethod || "-";


        document.getElementById(
            "receiptTransaction"
        ).textContent =
            receiptData.transactionId || "-";


        document.getElementById(
            "receiptDate"
        ).textContent =
            receiptData.paymentDate || "-";


        document.getElementById(
            "receiptAmount"
        ).textContent =
            "₹" +
            Number(
                receiptData.amount || 1000
            ).toLocaleString("en-IN");

    }


    // =========================================
    // VERIFY REGISTRATION
    // =========================================

    const openQR =
        document.getElementById("openQR");


    if (openQR) {

        openQR.addEventListener(
            "click",
            function () {

                if (paymentSessionId) {

                    window.location.href =
                        "verification.html?session=" +
                        encodeURIComponent(
                            paymentSessionId
                        );

                } else {

                    window.location.href =
                        "verification.html";

                }

            }
        );

    }


    // =========================================
    // PRINT / SAVE RECEIPT
    // =========================================

    const downloadReceipt =
        document.getElementById(
            "downloadReceipt"
        );


    if (downloadReceipt) {

        downloadReceipt.addEventListener(
            "click",
            function () {

                const originalText =
                    downloadReceipt.innerHTML;


                downloadReceipt.innerHTML =
                    "Preparing Receipt...";


                downloadReceipt.disabled =
                    true;


                setTimeout(function () {

                    downloadReceipt.innerHTML =
                        originalText;


                    downloadReceipt.disabled =
                        false;


                    window.print();

                }, 500);

            }
        );

    }

});