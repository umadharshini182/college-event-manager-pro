// ===============================
// PAYMENT PAGE
// ===============================

const student = JSON.parse(
    localStorage.getItem("studentData")
) || {};


// ===============================
// STUDENT DETAILS
// ===============================

const studentName =
    document.getElementById("studentName");

const eventName =
    document.getElementById("eventName");
if (studentName) {
    studentName.textContent =
        student.fullname || "-";
}

if (eventName) {
    eventName.textContent =
        student.event || "-";
}

document.getElementById("studentEmail").textContent =
    student.email || "-";

document.getElementById("studentCollege").textContent =
    student.college || "-";

document.getElementById("studentDepartment").textContent =
    student.department || "-";

document.getElementById("studentYear").textContent =
    student.year || "-";


// ===============================
// PAYMENT OPTIONS
// ===============================

const paymentOptions =
    document.querySelectorAll(
        ".payment-option, .bank-option, .card-option"
    );

const selectedMethod =
    document.getElementById("selectedMethod");

const continueButton =
    document.getElementById("continueButton");

let selectedPaymentMethod = "";


// ===============================
// SELECT PAYMENT METHOD
// ===============================

paymentOptions.forEach(function (option) {

    option.addEventListener(
        "click",
        function () {

            // Remove old selection
            paymentOptions.forEach(
                function (item) {
                    item.classList.remove(
                        "selected"
                    );
                }
            );


            // Select current option
            this.classList.add("selected");


            // Save selected method
            selectedPaymentMethod =
                this.dataset.method;


            // Show selected method
            selectedMethod.textContent =
                selectedPaymentMethod;


            // Enable Continue
            continueButton.disabled = false;

        }
    );

});


// ===============================
// CONTINUE BUTTON
// ===============================

continueButton.addEventListener(
    "click",
    function () {

        if (!selectedPaymentMethod) {
            return;
        }


        // QR PAYMENT
        if (
            selectedPaymentMethod ===
            "QR Verification"
        ) {

            openQR();

            return;
        }


        // DEMO SUCCESS
        showSuccess();

    }
);


// ===============================
// QR MODAL
// ===============================

const qrModal =
    document.getElementById("qrModal");

const closeQr =
    document.getElementById("closeQr");

const qrContainer =
    document.getElementById(
        "paymentQRCode"
    );


function openQR() {

    qrModal.classList.add("active");


    // Clear previous QR
    qrContainer.innerHTML = "";


    // Student information
    const name =
        student.fullname || "Student";

    const event =
        student.event || "College Event";


    // Build details URL
    const detailsURL =
        window.location.origin +
        "/payment-details.html?name=" +
        encodeURIComponent(name) +
        "&event=" +
        encodeURIComponent(event);


    // Generate QR
    if (
        typeof QRCode !==
        "undefined"
    ) {

        new QRCode(
            qrContainer,
            {
                text: detailsURL,
                width: 260,
                height: 260,
                correctLevel:
                    QRCode.CorrectLevel.M
            }
        );

    } else {

        qrContainer.textContent =
            "QR code could not be loaded.";

    }

}


// ===============================
// CLOSE QR
// ===============================

closeQr.addEventListener(
    "click",
    function () {

        qrModal.classList.remove(
            "active"
        );

    }
);


// Close when clicking outside
qrModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === qrModal
        ) {

            qrModal.classList.remove(
                "active"
            );

        }

    }
);


// ===============================
// SUCCESS
// ===============================

const successModal =
    document.getElementById(
        "successModal"
    );

const successStudent =
    document.getElementById(
        "successStudent"
    );

const successEvent =
    document.getElementById(
        "successEvent"
    );

const closeSuccess =
    document.getElementById(
        "closeSuccess"
    );


function showSuccess() {

    successStudent.textContent =
        student.fullname ||
        "Student";

    successEvent.textContent =
        student.event ||
        "College Event";

    successModal.classList.add(
        "active"
    );

}


// ===============================
// CLOSE SUCCESS
// ===============================

closeSuccess.addEventListener(
    "click",
    function () {

        successModal.classList.remove(
            "active"
        );

    }
);