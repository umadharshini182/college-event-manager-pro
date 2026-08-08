// =========================================================
// COLLEGE EVENT MANAGER
// PAYMENT.JS
// PROFESSIONAL CUSTOM PAYMENT FLOW
// =========================================================


// =========================================================
// PAGE LOAD
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    // -----------------------------------------------------
    // GET STUDENT DATA
    // -----------------------------------------------------

    const student =
        JSON.parse(
            localStorage.getItem("studentData")
        );


    // -----------------------------------------------------
    // CHECK STUDENT DATA
    // -----------------------------------------------------

    if (!student) {

        alert(
            "Student data not found. Please register again."
        );

        window.location.href =
            "register.html";

        return;

    }


    // -----------------------------------------------------
    // MAIN PAGE DETAILS
    // -----------------------------------------------------

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
        document.querySelectorAll(
            ".method-option"
        );


    // =====================================================
    // CURRENT PAYMENT METHOD
    // =====================================================

    let selectedPaymentMethod = null;


    // =====================================================
    // OPEN CHECKOUT
    // =====================================================

    if (payButton) {

        payButton.addEventListener(
            "click",
            function () {

                // Put student information
                // inside checkout

                if (checkoutStudent) {

                    checkoutStudent.textContent =
                        student.fullname || "-";

                }


                if (checkoutEvent) {

                    checkoutEvent.textContent =
                        student.event || "-";

                }


                // Open modal

                paymentModal.classList.add(
                    "active"
                );


                // Prevent background scrolling

                document.body.style.overflow =
                    "hidden";

            }
        );

    }


    // =====================================================
    // CLOSE CHECKOUT
    // =====================================================

    function closeCheckout() {

        paymentModal.classList.remove(
            "active"
        );


        document.body.style.overflow =
            "";

    }


    // Close button

    if (closePayment) {

        closePayment.addEventListener(
            "click",
            closeCheckout
        );

    }


    // Click outside checkout

    if (paymentOverlay) {

        paymentOverlay.addEventListener(
            "click",
            closeCheckout
        );

    }


    // =====================================================
    // PAYMENT METHOD SELECTION
    // =====================================================

    methodOptions.forEach(
        function (option) {

            option.addEventListener(
                "click",
                function () {


                    // -------------------------------------
                    // REMOVE OLD SELECTION
                    // -------------------------------------

                    methodOptions.forEach(
                        function (item) {

                            item.classList.remove(
                                "selected"
                            );

                        }
                    );


                    // -------------------------------------
                    // SELECT CURRENT METHOD
                    // -------------------------------------

                    this.classList.add(
                        "selected"
                    );


                    // -------------------------------------
                    // SAVE METHOD
                    // -------------------------------------

                    selectedPaymentMethod =
                        this.dataset.method;


                    // -------------------------------------
                    // DISPLAY SELECTED METHOD
                    // -------------------------------------

                    if (selectedMethod) {

                        selectedMethod.textContent =
                            selectedPaymentMethod;

                    }


                    // -------------------------------------
                    // ENABLE CONTINUE BUTTON
                    // -------------------------------------

                    if (continuePayment) {

                        continuePayment.disabled =
                            false;

                    }

                }
            );

        }
    );

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
// OPEN PAYMENT DETAILS
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


            // Show details screen

            paymentDetailsScreen.classList.add(
                "active"
            );


            // Hide all information boxes

            upiDetails.classList.remove(
                "active"
            );

            bankDetails.classList.remove(
                "active"
            );

            cardDetails.classList.remove(
                "active"
            );


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
            // QR
            // =========================================

            else if (
                selectedPaymentMethod ===
                "Scan QR"
            ) {

                detailsMethodIcon.textContent =
                    "▦";

                detailsMethodTitle.textContent =
                    "QR Payment";

                detailsMethodName.textContent =
                    "Scan QR";

                detailsMethodDescription.textContent =
                    "Scan the QR code using your UPI application.";

                upiDetails.classList.add(
                    "active"
                );

            }


            // =========================================
            // CARD
            // =========================================

            else if (
                selectedPaymentMethod ===
                "Credit / Debit Card"
            ) {

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
// BACK TO METHODS
// =====================================================

if (backToMethods) {

    backToMethods.addEventListener(
        "click",
        function () {

            paymentDetailsScreen.classList.remove(
                "active"
            );

        }
    );

}
});