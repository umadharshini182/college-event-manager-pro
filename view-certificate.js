function viewCertificate() {

    const email = document.getElementById("email").value.trim();

    if (email === "") {

        alert("Please enter your registered email.");

        return;

    }

    window.location.href =
        "certificate.html?email=" + encodeURIComponent(email);

}