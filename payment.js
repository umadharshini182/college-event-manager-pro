// ==========================================
// COLLEGE EVENT MANAGER
// PROFESSIONAL PAYMENT PAGE
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // GET STUDENT DATA
    // ==========================================

    let student = null;

    const savedData =
        localStorage.getItem("studentData");

    if (savedData) {
        try {
            student = JSON.parse(savedData);
        } catch (error) {
            console.error(
                "Student data error:",
                error
            );
        }
    }


    // Fallback for older saved data
    if (!student) {
        student = {
            fullname:
                localStorage.getItem("fullname"),

            email:
                localStorage.getItem("email"),

            college:
                localStorage.getItem("college"),

            department:
                localStorage.getItem("department"),

            year:
                localStorage.getItem("year"),

            event:
                localStorage.getItem("event")
        };
    }


    // ==========================================
    // CHECK STUDENT DATA
    // ==========================================

    if (!student.fullname || !student.event) {

        console.warn(
            "Student registration data not found."
        );

        // Don't immediately redirect during testing.
        student = {
            fullname: student.fullname || "Student",
            email: student.email || "",
            college: student.college || "College",
            department: student.department || "",
            year: student.year || "",
            event: student.event || "College Event"
        };
    }


    // ==========================================
    // DISPLAY STUDENT DETAILS
    // ==========================================

    const studentName =
        document.getElementById("studentName");

    const collegeName =
        document.getElementById("collegeName");

    const eventName =
        document.getElementById("eventName");

    const studentYear =
        document.getElementById("studentYear");


    if (studentName) {
        studentName.textContent =
            student.fullname || "Student";
    }

    if (collegeName) {
        collegeName.textContent =
            student.college || "College";
    }

    if (eventName) {
        eventName.textContent =
            student.event || "College Event";
    }

    if (studentYear) {
        studentYear.textContent =
            student.year || "Not specified";
    }


    // ==========================================
    // PAYMENT OPTIONS
    // ==========================================

    const methodButtons =
        document.querySelectorAll(
            ".method-button, .qr-button, .bank-button"
        );

    const selectedMethod =
        document.getElementById(
            "selectedMethod"
        );

    const continueButton =
        document.getElementById(
            "continueButton"
        );


    let selectedPaymentMethod = "";


    // ==========================================
    // SELECT PAYMENT METHOD
    // ==========================================

    methodButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                // Remove previous selection
                methodButtons.forEach(
                    function (item) {
                        item.classList.remove(
                            "selected"
                        );
                    }
                );


                // Select clicked method
                this.classList.add(
                    "selected"
                );


                // Store method
                selectedPaymentMethod =
                    this.dataset.method;


                // Show selected method
                if (selectedMethod) {
                    selectedMethod.textContent =
                        selectedPaymentMethod;
                }


                // Enable continue button
                if (continueButton) {
                    continueButton.disabled =
                        false;
                }

            }
        );

    });


    // ==========================================
    // CONTINUE BUTTON
    // ==========================================

    if (continueButton) {

        continueButton.addEventListener(
            "click",
            function () {

                if (!selectedPaymentMethod) {
                    return;
                }


                // Save selected payment method
                student.paymentMethod =
                    selectedPaymentMethod;

                localStorage.setItem(
                    "studentData",
                    JSON.stringify(student)
                );


                // ==================================
                // QR
                // ==================================

                if (
                    selectedPaymentMethod ===
                    "QR Verification"
                ) {

                    openQR();

                    return;
                }


                // ==================================
                // OTHER METHODS
                // ==================================

                showDemoMessage(
                    selectedPaymentMethod
                );

            }
        );

    }


    // ==========================================
    // QR MODAL
    // ==========================================

    const qrModal =
        document.getElementById(
            "qrModal"
        );

    const closeQr =
        document.getElementById(
            "closeQr"
        );

    const qrContainer =
        document.getElementById(
            "paymentQRCode"
        );


    function openQR() {

        if (!qrModal || !qrContainer) {
            return;
        }


        // Open modal
        qrModal.classList.add(
            "active"
        );


        // Prevent background scrolling
        document.body.style.overflow =
            "hidden";


        // Clear old QR
        qrContainer.innerHTML = "";


        // ==================================
        // CREATE DETAILS URL
        // ==================================

        const detailsURL =
            window.location.origin +
            window.location.pathname
                .replace(
                    "payment.html",
                    "payment-details.html"
                ) +
            "?name=" +
            encodeURIComponent(
                student.fullname || "Student"
            ) +
            "&email=" +
            encodeURIComponent(
                student.email || ""
            ) +
            "&college=" +
            encodeURIComponent(
                student.college || ""
            ) +
            "&department=" +
            encodeURIComponent(
                student.department || ""
            ) +
            "&year=" +
            encodeURIComponent(
                student.year || ""
            ) +
            "&event=" +
            encodeURIComponent(
                student.event || "College Event"
            );


        // ==================================
        // GENERATE QR
        // ==================================

        if (
            typeof QRCode ===
            "undefined"
        ) {

            qrContainer.innerHTML =
                "<p style='color:#dc2626;text-align:center;'>QR library could not be loaded.</p>";

            return;
        }


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

    }


    // ==========================================
    // CLOSE QR
    // ==========================================

    if (closeQr) {

        closeQr.addEventListener(
            "click",
            closeQR
        );

    }


    function closeQR() {

        if (qrModal) {

            qrModal.classList.remove(
                "active"
            );

        }

        document.body.style.overflow =
            "";

    }


    // Close QR by clicking outside
    if (qrModal) {

        qrModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === qrModal
                ) {

                    closeQR();

                }

            }
        );

    }


    // ==========================================
    // ESCAPE KEY
    // ==========================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeQR();

            }

        }
    );


    // ==========================================
    // DEMO PAYMENT MESSAGE
    // ==========================================

    function showDemoMessage(method) {

        // Remove existing message
        const oldMessage =
            document.getElementById(
                "demoPaymentMessage"
            );

        if (oldMessage) {
            oldMessage.remove();
        }


        // Create overlay
        const overlay =
            document.createElement(
                "div"
            );

        overlay.id =
            "demoPaymentMessage";

        overlay.style.position =
            "fixed";

        overlay.style.inset =
            "0";

        overlay.style.background =
            "rgba(15,23,42,0.72)";

        overlay.style.display =
            "flex";

        overlay.style.alignItems =
            "center";

        overlay.style.justifyContent =
            "center";

        overlay.style.padding =
            "20px";

        overlay.style.zIndex =
            "10000";


        // Create box
        const box =
            document.createElement(
                "div"
            );

        box.style.width =
            "100%";

        box.style.maxWidth =
            "430px";

        box.style.padding =
            "30px";

        box.style.background =
            "#ffffff";

        box.style.borderRadius =
            "22px";

        box.style.textAlign =
            "center";

        box.style.boxShadow =
            "0 25px 70px rgba(0,0,0,.25)";


        box.innerHTML = `

            <div style="
                width:58px;
                height:58px;
                margin:0 auto 16px;
                border-radius:50%;
                background:#eff6ff;
                color:#2563eb;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:26px;
            ">
                ✓
            </div>

            <h2 style="
                margin:0 0 10px;
                color:#172033;
                font-size:22px;
            ">
                ${method}
            </h2>

            <p style="
                margin:0 0 8px;
                color:#475569;
                font-size:14px;
                line-height:1.6;
            ">
                This payment option is being
                demonstrated as part of the
                college project.
            </p>

            <p style="
                margin:0 0 22px;
                color:#64748b;
                font-size:12px;
                line-height:1.5;
            ">
                No real payment, UPI PIN,
                OTP or bank password is requested.
            </p>

            <button
                id="closeDemoMessage"
                style="
                    width:100%;
                    padding:14px;
                    border:0;
                    border-radius:12px;
                    background:#2563eb;
                    color:white;
                    font-size:14px;
                    font-weight:700;
                    cursor:pointer;
                "
            >
                Back to Payment
            </button>

        `;


        overlay.appendChild(box);

        document.body.appendChild(
            overlay
        );


        // Close button
        document
            .getElementById(
                "closeDemoMessage"
            )
            .addEventListener(
                "click",
                function () {

                    overlay.remove();

                }
            );


        // Click outside
        overlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === overlay
                ) {

                    overlay.remove();

                }

            }
        );

    }

});