// ==========================================
// COLLEGE EVENT MANAGER
// CUSTOM PAYMENT CHECKOUT
// ==========================================

alert("Payment JS Loaded");

const student =
    JSON.parse(localStorage.getItem("studentData"));


// ------------------------------------------
// CHECK STUDENT DATA
// ------------------------------------------

if (!student) {

    alert(
        "Student data not found. Please register again."
    );

    window.location.href = "register.html";

} else {

    document.getElementById("studentName").textContent =
        student.fullname || "-";

    document.getElementById("eventName").textContent =
        student.event || "-";
}


// ------------------------------------------
// ELEMENTS
// ------------------------------------------

const payButton =
    document.getElementById("demoPayBtn");

const paymentModal =
    document.getElementById("paymentModal");

const closePayment =
    document.getElementById("closePayment");

const checkoutStudent =
    document.getElementById("checkoutStudent");

const checkoutEvent =
    document.getElementById("checkoutEvent");

const selectedMethod =
    document.getElementById("selectedMethod");

const continuePayment =
    document.getElementById("continuePayment");


// ------------------------------------------
// OPEN CHECKOUT
// ------------------------------------------

payButton.addEventListener(
    "click",
    function () {

        checkoutStudent.textContent =
            student.fullname || "-";

        checkoutEvent.textContent =
            student.event || "-";

        paymentModal.classList.add("active");

        document.body.style.overflow = "hidden";
    }
);


// ------------------------------------------
// CLOSE CHECKOUT
// ------------------------------------------

closePayment.addEventListener(
    "click",
    closeCheckout
);


document
    .querySelector(".payment-overlay")
    .addEventListener(
        "click",
        closeCheckout
    );


function closeCheckout() {

    paymentModal.classList.remove("active");

    document.body.style.overflow = "";
}


// ------------------------------------------
// PAYMENT METHOD SELECTION
// ------------------------------------------

const paymentOptions =
    document.querySelectorAll(
        ".payment-option, .bank-option, .card-option"
    );


let selectedPaymentMethod = null;


paymentOptions.forEach(option => {

    option.addEventListener(
        "click",
        function () {

            // Remove previous selection
            paymentOptions.forEach(item => {

                item.classList.remove(
                    "selected"
                );

            });


            // Select current
            this.classList.add("selected");


            selectedPaymentMethod =
                this.dataset.method;


            selectedMethod.textContent =
                selectedPaymentMethod;


            continuePayment.disabled = false;

        }
    );

});


// ------------------------------------------
// CONTINUE PAYMENT
// ------------------------------------------

continuePayment.addEventListener(
    "click",
    function () {

        if (!selectedPaymentMethod) {

            return;
        }


        alert(
            `Selected payment method: ${selectedPaymentMethod}`
        );

    }
);