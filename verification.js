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
    // LOAD FROM BACKEND
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

            if (!response.ok) {

                throw new Error(
                    "Unable to load verification details."
                );

            }

            return response.json();

        })

        .then(function (data) {

            if (data.status !== "paid") {

                alert(
                    "This payment has not been completed."
                );

                window.location.href =
                    "index.html";

                return;

            }


            const registrationData =
                data.registrationData || {};


            // =========================================
            // STUDENT INFORMATION
            // =========================================

            document.getElementById(
                "verifyName"
            ).textContent =
                registrationData.fullname || "-";


            document.getElementById(
                "verifyCollege"
            ).textContent =
                registrationData.college || "-";


            document.getElementById(
                "verifyDepartment"
            ).textContent =
                registrationData.department || "-";


            document.getElementById(
                "verifyYear"
            ).textContent =
                registrationData.year || "-";


            // =========================================
            // EVENT INFORMATION
            // =========================================

            document.getElementById(
                "verifyEvent"
            ).textContent =
                registrationData.event ||
                "Event Registration";


            // =========================================
            // PAYMENT INFORMATION
            // =========================================

            document.getElementById(
                "verifyMethod"
            ).textContent =
                data.paymentMethod ||
                "QR / UPI Demo";


            document.getElementById(
                "verifyTransaction"
            ).textContent =
                data.transactionId || "-";


            document.getElementById(
                "verifyAmount"
            ).textContent =
                "₹" +
                Number(
                    data.amount || 1000
                ).toLocaleString(
                    "en-IN"
                );

        })

        .catch(function (error) {

            console.error(
                "Verification loading error:",
                error
            );

            alert(
                "Unable to load registration verification."
            );

        });


        return;

    }


    // =========================================
    // FALLBACK: OLD LOCALSTORAGE FLOW
    // =========================================

    const receiptData = JSON.parse(
        localStorage.getItem("receiptData")
    );


    if (!receiptData) {

        alert(
            "Registration verification data not found."
        );

        window.location.href =
            "index.html";

        return;

    }


    document.getElementById(
        "verifyName"
    ).textContent =
        receiptData.fullname || "-";


    document.getElementById(
        "verifyCollege"
    ).textContent =
        receiptData.college || "-";


    document.getElementById(
        "verifyDepartment"
    ).textContent =
        receiptData.department || "-";


    document.getElementById(
        "verifyYear"
    ).textContent =
        receiptData.year || "-";


    document.getElementById(
        "verifyEvent"
    ).textContent =
        receiptData.event ||
        "Event Registration";


    document.getElementById(
        "verifyMethod"
    ).textContent =
        receiptData.paymentMethod || "-";


    document.getElementById(
        "verifyTransaction"
    ).textContent =
        receiptData.transactionId || "-";


    document.getElementById(
        "verifyAmount"
    ).textContent =
        "₹" +
        Number(
            receiptData.amount || 1000
        ).toLocaleString("en-IN");

});