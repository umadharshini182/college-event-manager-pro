// ==========================================
// COLLEGE EVENT MANAGER
// PAYMENT PAGE JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {


    // ==========================================
    // GET REGISTRATION DATA
    // ==========================================

    let student = null;

    const savedData =
        localStorage.getItem("studentData");


    if (savedData) {

        try {

            student = JSON.parse(savedData);

        } catch (error) {

            console.error(
                "Unable to read student data:",
                error
            );

        }

    }


    // Fallback

    if (!student) {

        student = {

            fullname:
                localStorage.getItem("fullname") || "",

            email:
                localStorage.getItem("email") || "",

            college:
                localStorage.getItem("college") || "",

            department:
                localStorage.getItem("department") || "",

            year:
                localStorage.getItem("year") || "",

            event:
                localStorage.getItem("event") || ""

        };

    }



    // ==========================================
    // STUDENT DETAILS
    // ==========================================

    const studentName =
        document.getElementById("studentName");

    const studentEmail =
        document.getElementById("studentEmail");

    const collegeName =
        document.getElementById("collegeName");

    const departmentName =
        document.getElementById("departmentName");

    const studentYear =
        document.getElementById("studentYear");

    const eventName =
        document.getElementById("eventName");


    if (studentName) {

        studentName.textContent =
            student.fullname || "Student";

    }


    if (studentEmail) {

        studentEmail.textContent =
            student.email || "Not available";

    }


    if (collegeName) {

        collegeName.textContent =
            student.college || "Not available";

    }


    if (departmentName) {

        departmentName.textContent =
            student.department || "Not available";

    }


    if (studentYear) {

        studentYear.textContent =
            student.year || "Not available";

    }


    if (eventName) {

        eventName.textContent =
            student.event || "College Event";

    }



    // ==========================================
    // PAYMENT OPTIONS
    // ==========================================

    const paymentOptions =
        document.querySelectorAll(
            ".payment-option, .bank-option"
        );


    const selectedMethod =
        document.getElementById(
            "selectedMethod"
        );


    const continueButton =
        document.getElementById(
            "continuePayment"
        );


    let selectedPaymentMethod = "";



    // ==========================================
    // SELECT PAYMENT METHOD
    // ==========================================

    paymentOptions.forEach(function (option) {

        option.addEventListener(
            "click",
            function () {


                // Remove previous selection

                paymentOptions.forEach(
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


                // Save method

                selectedPaymentMethod =
                    this.dataset.method || "";


                // Display selected method

                if (selectedMethod) {

                    selectedMethod.textContent =
                        selectedPaymentMethod ||
                        "No method selected";

                }


                // Enable button

                if (continueButton) {

                    continueButton.disabled =
                        false;

                    continueButton.removeAttribute(
                        "disabled"
                    );

                }

            }
        );

    });



    // ==========================================
    // QR BUTTON
    // ==========================================

    const scanQrButton =
        document.getElementById(
            "scanQrButton"
        );


    if (scanQrButton) {

        scanQrButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "qr-payment.html";

            }
        );

    }



    // ==========================================
    // CONTINUE PAYMENT
    // ==========================================

    if (continueButton) {

        continueButton.addEventListener(
            "click",
            function () {


                if (!selectedPaymentMethod) {

                    alert(
                        "Please select a payment method first."
                    );

                    return;

                }


                openPaymentAppScreen(
                    selectedPaymentMethod
                );

            }
        );

    }



    // ==========================================
    // PROCESSING ELEMENTS
    // ==========================================

    const processingOverlay =
        document.getElementById(
            "paymentProcessing"
        );


    const processingTitle =
        document.getElementById(
            "processingTitle"
        );


    const processingMessage =
        document.getElementById(
            "processingMessage"
        );


    const processingProgressBar =
        document.getElementById(
            "processingProgressBar"
        );


    const processingStep =
        document.getElementById(
            "processingStep"
        );



    // ==========================================
    // SUCCESS ELEMENTS
    // ==========================================

    const paymentSuccess =
        document.getElementById(
            "paymentSuccess"
        );


    const successMethod =
        document.getElementById(
            "successMethod"
        );


    const successEvent =
        document.getElementById(
            "successEvent"
        );


    const viewReceiptButton =
        document.getElementById(
            "viewReceiptButton"
        );



    // ==========================================
    // PAYMENT APP SCREEN
    // ==========================================

    function openPaymentAppScreen(method) {


        let appName = method;

        let appLetter = "UPI";

        let appClass = "demo-upi";


        if (method === "Google Pay") {

            appName = "Google Pay";

            appLetter = "G";

            appClass = "demo-gpay";

        }


        else if (method === "PhonePe") {

            appName = "PhonePe";

            appLetter = "P";

            appClass = "demo-phonepe";

        }


        else if (method === "Paytm") {

            appName = "Paytm";

            appLetter = "P";

            appClass = "demo-paytm";

        }


        else if (method === "Other UPI") {

            appName = "UPI Payment";

            appLetter = "UPI";

            appClass = "demo-upi";

        }


        else {

            appName = method;

            appLetter = "🏦";

            appClass = "demo-bank";

        }



        // ==========================================
        // CREATE SCREEN
        // ==========================================

        const overlay =
            document.createElement("div");


        overlay.className =
            "payment-app-overlay";


        overlay.innerHTML = `

            <div class="payment-app-card">


                <div class="payment-app-top">


                    <button
                        type="button"
                        class="payment-app-back"
                        id="paymentAppBack"
                    >
                        ←
                    </button>


                    <span>
                        Secure Checkout
                    </span>


                    <span class="top-spacer"></span>


                </div>



                <div class="payment-app-content">


                    <div
                        class="payment-app-logo ${appClass}"
                    >
                        ${appLetter}
                    </div>



                    <h2>
                        ${appName}
                    </h2>



                    <p class="payment-app-subtitle">
                        College Event Manager
                    </p>



                    <div class="payment-app-amount">

                        <span>
                            Amount to Pay
                        </span>

                        <strong>
                            ₹1,000
                        </strong>

                    </div>



                    <div class="payment-app-details">


                        <div>

                            <span>
                                Student
                            </span>

                            <strong>
                                ${student.fullname || "Student"}
                            </strong>

                        </div>



                        <div>

                            <span>
                                Event
                            </span>

                            <strong>
                                ${student.event || "College Event"}
                            </strong>

                        </div>



                        <div>

                            <span>
                                Registration Fee
                            </span>

                            <strong>
                                ₹1,000
                            </strong>

                        </div>


                    </div>



                    <div class="payment-app-demo">


                        <span class="demo-check">
                            ✓
                        </span>


                        <div>

                            <strong>
                                College Project Demo
                            </strong>

                            <p>
                                This is a demonstration payment.
                                No real money will be charged.
                            </p>

                        </div>


                    </div>



                    <button
                        type="button"
                        id="confirmAppPayment"
                        class="confirm-app-payment"
                    >

                        Continue with ${appName}

                        <span>
                            →
                        </span>

                    </button>



                    <p class="payment-app-security">

                        🔒 No PIN, OTP or bank password
                        is requested.

                    </p>


                </div>


            </div>

        `;


        document.body.appendChild(
            overlay
        );


        document.body.style.overflow =
            "hidden";



        // ==========================================
        // BACK
        // ==========================================

        const paymentAppBack =
            document.getElementById(
                "paymentAppBack"
            );


        if (paymentAppBack) {

            paymentAppBack.addEventListener(
                "click",
                function () {

                    overlay.remove();

                    document.body.style.overflow =
                        "";

                }
            );

        }



        // ==========================================
        // CONFIRM
        // ==========================================

        const confirmAppPayment =
            document.getElementById(
                "confirmAppPayment"
            );


        if (confirmAppPayment) {

            confirmAppPayment.addEventListener(
                "click",
                function () {


                    overlay.remove();


                    document.body.style.overflow =
                        "";


                    startPaymentProcess(
                        method
                    );

                }
            );

        }

    }



    // ==========================================
    // START PAYMENT PROCESS
    // ==========================================

    function startPaymentProcess(method) {


        student.paymentMethod =
            method;


        localStorage.setItem(
            "studentData",
            JSON.stringify(student)
        );


        if (processingOverlay) {

            processingOverlay.classList.add(
                "active"
            );

        }


        document.body.style.overflow =
            "hidden";



        // STEP 1

        updateProcessing(

            "Processing Payment",

            "Connecting securely to the payment service...",

            25,

            "Step 1 of 3"

        );



        // STEP 2

        setTimeout(
            function () {

                updateProcessing(

                    "Verifying Payment",

                    "Confirming your payment details...",

                    60,

                    "Step 2 of 3"

                );

            },
            1800
        );



        // STEP 3

        setTimeout(
            function () {

                updateProcessing(

                    "Finalizing Transaction",

                    "Please wait while we complete your registration...",

                    88,

                    "Step 3 of 3"

                );

            },
            3600
        );



        // COMPLETE

        setTimeout(
            function () {

                completePayment(
                    method
                );

            },
            5200
        );

    }



    // ==========================================
    // UPDATE PROCESSING
    // ==========================================

    function updateProcessing(
        title,
        message,
        progress,
        step
    ) {


        if (processingTitle) {

            processingTitle.textContent =
                title;

        }


        if (processingMessage) {

            processingMessage.textContent =
                message;

        }


        if (processingProgressBar) {

            processingProgressBar.style.width =
                progress + "%";

        }


        if (processingStep) {

            processingStep.textContent =
                step;

        }

    }



    // ==========================================
    // COMPLETE PAYMENT
    // ==========================================
     async function completePayment(method) {

    updateProcessing(
        "Saving Registration",
        "Saving your registration securely...",
        95,
        "Final Step"
    );

    try {

        student.paymentStatus = "Successful";
        student.paymentAmount = 1000;
        student.paymentMethod = method;
        student.paymentDate = new Date().toISOString();

        student.paymentId =
            "CEM" + Date.now().toString().slice(-8);


        const response = await fetch(
            "http://localhost:5000/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    fullname: student.fullname,
                    email: student.email,
                    college: student.college,
                    department: student.department,
                    year: student.year,
                    event: student.event
                })
            }
        );


        if (!response.ok) {
            throw new Error(
                "Backend error: " + response.status
            );
        }


        const result = await response.json();

        console.log(
            "BACKEND RESPONSE:",
            result
        );


        if (!result.success) {
            throw new Error(
                result.message ||
                "Registration failed"
            );
        }


        student.registrationId = result.id;


        localStorage.setItem(
            "studentData",
            JSON.stringify(student)
        );


        localStorage.setItem(
            "paymentReceipt",
            JSON.stringify({
                fullname: student.fullname,
                email: student.email,
                college: student.college,
                department: student.department,
                year: student.year,
                event: student.event,
                amount: 1000,
                paymentMethod: method,
                paymentStatus: "Successful",
                paymentDate: student.paymentDate,
                transactionId: student.paymentId,
                registrationId: student.registrationId
            })
        );


        updateProcessing(
            "Transaction Successful",
            "Your registration has been saved successfully.",
            100,
            "Completed"
        );


        setTimeout(function () {

            if (processingOverlay) {
                processingOverlay.classList.remove("active");
            }

            document.body.style.overflow = "";

            showSuccessScreen(method);

        }, 700);


    } catch (error) {

        console.error(
            "REGISTRATION SAVE ERROR:",
            error
        );

        if (processingOverlay) {
            processingOverlay.classList.remove("active");
        }

        document.body.style.overflow = "";

        alert(
            "Registration could not be saved. Make sure the backend server is running on port 5000."
        );

    }

}


    // ==========================================
    // SUCCESS SCREEN
    // ==========================================

    function showSuccessScreen(method) {


        student.paymentStatus =
            "Successful";


        student.paymentAmount =
            1000;


        student.paymentMethod =
            method;


        student.paymentDate =
            new Date().toLocaleString();


        localStorage.setItem(
            "studentData",
            JSON.stringify(student)
        );

        // Receipt

        const receiptData = {

            fullname:
                student.fullname || "Student",
           
            email:
                student.email || "",

            college:
                student.college || "",

            department:
                student.department || "",

            year:
                student.year || "",

            event:
                student.event || "College Event",

            amount:
                1000,

            paymentMethod:
                method,

            paymentStatus:
                "Successful",

            paymentDate:
                new Date().toLocaleString(),

            transactionId:
                generateTransactionId()

        };


        localStorage.setItem(
            "paymentReceipt",
            JSON.stringify(receiptData)
        );



        // Display success details

        if (successMethod) {

            successMethod.textContent =
                method;

        }


        if (successEvent) {

            successEvent.textContent =
                student.event ||
                "College Event";

        }


        if (paymentSuccess) {

            paymentSuccess.classList.add(
                "active"
            );

        }

    }



    // ==========================================
    // TRANSACTION ID
    // ==========================================

    function generateTransactionId() {

        const randomPart =

            Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase();


        return (

            "CEM" +

            Date.now()
                .toString()
                .slice(-8) +

            randomPart

        );

    }



    // ==========================================
    // VIEW RECEIPT
    // ==========================================

    if (viewReceiptButton) {

        viewReceiptButton.addEventListener(
            "click",
            function () {


                document.body.style.overflow =
                    "";


                window.location.href =
                    "receipt.html";

            }
        );

    }


});