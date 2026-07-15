// ======================================================
// COLLEGE EVENT MANAGER
// CERTIFICATES.JS
// ======================================================

let certificates = [];

// ======================================================
// PAGE LOAD
// ======================================================

window.addEventListener("load", () => {

    checkLogin();

    initializeSidebar();

});

// ======================================================
// LOGIN CHECK
// ======================================================

async function checkLogin() {

    try {

        const response = await fetch("/api/current-user", {

            credentials: "include"

        });

        const data = await response.json();

        if (!data.loggedIn) {

            window.location.href = "admin-login.html";

            return;

        }

        loadCertificates();

    }

    catch (err) {

        console.log(err);

        window.location.href = "admin-login.html";

    }

}

// ======================================================
// LOAD CERTIFICATES
// ======================================================

async function loadCertificates() {

    try {

        const response = await fetch("/students", {

            credentials: "include"

        });

        certificates = await response.json();

        updateCertificateSummary();

        loadCertificateTable();

    }

    catch (err) {

        console.log(err);

    }

}
// ======================================================
// CERTIFICATE SUMMARY
// ======================================================

function updateCertificateSummary(){

    // Generated Certificates

    const generated =
    certificates.filter(
        c=>c.certificate_id
    ).length;

    document.getElementById("totalCertificates").innerText =
    generated;

    document.getElementById("generatedCertificates").innerText =
    generated;

    // Downloads (Demo)

    document.getElementById("downloadedCertificates").innerText =
    generated;

    // Emails (Demo)

    document.getElementById("emailedCertificates").innerText =
    0;

    document.getElementById("todayCertificates").innerText =
    generated;

    document.getElementById("downloadCount").innerText =
    generated;

    document.getElementById("emailCount").innerText =
    0;

    document.getElementById("pendingCertificates").innerText =
    certificates.length - generated;

}

// ======================================================
// CERTIFICATE TABLE
// ======================================================

function loadCertificateTable(){

    const tbody =
    document.getElementById("certificateTable");

    tbody.innerHTML="";

    certificates.forEach(student=>{

        tbody.innerHTML += `

<tr>

<td>${student.id}</td>

<td>${student.fullname}</td>

<td>${student.email}</td>

<td>${student.college}</td>

<td>${student.event}</td>

<td>

${student.certificate_id || "-"}

</td>

<td>

<span class="${
student.certificate_id
?
"paid"
:
"pending"
}">

${
student.certificate_id
?
"Generated"
:
"Pending"
}

</span>

</td>

<td>

<button
class="action-btn present-btn"
onclick="previewCertificate(${student.id})">

Preview

</button>

<button
class="action-btn certificate-btn"
onclick="downloadCertificate(${student.id})">

Download

</button>

<button
class="action-btn blue"
onclick="emailCertificate(${student.id})">

Email

</button>

</td>

</tr>

`;

    });

}

// ======================================================
// SEARCH CERTIFICATES
// ======================================================

const certificateSearch =
document.getElementById("certificateSearch");

if(certificateSearch){

certificateSearch.onkeyup=function(){

const value =
this.value.toLowerCase();

const rows =
document.querySelectorAll(
"#certificateTable tr"
);

rows.forEach(row=>{

if(

row.innerText
.toLowerCase()
.includes(value)

){

row.style.display="";

}

else{

row.style.display="none";

}

});

};

}
// ======================================================
// PREVIEW CERTIFICATE
// ======================================================
function previewCertificate(id){

    window.location.href =
    "/certificate/" + id;

}



// ======================================================
// DOWNLOAD CERTIFICATE
// ======================================================

async function downloadCertificate(id){

    try{

        const response = await fetch("/certificate/" + id,{

            credentials:"include"

        });

        const data = await response.json();

        if(!data.id){

            alert("Certificate not available.");

            return;

        }

        alert(
            "Certificate Ready\n\n"+
            "Name : "+data.fullname+"\n"+
            "Event : "+data.event+"\n"+
            "Certificate ID : "+data.certificate_id
        );

    }

    catch(err){

        console.log(err);

        alert("Unable to load certificate.");

    }

}

// ======================================================
// EMAIL CERTIFICATE
// ======================================================

function emailCertificate(id){

    alert(
        "Email feature will be connected with Nodemailer."
    );

}

// ======================================================
// SIDEBAR
// ======================================================

function initializeSidebar(){

    const sidebar =
    document.getElementById("sidebar");

    const menuBtn =
    document.getElementById("menuBtn");

    const closeBtn =
    document.getElementById("closeSidebar");

    const overlay =
    document.getElementById("overlay");

    if(menuBtn){

        menuBtn.onclick=()=>{

            sidebar.classList.add("active");

            overlay.classList.add("show");

        };

    }

    if(closeBtn){

        closeBtn.onclick=()=>{

            sidebar.classList.remove("active");

            overlay.classList.remove("show");

        };

    }

    if(overlay){

        overlay.onclick=()=>{

            sidebar.classList.remove("active");

            overlay.classList.remove("show");

        };

    }

}

// ======================================================
// LOGOUT
// ======================================================

function logout(){

    if(!confirm("Logout from Admin Dashboard?")){

        return;

    }

    fetch("/logout",{

        credentials:"include"

    })

    .then(()=>{

        window.location.href="admin-login.html";

    });

}

// ======================================================
// AUTO REFRESH
// ======================================================

setInterval(()=>{

    loadCertificates();

},30000);

// ======================================================
// END OF CERTIFICATES.JS
// ======================================================