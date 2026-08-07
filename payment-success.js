// ==========================================
// PAYMENT SUCCESS RECEIPT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const student = JSON.parse(
        localStorage.getItem("studentData")
    );

    if (!student) {
        alert("Registration details not found.");
        return;
    }

    // -------------------------------
    // STUDENT INFORMATION
    // -------------------------------

    document.getElementById("studentName").textContent =
        student.fullname || "—";

    document.getElementById("studentEmail").textContent =
        student.email || "—";

    document.getElementById("college").textContent =
        student.college || "—";

    document.getElementById("department").textContent =
        student.department || "—";

    document.getElementById("year").textContent =
        student.year || "—";

    document.getElementById("event").textContent =
        student.event || "—";


    // -------------------------------
    // PAYMENT INFORMATION
    // -------------------------------

    document.getElementById("registrationId").textContent =
        student.registrationId || "—";

    document.getElementById("transactionId").textContent =
        student.paymentId || "—";


    // -------------------------------
    // RECEIPT NUMBER
    // -------------------------------

    const receiptNumber =
        "REC-" +
        new Date().getFullYear() +
        "-" +
        String(
            student.registrationId || Math.floor(Math.random() * 999999)
        ).padStart(6, "0");

    document.getElementById("receiptId").textContent =
        receiptNumber;


    // -------------------------------
    // PAYMENT DATE
    // -------------------------------

    const today = new Date();

    document.getElementById("paymentDate").textContent =
        today.toLocaleDateString("en-GB");


    // -------------------------------
    // QR CODE
    // -------------------------------

    const verifyURL =
        window.location.origin +
        "/receipt.html?id=" +
        encodeURIComponent(
            student.registrationId || ""
        );

    document.getElementById("qrCode").src =
        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" +
        encodeURIComponent(verifyURL);

});


// ==========================================
// DOWNLOAD RECEIPT
// ==========================================

async function downloadReceipt() {

    const { jsPDF } = window.jspdf;

    const receipt =
        document.querySelector(".receipt-container");

    if (!receipt) {
        alert("Receipt not found.");
        return;
    }

    const canvas = await html2canvas(receipt, {
        scale: 2,
        useCORS: true
    });

    const image =
        canvas.toDataURL("image/png");

    const pdf =
        new jsPDF("portrait", "mm", "a4");

    const pageWidth =
        pdf.internal.pageSize.getWidth();

    const pageHeight =
        pdf.internal.pageSize.getHeight();

    const margin = 10;

    const width =
        pageWidth - margin * 2;

    const height =
        canvas.height * width / canvas.width;

    const finalHeight =
        Math.min(height, pageHeight - margin * 2);

    pdf.addImage(
        image,
        "PNG",
        margin,
        margin,
        width,
        finalHeight
    );

    pdf.save("Payment-Receipt.pdf");
}