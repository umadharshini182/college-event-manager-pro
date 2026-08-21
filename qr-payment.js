document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // GET STUDENT DATA
    // ==========================================

    const studentData = JSON.parse(
        localStorage.getItem("studentData")
    );


    // ==========================================
    // CHECK REGISTRATION DATA
    // ==========================================

    if (!studentData) {

        alert("Registration data not found. Please register again.");

        window.location.href = "register.html";

        return;

    }


    // ==========================================
    // SHOW STUDENT DETAILS
    // ==========================================

    document.getElementById("qrStudentName").textContent =
        studentData.fullname || "-";


    document.getElementById("qrEventName").textContent =
        studentData.event || "-";


    document.getElementById("qrCollegeName").textContent =
        studentData.college || "-";


    // ==========================================
    // QR PAYMENT COMPLETED
    // ==========================================

    const qrPayButton =
        document.getElementById("qrPayButton");


    qrPayButton.addEventListener(
        "click",
        function () {


            // Create transaction ID

            const transactionId =
                "QR" + Date.now();


            // Save transaction ID

            localStorage.setItem(
                "transactionId",
                transactionId
            );


            // Create receipt data

            const receiptData = {

                fullname:
                    studentData.fullname,

                email:
                    studentData.email,

                college:
                    studentData.college,

                department:
                    studentData.department,

                year:
                    studentData.year,

                event:
                    studentData.event,

                paymentMethod:
                    "QR / UPI Payment",

                amount:
                    1000,

                transactionId:
                    transactionId,

                paymentStatus:
                    "Paid",

                paymentDate:
                    new Date().toLocaleString("en-IN")

            };


            // Save receipt data

            localStorage.setItem(
                "receiptData",
                JSON.stringify(receiptData)
            );


            // Change button text

            qrPayButton.textContent =
                "Payment Confirmed ✓";


            qrPayButton.disabled = true;


            // Go to receipt

            setTimeout(function () {

                window.location.href =
                    "receipt.html";

            }, 1200);


        }
    );

});