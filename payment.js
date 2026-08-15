// =========================================================
// COLLEGE EVENT MANAGER
// PAYMENT.JS
// =========================================================
document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // STUDENT DATA
    // =====================================================
let student = null;

const savedData = localStorage.getItem("studentData");

if (savedData) {
    try {
        student = JSON.parse(savedData);
    } catch (error) {
        console.error("Student data error:", error);
    }
}

if (!student || !student.fullname || !student.event) {

    student = {
        fullname: localStorage.getItem("fullname"),
        email: localStorage.getItem("email"),
        college: localStorage.getItem("college"),
        department: localStorage.getItem("department"),
        year: localStorage.getItem("year"),
        event: localStorage.getItem("event")
    };
}

if (!student.fullname || !student.event) {
    alert("Student data not found. Please register again.");
    window.location.href = "register.html";
    return;
}
    // =====================================================
    // MAIN PAGE
    // =====================================================

    const studentName =
        document.getElementById("studentName");

    const eventName =
        document.getElementById("eventName");
     document.getElementById("studentName").textContent =
    student.fullname;

document.getElementById("eventName").textContent =
    student.event;


    // =====================================================
    // PAYMENT ELEMENTS
    // =====================================================

    const payButton =
        document.getElementById("demoPayBtn");

    const paymentModal =
        document.getElementById("paymentModal");

    const paymentOverlay =
        document.getElementById("paymentOverlay");

    const closePayment =
        document.getElementById("closePayment");

    const checkoutStudent =
        document.getElementById("checkoutStudent");

    const checkoutEvent =
        document.getElementById("checkoutEvent");

    const continuePayment =
        document.getElementById("continuePayment");

    const selectedMethod =
        document.getElementById("selectedMethod");

    const methodOptions =
        document.querySelectorAll(".method-option");


    // =====================================================
    // PAYMENT DETAILS SCREEN
    // =====================================================

    const paymentDetailsScreen =
        document.getElementById(
            "paymentDetailsScreen"
        );

    const backToMethods =
        document.getElementById(
            "backToMethods"
        );

    const detailsMethodTitle =
        document.getElementById(
            "detailsMethodTitle"
        );

    const detailsMethodName =
        document.getElementById(
            "detailsMethodName"
        );

    const detailsMethodDescription =
        document.getElementById(
            "detailsMethodDescription"
        );

    const detailsMethodIcon =
        document.getElementById(
            "detailsMethodIcon"
        );

    const upiDetails =
        document.getElementById(
            "upiDetails"
        );

    const bankDetails =
        document.getElementById(
            "bankDetails"
        );

    const cardDetails =
        document.getElementById(
            "cardDetails"
        );

    const detailsBankName =
        document.getElementById(
            "detailsBankName"
        );

    const startPaymentButton =
        document.getElementById(
            "startPaymentButton"
        );


    // =====================================================
    // SELECTED PAYMENT METHOD
    // =====================================================

    let selectedPaymentMethod = null;


    // =====================================================
    // OPEN PAYMENT CHECKOUT
    // =====================================================

    if (payButton) {

        payButton.addEventListener(
            "click",
            function () {

                if (checkoutStudent) {
                    checkoutStudent.textContent =
                        student.fullname || "-";
                }

                if (checkoutEvent) {
                    checkoutEvent.textContent =
                        student.event || "-";
                }

                paymentModal.classList.add(
                    "active"
                );

                document.body.style.overflow =
                    "hidden";
            }
        );

    }


    // =====================================================
    // CLOSE PAYMENT CHECKOUT
    // =====================================================

    function closeCheckout() {

        paymentModal.classList.remove(
            "active"
        );

        document.body.style.overflow = "";

    }


    if (closePayment) {

        closePayment.addEventListener(
            "click",
            closeCheckout
        );

    }


    if (paymentOverlay) {

        paymentOverlay.addEventListener(
            "click",
            closeCheckout
        );

    }


    // =====================================================
    // SELECT PAYMENT METHOD
    // =====================================================

    methodOptions.forEach(
        function (option) {

            option.addEventListener(
                "click",
                function () {

                    // Remove previous selection

                    methodOptions.forEach(
                        function (item) {

                            item.classList.remove(
                                "selected"
                            );

                        }
                    );


                    // Select current option

                    this.classList.add(
                        "selected"
                    );


                    // Save selected method

                    selectedPaymentMethod =
                        this.dataset.method;


                    // Display selected method

                    if (selectedMethod) {

                        selectedMethod.textContent =
                            selectedPaymentMethod;

                    }


                    // Enable continue button

                    if (continuePayment) {

                        continuePayment.disabled =
                            false;

                    }

                }
            );

        }
    );


    // =====================================================
    // CONTINUE TO PAYMENT DETAILS
    // =====================================================

    if (continuePayment) {

        continuePayment.addEventListener(
            "click",
            function () {

                if (!selectedPaymentMethod) {

                    alert(
                        "Please select a payment method."
                    );

                    return;

                }


                // Show payment details screen

                if (paymentDetailsScreen) {

                    paymentDetailsScreen.classList.add(
                        "active"
                    );

                }


                // Hide all information boxes

                if (upiDetails) {
                    upiDetails.classList.remove(
                        "active"
                    );
                }

                if (bankDetails) {
                    bankDetails.classList.remove(
                        "active"
                    );
                }

                if (cardDetails) {
                    cardDetails.classList.remove(
                        "active"
                    );
                }


                // =========================================
                // GOOGLE PAY
                // =========================================

                if (
                    selectedPaymentMethod ===
                    "Google Pay"
                ) {

                    detailsMethodIcon.textContent =
                        "G";

                    detailsMethodTitle.textContent =
                        "Google Pay";

                    detailsMethodName.textContent =
                        "Google Pay";

                    detailsMethodDescription.textContent =
                        "Continue securely with Google Pay.";

                    upiDetails.classList.add(
                        "active"
                    );

                }


                // =========================================
                // PHONEPE
                // =========================================

                else if (
                    selectedPaymentMethod ===
                    "PhonePe"
                ) {

                    detailsMethodIcon.textContent =
                        "P";

                    detailsMethodTitle.textContent =
                        "PhonePe";

                    detailsMethodName.textContent =
                        "PhonePe";

                    detailsMethodDescription.textContent =
                        "Continue securely with PhonePe.";

                    upiDetails.classList.add(
                        "active"
                    );

                }


                // =========================================
                // PAYTM
                // =========================================

                else if (
                    selectedPaymentMethod ===
                    "Paytm"
                ) {

                    detailsMethodIcon.textContent =
                        "P";

                    detailsMethodTitle.textContent =
                        "Paytm";

                    detailsMethodName.textContent =
                        "Paytm";

                    detailsMethodDescription.textContent =
                        "Continue securely with Paytm.";

                    upiDetails.classList.add(
                        "active"
                    );

                }


                // =========================================
                // OTHER UPI
                // =========================================

                else if (
                    selectedPaymentMethod ===
                    "Other UPI"
                ) {

                    detailsMethodIcon.textContent =
                        "UPI";

                    detailsMethodTitle.textContent =
                        "UPI Payment";

                    detailsMethodName.textContent =
                        "Other UPI";

                    detailsMethodDescription.textContent =
                        "Continue with your preferred UPI application.";

                    upiDetails.classList.add(
                        "active"
                    );

                }

// =========================================
// SCAN QR
// =========================================
else if (
    selectedPaymentMethod === "Scan QR"
) {

    detailsMethodIcon.textContent = "▦";

    detailsMethodTitle.textContent =
        "QR Payment";

    detailsMethodName.textContent =
        "Scan QR";

    detailsMethodDescription.textContent =
        "Scan the QR code using any UPI application.";

    upiDetails.classList.add("active");

    const qrPaymentBox =
        document.getElementById("qrPaymentBox");

    if (qrPaymentBox) {
        qrPaymentBox.classList.add("active");
    }

    const qrContainer =
        document.getElementById("paymentQRCode");

    if (qrContainer && typeof QRCode !== "undefined") {

        qrContainer.innerHTML = "";

        const studentName =
            student.fullname || "Student";

        const eventName =
            student.event || "College Event";

        const detailsURL =
            window.location.origin +
            "/payment-details.html?name=" +
            encodeURIComponent(studentName) +
            "&event=" +
            encodeURIComponent(eventName);

        new QRCode(qrContainer, {
            text: detailsURL,
            width: 210,
            height: 210
        });
    }
}

// =========================================
// CARD
// =========================================
else if (
    selectedPaymentMethod ===
    "Credit / Debit Card"
) {
 
// =========================================
// CARD
// =========================================
else if (
    selectedPaymentMethod ===
    "Credit / Debit Card"
){

                    detailsMethodIcon.textContent =
                        "💳";

                    detailsMethodTitle.textContent =
                        "Card Payment";

                    detailsMethodName.textContent =
                        "Credit / Debit Card";

                    detailsMethodDescription.textContent =
                        "Continue with secure card payment.";

                    cardDetails.classList.add(
                        "active"
                    );

                }


                // =========================================
                // NET BANKING
                // =========================================

                else {

                    detailsMethodIcon.textContent =
                        "🏦";

                    detailsMethodTitle.textContent =
                        "Net Banking";

                    detailsMethodName.textContent =
                        selectedPaymentMethod;

                    detailsMethodDescription.textContent =
                        "Continue securely with your selected bank.";

                    detailsBankName.textContent =
                        selectedPaymentMethod;

                    bankDetails.classList.add(
                        "active"
                    );

                }

            }
        );

    }


    // =====================================================
    // BACK TO PAYMENT METHODS
    // =====================================================

    if (backToMethods) {

        backToMethods.addEventListener(
            "click",
            function () {

                if (paymentDetailsScreen) {

                    paymentDetailsScreen.classList.remove(
                        "active"
                    );

                }

            }
        );

    }
// =====================================================
// PROCESSING + SUCCESS SCREEN
// =====================================================

const processingScreen =
    document.getElementById("processingScreen");

const processingIcon =
    document.getElementById("processingIcon");

const processingTitle =
    document.getElementById("processingTitle");

const processingMessage =
    document.getElementById("processingMessage");

const successScreen =
    document.getElementById("successScreen");

const successPaymentMethod =
    document.getElementById("successPaymentMethod");

const viewReceiptButton =
    document.getElementById("viewReceiptButton");


// =====================================================
// START PAYMENT
// =====================================================

if (startPaymentButton) {

    startPaymentButton.addEventListener(
        "click",
        function () {

            if (!selectedPaymentMethod) {

                alert(
                    "Please select a payment method."
                );

                return;

            }

            // Hide payment details

            if (paymentDetailsScreen) {

                paymentDetailsScreen.classList.remove(
                    "active"
                );

            }

            // Show processing screen

            if (processingScreen) {

                processingScreen.classList.add(
                    "active"
                );

            }

            processingIcon.textContent = "🔄";

            processingTitle.textContent =
                "Processing Payment";

            processingMessage.textContent =
                "Please wait while we securely process your payment.";


            // STEP 2

            setTimeout(function () {

                processingTitle.textContent =
                    "Verifying Payment";

                processingMessage.textContent =
                    "Verifying your selected payment method...";

            }, 1500);


            // STEP 3

            setTimeout(function () {

                processingTitle.textContent =
                    "Confirming Transaction";

                processingMessage.textContent =
                    "Almost done. Please wait...";

            }, 3000);


            // SUCCESS

            setTimeout(function () {

                if (processingScreen) {

                    processingScreen.classList.remove(
                        "active"
                    );

                }

                if (successScreen) {

                    successScreen.classList.add(
                        "active"
                    );

                }

                if (successPaymentMethod) {

                    successPaymentMethod.textContent =
                        selectedPaymentMethod;

                }

            }, 4500);

        }
    );

}
// =====================================================
// VIEW RECEIPT + SAVE REGISTRATION
// =====================================================
// =====================================================
// VIEW RECEIPT
// =====================================================

if (viewReceiptButton) {

    viewReceiptButton.addEventListener(
        "click",
        async function () {

            try {

                const student =
                    JSON.parse(
                        localStorage.getItem(
                            "studentData"
                        )
                    );

                if (!student) {

                    alert(
                        "Registration details not found."
                    );

                    return;
                }

                // Make sure registration exists
                if (!student.registrationId) {

                    const response =
                        await fetch(
                            "/register",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        student
                                    )
                            }
                        );


                    const result =
                        await response.json();


                    if (!result.success) {

                        alert(
                            result.message ||
                            "Registration failed."
                        );

                        return;
                    }


                    student.registrationId =
                        result.id;

                }


                // Create transaction ID
                if (!student.paymentId) {

                    student.paymentId =
                        "TXN-" +
                        Date.now();

                }


                // Save payment date
                student.paymentDate =
                    new Date().toISOString();


                // Save selected payment method
                student.paymentMethod =
                    selectedPaymentMethod ||
                    "Online Payment";


                // Save everything
                localStorage.setItem(
                    "studentData",
                    JSON.stringify(
                        student
                    )
                );


                // Go to receipt
                window.location.href =
                    "receipt.html";

            }

            catch (error) {

                console.error(
                    "Receipt preparation error:",
                    error
                );

                alert(
                    "Unable to generate receipt."
                );

            }

        }
    );

}
});
