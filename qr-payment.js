document.addEventListener("DOMContentLoaded", function () {

    // Get registration data
    let student = null;

    const savedData =
        localStorage.getItem("studentData");

    if (savedData) {
        try {
            student = JSON.parse(savedData);
        } catch (error) {
            console.error("Could not read student data:", error);
        }
    }

    // Fallback
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


    // Show student name
    const studentName =
        document.getElementById("qrStudentName");

    if (studentName) {
        studentName.textContent =
            student.fullname || "Student";
    }


    // QR container
    const qrContainer =
        document.getElementById("registrationQRCode");

    if (!qrContainer) {
        return;
    }


    // Build the page that should open after scanning
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


    // Create QR image
    const qrImage =
        document.createElement("img");

    qrImage.alt =
        "Registration Verification QR Code";

    qrImage.className =
        "real-qr-image";


    qrImage.src =
        "https://api.qrserver.com/v1/create-qr-code/" +
        "?size=500x500" +
        "&margin=15" +
        "&data=" +
        encodeURIComponent(
            detailsURL.toString()
        );


    // Add image
    qrContainer.innerHTML = "";

    qrContainer.appendChild(qrImage);


    // Error handling
    qrImage.onerror = function () {

        qrContainer.innerHTML = `
            <div class="qr-error">
                <strong>QR could not be loaded</strong>
                <span>Please refresh the page.</span>
            </div>
        `;

    };


    console.log(
        "QR destination:",
        detailsURL.toString()
    );

});