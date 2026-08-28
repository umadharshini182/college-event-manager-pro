document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // BACKEND URL
    // =========================================

    const API_URL =
        "https://college-event-manager-pro.onrender.com";


    // =========================================
    // GET URL PARAMETERS
    // =========================================

    const params =
        new URLSearchParams(
            window.location.search
        );

    // Payment session ID
    const sessionId =
        params.get("session");

    // Database registration ID
    const registrationId =
        params.get("id");


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

    const openQR =
        document.getElementById("openQR");

    const downloadReceipt =
        document.getElementById("downloadReceipt");


    // =========================================
    // SET TEXT SAFELY
    // =========================================

    function setText(element, value) {

        if (!element) {
            return;
        }

        element.textContent =
            value !== undefined &&
            value !== null &&
            value !== ""
                ? value
                : "-";

    }


    // =========================================
    // FORMAT DATE
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
            data.student ||
            {};


        setText(
            receiptEvent,
            registrationData.event ||
            data.event ||
            "-"
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
            "Online Payment"
        );


        setText(
            receiptTransaction,
            data.transactionId ||
            data.sessionId ||
            (
                registrationData.id
                    ? "Registration #" +
                      registrationData.id
                    : "-"
            )
        );


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
        // SAVE RECEIPT DATA
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
                    "Online Payment",

                transactionId:
                    data.transactionId ||
                    data.sessionId ||
                    (
                        registrationData.id
                            ? "Registration #" +
                              registrationData.id
                            : ""
                    ),

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
    // LOAD RECEIPT USING DATABASE ID
    // =========================================

    if (registrationId) {

        localStorage.setItem(
            "receiptRegistrationId",
            registrationId
        );


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
                    "Unable to load receipt. Server returned " +
                    response.status
                );

            }

            return response.json();

        })

        .then(function (data) {

            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Receipt not found."
                );

            }


            const student =
                data.student || {};


            showReceipt({

                student: student,

                amount:
                    student.amount,

                paymentMethod:
                    "Online Payment",

                transactionId:
                    "Registration #" +
                    student.id

            });

        })

        .catch(function (error) {

            console.error(
                "RECEIPT ERROR:",
                error
            );

        });

    }


    // =========================================
    // LOAD RECEIPT USING PAYMENT SESSION
    // =========================================

    else if (sessionId) {

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

        });

    }


    // =========================================
    // LOCAL FALLBACK
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
    // VERIFY REGISTRATION
    // =========================================

    if (openQR) {

        openQR.addEventListener(
            "click",
            function () {

                const id =
                    registrationId ||
                    localStorage.getItem(
                        "receiptRegistrationId"
                    );


                if (!id) {

                    alert(
                        "Registration ID not found."
                    );

                    return;

                }


                window.location.href =
                    "verification.html?id=" +
                    encodeURIComponent(id);

            }
        );

    }


    // =========================================
    // PRINT / SAVE RECEIPT
    // =========================================

    if (downloadReceipt) {

        downloadReceipt.addEventListener(
            "click",
            function () {

                window.print();

            }
        );

    }

});