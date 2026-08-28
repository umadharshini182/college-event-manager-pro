document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // BACKEND URL
    // =========================================

    const API_URL =
        "https://college-event-manager-pro.onrender.com";


    // =========================================
    // GET REGISTRATION ID
    // =========================================

    const params =
        new URLSearchParams(
            window.location.search
        );

    const registrationId =
        params.get("id");


    // =========================================
    // GET PAGE ELEMENTS
    // =========================================

    const verifyName =
        document.getElementById(
            "verifyName"
        );

    const verifyCollege =
        document.getElementById(
            "verifyCollege"
        );

    const verifyDepartment =
        document.getElementById(
            "verifyDepartment"
        );

    const verifyYear =
        document.getElementById(
            "verifyYear"
        );

    const verifyEvent =
        document.getElementById(
            "verifyEvent"
        );

    const verifyMethod =
        document.getElementById(
            "verifyMethod"
        );

    const verifyTransaction =
        document.getElementById(
            "verifyTransaction"
        );

    const verifyAmount =
        document.getElementById(
            "verifyAmount"
        );


    // =========================================
    // CHECK REGISTRATION ID
    // =========================================

    if (!registrationId) {

        console.error(
            "No registration ID found."
        );

        if (verifyName) {
            verifyName.textContent =
                "Registration not found";
        }

        return;

    }


    // =========================================
    // LOAD VERIFIED REGISTRATION
    // =========================================

    fetch(
        API_URL +
        "/payment-verification/" +
        encodeURIComponent(
            registrationId
        )
    )

    .then(function (response) {

        if (!response.ok) {

            throw new Error(
                "Unable to load verification. Status: " +
                response.status
            );

        }

        return response.json();

    })

    .then(function (data) {

        console.log(
            "VERIFICATION DATA:",
            data
        );


        if (!data.success) {

            throw new Error(
                data.message ||
                "Payment verification failed."
            );

        }


        const student =
            data.student || {};


        // =====================================
        // STUDENT NAME
        // =====================================

        if (verifyName) {

            verifyName.textContent =
                student.fullname || "-";

        }


        // =====================================
        // COLLEGE
        // =====================================

        if (verifyCollege) {

            verifyCollege.textContent =
                student.college || "-";

        }


        // =====================================
        // DEPARTMENT
        // =====================================

        if (verifyDepartment) {

            verifyDepartment.textContent =
                student.department || "-";

        }


        // =====================================
        // YEAR
        // =====================================

        if (verifyYear) {

            verifyYear.textContent =
                student.year || "-";

        }


        // =====================================
        // EVENT
        // =====================================

        if (verifyEvent) {

            verifyEvent.textContent =
                student.event || "-";

        }


        // =====================================
        // PAYMENT METHOD
        // =====================================

        if (verifyMethod) {

            verifyMethod.textContent =
                "Online Payment";

        }


        // =====================================
        // REGISTRATION / TRANSACTION ID
        // =====================================

        if (verifyTransaction) {

            verifyTransaction.textContent =
                "Registration #" +
                student.id;

        }


        // =====================================
        // AMOUNT
        // =====================================

        if (verifyAmount) {

            verifyAmount.textContent =
                "₹" +
                Number(
                    student.amount || 0
                ).toLocaleString(
                    "en-IN"
                );

        }


        // =====================================
        // SAVE VERIFIED DATA
        // =====================================

        localStorage.setItem(
            "receiptRegistrationId",
            student.id
        );

        localStorage.setItem(
            "verifiedRegistration",
            JSON.stringify(student)
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

        if (verifyCollege) {
            verifyCollege.textContent =
                "-";
        }

        if (verifyDepartment) {
            verifyDepartment.textContent =
                "-";
        }

        if (verifyYear) {
            verifyYear.textContent =
                "-";
        }

        if (verifyEvent) {
            verifyEvent.textContent =
                "-";
        }

        if (verifyMethod) {
            verifyMethod.textContent =
                "-";
        }

        if (verifyTransaction) {
            verifyTransaction.textContent =
                "-";
        }

        if (verifyAmount) {
            verifyAmount.textContent =
                "-";
        }

    });

});