const student = JSON.parse(localStorage.getItem("studentData"));

if(student){

document.getElementById("studentName").innerHTML = student.fullname;

document.getElementById("eventName").innerHTML = student.event;

}

const today = new Date();

const date = today.toLocaleDateString("en-IN",{

day:"2-digit",

month:"long",

year:"numeric"

});

document.getElementById("certificateDate").innerHTML = date;

let certificateId = "";

if(student && student.registrationId){

certificateId = "CEM-" + student.registrationId;

}

else{

certificateId = "CEM-" + Math.floor(Math.random()*1000000);

}

document.getElementById("certificateId").innerHTML = certificateId;