document.addEventListener("DOMContentLoaded", function () {

    const API_URL =
        "https://college-event-manager-pro.onrender.com";


    // =========================================
    // GET SESSION ID
    // =========================================

    const params =
        new URLSearchParams(
            window.location.search
        );

    const sessionId =
        params.get("session");


    // =========================================
    // GET ELEMENTS
    // =========================================

    const verifyName =
        document.getElementById("verifyName");

    const verifyCollege =
        document.getElementById("verifyCollege");

    const verifyDepartment =
        document.getElementById("verifyDepartment");

    const verifyYear =
        document.getElementById("verifyYear");

    const verifyEvent =
        document.getElementById("verifyEvent");

    const verifyMethod =
        document.getElementById("verifyMethod");

    const verifyTransaction =
        document.getElementById("verifyTransaction");

    const verifyAmount =
        document.getElementById("verifyAmount");


    // =========================================
    // LOAD PAYMENT DATA FROM BACKEND
    // =========================================

    if (!sessionId) {

        console.error("No payment session found.");

        return;

    }


    fetch(
        API_URL +
        "/payment-status/" +
        encodeURIComponent(sessionId)
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

        const registrationData =
            data.registrationData || {};


        // =====================================
        // STUDENT DETAILS
        // =====================================

        if (verifyName) {

            verifyName.textContent =
                registrationData.fullname ||
                "Student";

        }


        if (verifyCollege) {

            verifyCollege.textContent =
                registrationData.college ||
                "-";

        }


        if (verifyDepartment) {

            verifyDepartment.textContent =
                registrationData.department ||
                "-";

        }


        if (verifyYear) {

            verifyYear.textContent =
                registrationData.year ||
                "-";

        }


        // =====================================
        // EVENT DETAILS
        // =====================================

        if (verifyEvent) {

            verifyEvent.textContent =
                registrationData.event ||
                "Tech Spark 2027";

        }


        // =====================================
        // PAYMENT DETAILS
        // =====================================

        if (verifyMethod) {

            verifyMethod.textContent =
                data.paymentMethod ||
                "QR / UPI Demo";

        }


        if (verifyTransaction) {

            verifyTransaction.textContent =
                data.transactionId ||
                "Processing...";

        }


        if (verifyAmount) {

            verifyAmount.textContent =
                "₹" +
                Number(
                    data.amount || 1000
                ).toLocaleString("en-IN");

        }


        // =====================================
        // SAVE FOR RECEIPT
        // =====================================

        localStorage.setItem(
            "receiptData",
            JSON.stringify({

                fullname:
                    registrationData.fullname,

                email:
                    registrationData.email,

                college:
                    registrationData.college,

                department:
                    registrationData.department,

                year:
                    registrationData.year,

                event:
                    registrationData.event,

                paymentMethod:
                    data.paymentMethod,

                amount:
                    data.amount,

                transactionId:
                    data.transactionId,

                paymentDate:
                    data.paymentDate

            })
        );

    })

    .catch(function (error) {

        console.error(
            "VERIFICATION ERROR:",
            error
        );

        if (verifyName) {

            verifyName.textContent =
                "Unable to load";

        }

    });

});