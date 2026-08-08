// ======================================================
// RECEIPT PAGE
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    const student =
        JSON.parse(
            localStorage.getItem("studentData")
        );

    // ------------------------------------------
    // CHECK STUDENT DATA
    // ------------------------------------------

    if (!student) {

        alert("Registration details not found.");

        return;
    }

    console.log("RECEIPT STUDENT DATA:", student);


    // ------------------------------------------
    // STUDENT DETAILS
    // ------------------------------------------

    const studentName =
        document.getElementById("studentName");

    const studentEmail =
        document.getElementById("studentEmail");

    const college =
        document.getElementById("college");

    const department =
        document.getElementById("department");

    const year =
        document.getElementById("year");

    const event =
        document.getElementById("event");


    if (studentName) {
        studentName.textContent =
            student.fullname || "—";
    }

    if (studentEmail) {
        studentEmail.textContent =
            student.email || "—";
    }

    if (college) {
        college.textContent =
            student.college || "—";
    }

    if (department) {
        department.textContent =
            student.department || "—";
    }

    if (year) {
        year.textContent =
            student.year || "—";
    }

    if (event) {
        event.textContent =
            student.event || "—";
    }


    // ------------------------------------------
    // REGISTRATION ID
    // ------------------------------------------

    const registrationId =
        document.getElementById("registrationId");

    if (registrationId) {

        registrationId.textContent =
            student.registrationId || "—";

    }


    // ------------------------------------------
    // TRANSACTION ID
    // ------------------------------------------

    const transactionId =
        document.getElementById("transactionId");

    if (transactionId) {

        transactionId.textContent =
            student.paymentId || "—";

    }


    // ------------------------------------------
    // RECEIPT NUMBER
    // ------------------------------------------

    const receiptNumber =
        "REC-" +
        new Date().getFullYear() +
        "-" +
        String(
            student.registrationId ||
            Math.floor(
                Math.random() * 999999
            )
        ).padStart(6, "0");


    const receiptId =
        document.getElementById("receiptId");

    if (receiptId) {

        receiptId.textContent =
            receiptNumber;

    }


    // ------------------------------------------
    // PAYMENT DATE
    // ------------------------------------------

    const paymentDate =
        document.getElementById("paymentDate");

    if (paymentDate) {

        const savedDate =
            student.paymentDate;

        const date =
            savedDate
                ? new Date(savedDate)
                : new Date();

        paymentDate.textContent =
            date.toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });

    }


    // ------------------------------------------
    // QR CODE
    // ------------------------------------------

    const qrCode =
        document.getElementById("qrCode");

    if (qrCode) {
          const verificationURL =
    window.location.origin +
    "/payment-verification.html?id=" +
    encodeURIComponent(
        student.registrationId || ""
    );


        qrCode.src =
            "https://api.qrserver.com/v1/create-qr-code/" +
            "?size=180x180" +
            "&margin=10" +
            "&data=" +
            encodeURIComponent(
                verificationURL
            );


        qrCode.onerror =
            function () {

                console.log(
                    "QR code could not be loaded."
                );

            };

    }

});


// ======================================================
// DOWNLOAD RECEIPT
// ======================================================

async function downloadReceipt() {

    const receipt =
        document.querySelector(".receipt-box");

    if (!receipt) {

        alert("Receipt not found.");

        return;
    }


    if (
        typeof html2canvas === "undefined" ||
        typeof window.jspdf === "undefined"
    ) {

        window.print();

        return;
    }


    try {

        const canvas =
            await html2canvas(
                receipt,
                {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: "#ffffff"
                }
            );


        const image =
            canvas.toDataURL("image/png");


        const {
            jsPDF
        } = window.jspdf;


        const pdf =
            new jsPDF(
                "portrait",
                "mm",
                "a4"
            );


        const pageWidth =
            pdf.internal.pageSize.getWidth();

        const pageHeight =
            pdf.internal.pageSize.getHeight();


        const margin = 10;

        const width =
            pageWidth - margin * 2;


        const height =
            canvas.height *
            width /
            canvas.width;


        const finalHeight =
            Math.min(
                height,
                pageHeight - margin * 2
            );


        pdf.addImage(
            image,
            "PNG",
            margin,
            margin,
            width,
            finalHeight
        );


        pdf.save(
            "College-Event-Payment-Receipt.pdf"
        );

    }

    catch (error) {

        console.error(
            "Receipt download error:",
            error
        );

        window.print();

    }

}