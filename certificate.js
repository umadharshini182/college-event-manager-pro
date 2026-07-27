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