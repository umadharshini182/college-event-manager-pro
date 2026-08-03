// ===============================
// GET STUDENT DETAILS
// ===============================

const studentName =
    localStorage.getItem("studentName") ||
    "Student Name";

const eventName =
    localStorage.getItem("eventName") ||
    "Hackathon";


// ===============================
// DISPLAY STUDENT DETAILS
// ===============================

document.getElementById("studentName").textContent =
    studentName;

document.getElementById("eventName").textContent =
    eventName;

// ===============================
// CERTIFICATE DATE
// ===============================
const rawDate = localStorage.getItem("certificateDate");

let formattedDate = "";

if (rawDate) {

    const date = new Date(rawDate);

    formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

}

document.getElementById("certificateDate").textContent =
    formattedDate;


// ===============================
// CERTIFICATE ID
// ===============================

let certificateId =
    localStorage.getItem("certificateId");

if (!certificateId) {
certificateId =
    "CEM-" +
    new Date().getFullYear() +
    "-" +
    Math.floor(100000 + Math.random() * 900000);

}

document.getElementById("certificateId").textContent =
    certificateId;


// ===============================
// QR CODE
// ===============================
const verifyLink =
"https://college-event-manager-pro.onrender.com/verify.html?certificate=" +
certificateId;

const qrContainer = document.getElementById("qrCode");

qrContainer.innerHTML = "";

new QRCode(qrContainer, {
    text: verifyLink,
    width: 120,
    height: 120
});
// ===============================
// DOWNLOAD CERTIFICATE AS PDF
// ===============================

async function downloadCertificate() {

    const certificate =
        document.getElementById("certificate");

    const button =
        document.querySelector(".download-btn");

    // Hide button before capturing
    button.style.display = "none";

    try {

        const canvas = await html2canvas(certificate, {

            scale: 3,

            useCORS: true,

            backgroundColor: "#ffffff"

        });

        const imageData =
            canvas.toDataURL("image/png");

        const { jsPDF } = window.jspdf;

        const pdf =
            new jsPDF({

                orientation: "landscape",

                unit: "mm",

                format: "a4"

            });

        const pageWidth =
            pdf.internal.pageSize.getWidth();

        const pageHeight =
            pdf.internal.pageSize.getHeight();

        pdf.addImage(

            imageData,

            "PNG",

            0,

            0,

            pageWidth,

            pageHeight

        );

        const student =
            document.getElementById("studentName")
                .textContent
                .trim()
                .replace(/\s+/g, "_");

        const event =
            document.getElementById("eventName")
                .textContent
                .trim()
                .replace(/\s+/g, "_");

        pdf.save(
            `${student}_${event}_Certificate.pdf`
        );

    } catch (error) {

        console.error(error);

        alert("Unable to download certificate.");

    }

    // Show button again
    button.style.display = "inline-block";

}