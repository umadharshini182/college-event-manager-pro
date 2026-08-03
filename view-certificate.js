async function viewCertificate() {

    const email = document.getElementById("email").value.trim();

    if (email === "") {
        alert("Please enter your registered email.");
        return;
    }

    try {

        const response = await fetch("/certificate/" + encodeURIComponent(email));

        const data = await response.json();

        if (!data.success) {
            alert(data.message);
            return;
        }

        localStorage.setItem("studentName", data.student.fullname);
        localStorage.setItem("eventName", data.student.event);
        localStorage.setItem("certificateId", data.student.certificate_id);
        localStorage.setItem("certificateDate", data.student.certificate_date);

        window.location.href = "certificate.html";

    } catch (error) {

        alert("Unable to connect to the server.");

        console.error(error);

    }

}