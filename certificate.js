const params = new URLSearchParams(window.location.search);

const email = params.get("email");

async function loadCertificate(){

try{

const response = await fetch("/certificate/" + encodeURIComponent(email));

const data = await response.json();

if(!data.success){

alert("Certificate not found.");

window.location.href="view-certificate.html";

return;

}

document.getElementById("studentName").innerHTML=data.fullname;

document.getElementById("eventName").innerHTML=data.event;

document.getElementById("certificateId").innerHTML=data.certificate_id;

document.getElementById("certificateDate").innerHTML=data.certificate_date;

}

catch(err){

console.log(err);

alert("Unable to load certificate.");

}

}

loadCertificate();