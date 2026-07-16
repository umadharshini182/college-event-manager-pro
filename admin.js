// ======================================================
// COLLEGE EVENT MANAGER
// ADMIN.JS
// ======================================================

let students = [];

// ======================================================
// PAGE LOAD
// ======================================================

window.addEventListener("load",()=>{

checkLogin();

initializeSidebar();

});

// ======================================================
// LOGIN CHECK
// ======================================================

async function checkLogin(){

try{

const response =
await fetch("/api/current-user",{

credentials:"include"

});

const data =
await response.json();

if(!data.loggedIn){

window.location.href =
"admin-login.html";

return;

}

loadStudents();

}

catch(err){

console.log(err);

window.location.href =
"admin-login.html";

}

}

// ======================================================
// LOAD STUDENTS
// ======================================================

async function loadStudents(){

try{

const response =
await fetch("/students",{

credentials:"include"

});

students =
await response.json();

updateDashboard();

loadTable();

updateCharts();

updateActivity();

}

catch(err){

console.log(err);

}

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
// UPDATE DASHBOARD
// ======================================================

function updateDashboard(){

// Total Students

document.getElementById("count").innerText =
students.length;

// Total Revenue

const revenue =
students.reduce(

(sum,s)=>sum+Number(s.amount||0),

0

);

document.getElementById("revenue").innerText =
"₹"+revenue;

// Paid Payments

const paid =
students.filter(

s=>s.payment_status==="Paid"

).length;

document.getElementById("paid").innerText =
paid;

// Pending Payments

const pending =
students.filter(

s=>s.payment_status!=="Paid"

).length;

document.getElementById("pending").innerText =
pending;

// Participating Colleges

const colleges =
new Set(

students.map(s=>s.college)

).size;

document.getElementById("colleges").innerText =
colleges;

// Certificates

const certificates =
students.filter(

s=>s.certificate_id

).length;

document.getElementById("certificateCount").innerText =
certificates;

// Today's Date

const today =
new Date().toISOString().split("T")[0];

// Today's Students

const todayStudents =
students.filter(

s=>

s.createdAt &&

s.createdAt.startsWith(today)

);

// Today's Registrations

const todayRegistration =
document.getElementById("todayRegistrations");

if(todayRegistration){

todayRegistration.innerText =
todayStudents.length;

}

// Today's Revenue

const todayRevenue =
todayStudents.reduce(

(sum,s)=>sum+Number(s.amount||0),

0

);

const todayRevenueBox =
document.getElementById("todayRevenue");

if(todayRevenueBox){

todayRevenueBox.innerText =
"₹"+todayRevenue;

}

// Attendance

const attendance =
students.filter(

s=>s.attendance==="Present"

).length;

const attendanceBox =
document.getElementById("attendanceCount");

if(attendanceBox){

attendanceBox.innerText =
attendance;

}

// Certificate Generated

const certificateGenerated =
document.getElementById("certificateGenerated");

if(certificateGenerated){

certificateGenerated.innerText =
certificates;

}

// Best Event

let events = {};

students.forEach(s=>{

events[s.event] =
(events[s.event]||0)+1;

});

let bestEvent = "-";

let max = 0;

for(let event in events){

if(events[event]>max){

max = events[event];

bestEvent = event;

}

}

document.getElementById("topEvent").innerText =
bestEvent;

document.getElementById("bestEvent").innerText =
bestEvent;

// Top College

let collegeCount = {};

students.forEach(s=>{

collegeCount[s.college] =
(collegeCount[s.college]||0)+1;

});

let topCollege = "-";

max = 0;

for(let college in collegeCount){

if(collegeCount[college]>max){

max = collegeCount[college];

topCollege = college;

}

}

document.getElementById("topCollege").innerText =
topCollege;

}
// ======================================================
// STUDENT TABLE
// ======================================================

function loadTable(){

const tbody =
document.getElementById("studentTable");

if(!tbody){

console.log("studentTable not found");

return;

}

tbody.innerHTML = "";

students.forEach(student=>{

tbody.innerHTML += `

<tr>

<td>${student.id}</td>

<td>${student.fullname}</td>

<td>${student.email}</td>

<td>${student.college}</td>

<td>${student.department}</td>

<td>${student.year}</td>

<td>${student.event}</td>

<td>

<span class="${
student.payment_status==="Paid"
?
"paid"
:
"pending"
}">

${student.payment_status}

</span>

</td>

<td>₹${student.amount}</td>

<td>

<button
class="action-btn present-btn"
onclick="markAttendance(${student.id})">

${student.attendance==="Present"
?
"Present"
:
"Mark"}

</button>

</td>

<td>

${
student.certificate_id
?
`<button
class="action-btn certificate-btn"
onclick="viewCertificate(${student.id})">
View
</button>`
:
"-"
}

</td>

<td>

<button
class="action-btn delete-btn"
onclick="deleteStudent(${student.id})">

Delete

</button>

</td>

</tr>

`;

});

}
// ======================================================
// SEARCH STUDENT
// ======================================================

function searchStudent(){

const input =
document.getElementById("search");

if(!input) return;

const value =
input.value.toLowerCase();

const rows =
document.querySelectorAll("#studentTable tr");

rows.forEach(row=>{

if(row.innerText.toLowerCase().includes(value)){

row.style.display="";

}else{

row.style.display="none";

}

});

}

// ======================================================
// MARK ATTENDANCE
// ======================================================

async function markAttendance(id){

try{

const response =
await fetch("/attendance/"+id,{

method:"PUT",

credentials:"include"

});

const data =
await response.json();

alert(data.message);

loadStudents();

}

catch(err){

console.log(err);

alert("Unable to update attendance.");

}

}

// ======================================================
// VIEW CERTIFICATE
// ======================================================

function viewCertificate(id){

const student =
students.find(s=>s.id===id);

if(!student){

alert("Certificate not found.");

return;

}

if(student.certificate_id){

window.location.href =
"certificate.html?id="+student.id;

}else{

alert("Certificate has not been generated yet.");

}

}

// ======================================================
// DELETE STUDENT
// ======================================================

async function deleteStudent(id){

if(!confirm("Delete this student?")){

return;

}

try{

const response =
await fetch("/student/"+id,{

method:"DELETE",

credentials:"include"

});

const data =
await response.json();

alert(data.message);

loadStudents();

}

catch(err){

console.log(err);

alert("Unable to delete student.");

}

}
// ======================================================
// CHARTS
// ======================================================

let barChart = null;
let pieChart = null;

function updateCharts(){

const events = {};

students.forEach(student=>{

events[student.event] =
(events[student.event] || 0) + 1;

});

const labels =
Object.keys(events);

const values =
Object.values(events);

// ---------- BAR CHART ----------

const bar =
document.getElementById("barChart");

if(bar){

if(barChart){

barChart.destroy();

}

barChart = new Chart(bar,{

type:"bar",

data:{

labels:labels,

datasets:[{

label:"Registrations",

data:values,

backgroundColor:[
"#0B3D91",
"#28a745",
"#ffc107",
"#dc3545",
"#17a2b8",
"#6f42c1"
]

}]

},

options:{

responsive:true,

plugins:{

legend:{

display:false

}

}

}

});

}

// ---------- PIE CHART ----------

const pie =
document.getElementById("pieChart");

if(pie){

if(pieChart){

pieChart.destroy();

}

pieChart = new Chart(pie,{

type:"pie",

data:{

labels:labels,

datasets:[{

data:values,

backgroundColor:[
"#0B3D91",
"#28a745",
"#ffc107",
"#dc3545",
"#17a2b8",
"#6f42c1"
]

}]

},

options:{

responsive:true

}

});

}

}

// ======================================================
// LATEST ACTIVITY
// ======================================================

function updateActivity(){

const activity =
document.getElementById("activityList");

if(!activity){

return;

}

activity.innerHTML = "";

students
.slice()
.reverse()
.slice(0,5)
.forEach(student=>{

activity.innerHTML += `

<li>

<strong>${student.fullname}</strong>

registered for

<strong>${student.event}</strong>

</li>

`;

});

}
// ======================================================
// NOTIFICATIONS
// ======================================================

const notificationBtn =
document.getElementById("notificationBtn");

const notificationDropdown =
document.getElementById("notificationDropdown");

if(notificationBtn && notificationDropdown){

notificationBtn.onclick = ()=>{

notificationDropdown.classList.toggle("show");

};

document.addEventListener("click",(e)=>{

if(

!notificationBtn.contains(e.target) &&

!notificationDropdown.contains(e.target)

){

notificationDropdown.classList.remove("show");

}

});

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

})
.catch(()=>{

window.location.href="admin-login.html";

});

}

// ======================================================
// AUTO REFRESH
// ======================================================

setInterval(()=>{

loadStudents();

},30000);

// ======================================================
// END OF ADMIN.JS
// ======================================================