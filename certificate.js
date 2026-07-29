const params = new URLSearchParams(window.location.search);

const email = params.get("email");

if (!email) {
    alert("Email not found.");
} else {

    fetch("/certificate/" + encodeURIComponent(email))
        .then(res => res.json())
        .then(data => {

            if (!data.success) {
                alert("Certificate not found.");
                return;
            }

            document.getElementById("studentName").textContent = data.fullname;
            document.getElementById("eventName").textContent = data.event;
            document.getElementById("certificateId").textContent =
                data.certificate_id || "Not Generated";
            const date = new Date(data.certificate_date);

document.getElementById("certificateDate").textContent =
date.toLocaleDateString("en-GB");
        })
        .catch(err => {
            console.error(err);
            alert("Unable to load certificate.");
        });

}
async function downloadCertificate() {

    const { jsPDF } = window.jspdf;

    const certificate = document.querySelector(".certificate");

    const canvas = await html2canvas(certificate, {
        scale: 2
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pageWidth,
        pageHeight
    );

    pdf.save("Certificate.pdf");

}