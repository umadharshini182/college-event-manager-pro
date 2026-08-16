document.addEventListener("DOMContentLoaded", function () {

    let student = null;

    const savedData =
        localStorage.getItem("studentData");

    if (savedData) {
        try {
            student = JSON.parse(savedData);
        } catch (error) {
            console.error("Unable to read student data:", error);
        }
    }

    if (!student) {
        student = {
            fullname: localStorage.getItem("fullname") || "Student",
            email: localStorage.getItem("email") || "",
            college: localStorage.getItem("college") || "",
            department: localStorage.getItem("department") || "",
            year: localStorage.getItem("year") || "",
            event: localStorage.getItem("event") || "College Event"
        };
    }

    const studentName =
        document.getElementById("qrStudentName");

    if (studentName) {
        studentName.textContent =
            student.fullname || "Student";
    }

    const qrContainer =
        document.getElementById("registrationQRCode");

    if (!qrContainer) {
        return;
    }

    if (typeof QRCode === "undefined") {
        qrContainer.innerHTML = `
            <p style="
                color:#dc2626;
                font-size:12px;
                text-align:center;
            ">
                QR service could not be loaded.
                Please refresh the page.
            </p>
        `;

        return;
    }

    const detailsURL =
        new URL(
            "payment-details.html",
            window.location.href
        );

    detailsURL.searchParams.set(
        "name",
        student.fullname || "Student"
    );

    detailsURL.searchParams.set(
        "email",
        student.email || ""
    );

    detailsURL.searchParams.set(
        "college",
        student.college || ""
    );

    detailsURL.searchParams.set(
        "department",
        student.department || ""
    );

    detailsURL.searchParams.set(
        "year",
        student.year || ""
    );

    detailsURL.searchParams.set(
        "event",
        student.event || "College Event"
    );

    new QRCode(
        qrContainer,
        {
            text: detailsURL.toString(),
            width: 276,
            height: 276,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        }
    );

    console.log(
        "QR destination:",
        detailsURL.toString()
    );

});