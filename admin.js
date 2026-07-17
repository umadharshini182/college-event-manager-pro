console.log(window.location.pathname);
// ======================================================
// COLLEGE EVENT MANAGER
// PROFESSIONAL ADMIN DASHBOARD
// VERSION 2.0
// ======================================================

// ======================================================
// GLOBAL VARIABLES
// ======================================================

let students = [];

let barChart = null;

let pieChart = null;

// let notificationSound = new Audio("notification.mp3");

// ======================================================
// PAGE LOAD
// ======================================================

window.addEventListener("load",()=>{

checkLogin();

initializeSidebar();

initializeNotification();

showLoading();

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

window.location.href="admin-login.html";

return;

}

loadDashboard();

}

catch(err){

console.log(err);

window.location.href="admin-login.html";

}

}

// ======================================================
// LOAD DASHBOARD
// ======================================================

async function loadDashboard(){

try{

const response =
await fetch("/students",{

credentials:"include"

});

students =
await response.json();

if(!Array.isArray(students)){

students=[];

}

updateDashboard();

loadStudentTable();

updateCharts();

updateLatestActivity();

updateNotifications();

}

catch(err){

console.log(err);

}

}// ======================================================
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

menuBtn.onclick=function(){

sidebar.classList.add("active");

overlay.classList.add("show");

};

}

if(closeBtn){

closeBtn.onclick=function(){

sidebar.classList.remove("active");

overlay.classList.remove("show");

};

}

if(overlay){

overlay.onclick=function(){

sidebar.classList.remove("active");

overlay.classList.remove("show");

};

}

}

// ======================================================
// NOTIFICATIONS
// ======================================================

function initializeNotification(){

const bell =
document.getElementById("notificationBtn");

const popup =
document.getElementById("notificationDropdown");

if(!bell || !popup){

return;

}

bell.onclick=function(e){

e.stopPropagation();

popup.classList.toggle("show");

};

popup.onclick=function(e){

e.stopPropagation();

};

document.addEventListener("click",function(){

popup.classList.remove("show");

});

}

// ======================================================
// UPDATE NOTIFICATIONS
// ======================================================

function updateNotifications(){

const popup =
document.getElementById("notificationDropdown");

const badge =
document.querySelector("#notificationBtn span");

if(!popup){

return;

}

popup.innerHTML = "<h3>Notifications</h3>";

const latest =
students
.slice()
.reverse()
.slice(0,5);
latest.forEach(student=>{

let title="🎓 New Registration";
let message=`${student.fullname} registered for ${student.event}`;

if(student.payment_status==="Paid"){

title="💳 Payment Received";

message=`${student.fullname} paid ₹${student.amount}`;

}

if(student.attendance==="Present"){

title="✅ Attendance";

message=`Attendance marked for ${student.fullname}`;

}

if(student.certificate_id){

title="🏆 Certificate";

message=`Certificate generated for ${student.fullname}`;

}

popup.innerHTML += `

<div class="notify-item">

<h4>${title}</h4>

<p>${message}</p>

<small>${student.event}</small>

</div>

`;

});

if(badge){

badge.innerText = latest.length;

}

}
// ======================================================
// PROFESSIONAL DASHBOARD
// ======================================================

function updateDashboard(){

// =========================
// TOTAL STUDENTS
// =========================

const totalStudents =
students.length;

const count =
document.getElementById("count");

if(count){

count.innerText =
totalStudents;

}

// =========================
// TOTAL REVENUE
// =========================

const totalRevenue =
students.reduce((sum,student)=>{

return sum + Number(student.amount || 0);

},0);

const revenue =
document.getElementById("revenue");

if(revenue){

revenue.innerText =
"₹"+totalRevenue;

}

// =========================
// PAID
// =========================

const paidCount =
students.filter(student=>

student.payment_status==="Paid"

).length;

const paid =
document.getElementById("paid");

if(paid){

paid.innerText =
paidCount;

}

// =========================
// PENDING
// =========================

const pendingCount =
students.filter(student=>

student.payment_status!=="Paid"

).length;

const pending =
document.getElementById("pending");

if(pending){

pending.innerText =
pendingCount;

}

// =========================
// PARTICIPATING COLLEGES
// =========================

const collegeList =
[
...new Set(

students.map(student=>student.college)

)
];

const colleges =
document.getElementById("colleges");

if(colleges){

colleges.innerText =
collegeList.length;

}

// =========================
// CERTIFICATES
// =========================

const certificates =
students.filter(student=>

student.certificate_id

).length;

const certificateCount =
document.getElementById("certificateCount");

if(certificateCount){

certificateCount.innerText =
certificates;

}

// =========================
// ATTENDANCE
// =========================

const attendance =
students.filter(student=>

student.attendance==="Present"

).length;

const attendanceBox =
document.getElementById("attendanceCount");

if(attendanceBox){

attendanceBox.innerText =
attendance;

}

// =========================
// TODAY REGISTRATIONS
// =========================

const todayRegistrations =
document.getElementById("todayRegistrations");

if(todayRegistrations){

todayRegistrations.innerText =
students.length;

}

// =========================
// TODAY REVENUE
// =========================

const todayRevenue =
document.getElementById("todayRevenue");

if(todayRevenue){

todayRevenue.innerText =
"₹"+totalRevenue;

}

// =========================
// TOP EVENT
// =========================

const eventCount = {};

students.forEach(student=>{

eventCount[student.event] =
(eventCount[student.event] || 0)+1;

});

let topEvent="-";

let max=0;

for(const event in eventCount){

if(eventCount[event]>max){

max=
eventCount[event];

topEvent=
event;

}

}

const topEventCard =
document.getElementById("topEvent");

if(topEventCard){

topEventCard.innerText =
topEvent;

}

const bestEvent =
document.getElementById("bestEvent");

if(bestEvent){

bestEvent.innerText =
topEvent;

}

// =========================
// TOP COLLEGE
// =========================

const collegeCount = {};

students.forEach(student=>{

collegeCount[student.college] =
(collegeCount[student.college] || 0)+1;

});

let topCollege="-";

max=0;

for(const college in collegeCount){

if(collegeCount[college]>max){

max=
collegeCount[college];

topCollege=
college;

}

}

const topCollegeCard =
document.getElementById("topCollege");

if(topCollegeCard){

topCollegeCard.innerText =
topCollege;

}

}
// ======================================================
// PROFESSIONAL STUDENT TABLE
// ======================================================

function loadStudentTable(){

const tbody =
document.getElementById("studentTable");

if(!tbody){

console.log("Student table not found.");

return;

}

tbody.innerHTML = "";

// =========================
// NO DATA
// =========================

if(students.length===0){

tbody.innerHTML=`

<tr>

<td colspan="12"
style="padding:40px;text-align:center;">

<i class="fa-solid fa-circle-info"></i>

No Student Registrations Found

</td>

</tr>

`;

return;

}

// =========================
// LOAD ROWS
// =========================

students.forEach(student=>{

const paymentBadge =
student.payment_status==="Paid"

?

`<span class="badge-paid">

✔ Paid

</span>`

:

`<span class="badge-pending">

Pending

</span>`;

const attendanceButton =
student.attendance==="Present"

?

`<button
class="action-btn success-btn"
disabled>

<i class="fa-solid fa-circle-check"></i>

Present

</button>`

:

`<button
class="action-btn present-btn"
onclick="markAttendance(${student.id})">

<i class="fa-solid fa-user-check"></i>

Mark Present

</button>`;

const certificateButton =
student.certificate_id

?

`<button
class="action-btn certificate-btn"
onclick="viewCertificate(${student.id})">

<i class="fa-solid fa-award"></i>

Certificate

</button>`

:

`<button
class="action-btn disabled-btn"
disabled>

Not Generated

</button>`;

tbody.innerHTML += `

<tr>

<td>${student.id}</td>

<td>

<strong>

${student.fullname}

</strong>

</td>

<td>${student.email}</td>

<td>${student.college}</td>

<td>${student.department}</td>

<td>${student.year}</td>

<td>${student.event}</td>

<td>

${paymentBadge}

</td>

<td>

₹${student.amount}

</td>

<td>

${attendanceButton}

</td>

<td>

${certificateButton}

</td>

<td>

<button
class="action-btn delete-btn"
onclick="deleteStudent(${student.id})">

<i class="fa-solid fa-trash"></i>

Delete

</button>

</td>

</tr>

`;

});

}
// ======================================================
// PROFESSIONAL SEARCH
// ======================================================

function searchStudent(){

const searchBox =
document.getElementById("search");

if(!searchBox){

return;

}

const value =
searchBox.value.toLowerCase();

const rows =
document.querySelectorAll("#studentTable tr");

rows.forEach(row=>{

if(row.innerText.toLowerCase().includes(value)){

row.style.display="";

}

else{

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

if(data.success){

alert("✅ Student marked Present successfully.");

loadDashboard();

}

else{

alert("❌ Unable to mark attendance.");

}

}

catch(err){

console.log(err);

alert("Server Error.");

}

}

// ======================================================
// VIEW CERTIFICATE
// ======================================================

function viewCertificate(id){

const student =
students.find(student=>student.id===id);

if(!student){

alert("Student not found.");

return;

}

if(!student.certificate_id){

alert("Certificate has not been generated.");

return;

}

window.open(

"/certificate.html?id="+id,

"_blank"

);

}

// ======================================================
// DELETE STUDENT
// ======================================================

async function deleteStudent(id){

const confirmDelete =
confirm(

"Delete this student permanently?"

);

if(!confirmDelete){

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

if(data.success){

alert("🗑 Student deleted successfully.");

loadDashboard();

}

else{

alert("Unable to delete student.");

}

}

catch(err){

console.log(err);

alert("Server Error.");

}

}

// ======================================================
// AUTO SEARCH
// ======================================================

const searchInput =
document.getElementById("search");

if(searchInput){

searchInput.addEventListener(

"keyup",

searchStudent

);

}
// ======================================================
// PROFESSIONAL CHARTS
// ======================================================

function updateCharts(){

const eventCount = {};

students.forEach(student=>{

eventCount[student.event] =
(eventCount[student.event] || 0) + 1;

});

const labels =
Object.keys(eventCount);

const values =
Object.values(eventCount);

// =====================================
// PROFESSIONAL BAR CHART
// =====================================

const barCanvas =
document.getElementById("barChart");

if(barCanvas){

if(barChart){

barChart.destroy();

}

barChart = new Chart(barCanvas,{

type:"bar",

data:{

labels:labels,

datasets:[{

label:"Student Registrations",

data:values,

backgroundColor:[

"#2563EB",
"#8B5CF6",
"#F97316",
"#22C55E",
"#EC4899",
"#14B8A6",
"#F43F5E"

],

borderRadius:18,

borderSkipped:false,

barThickness:48,

maxBarThickness:55

}]

},

options:{

responsive:true,

maintainAspectRatio:false,

animation:{

duration:1500

},

plugins:{

legend:{

display:false

},

title:{

display:true,

text:"Registration Analytics",

font:{

size:20,

weight:"bold"

}

}

},

scales:{

y:{

beginAtZero:true,

ticks:{

stepSize:1

},

grid:{

color:"#E5E7EB"

}

},

x:{

grid:{

display:false

}

}

}

}

});

}

// =====================================
// PROFESSIONAL DOUGHNUT CHART
// =====================================

const pieCanvas =
document.getElementById("pieChart");

if(pieCanvas){

if(pieChart){

pieChart.destroy();

}

pieChart = new Chart(pieCanvas,{

type:"polarArea",

data:{

labels:labels,

datasets:[{

data:values,

backgroundColor:[

"#2563EB",
"#7C3AED",
"#06B6D4",
"#10B981",
"#F59E0B",
"#EF4444",
"#EC4899"

],

borderColor:"#FFFFFF",

borderWidth:2,

hoverOffset:30

}]

},

options:{

responsive:true,

maintainAspectRatio:false,

animation:{

animateRotate:true,

duration:1500

},

plugins:{

legend:{

position:"bottom",

labels:{

padding:18,

boxWidth:18,

font:{

size:13,

weight:"bold"

}

}

},

title:{

display:true,

text:"Event Distribution",

font:{

size:20,

weight:"bold"

}

}

}

}

});

}

}
// ======================================================
// PROFESSIONAL LATEST ACTIVITY
// ======================================================

function updateLatestActivity(){

const activity =
document.getElementById("activityList");

if(!activity){

return;

}

activity.innerHTML = "";

if(students.length===0){

activity.innerHTML = `

<li>No recent activity available.</li>

`;

return;

}

students
.slice()
.reverse()
.slice(0,5)
.forEach(student=>{

activity.innerHTML += `

<li>

🎓 <strong>${student.fullname}</strong> registered for <strong>${student.event}</strong>

</li>

`;

});

}


// ======================================================
// LOGOUT
// ======================================================

function logout(){

const answer =
confirm(

"Logout from Admin Dashboard?"

);

if(!answer){

return;

}

fetch("/logout",{

credentials:"include"

})

.then(()=>{

window.location.href =
"admin-login.html";

})

.catch(()=>{

window.location.href =
"admin-login.html";

});

}

// ======================================================
// SHOW LOADING
// ======================================================

function showLoading(){

const tbody =
document.getElementById("studentTable");

if(!tbody){

return;

}

tbody.innerHTML = `

<tr>

<td colspan="12"

style="padding:40px;
text-align:center;">

Loading student registrations...

</td>

</tr>

`;

}
// ======================================================
// AUTO REFRESH DASHBOARD
// ======================================================

setInterval(()=>{

loadDashboard();

},30000);

// ======================================================
// REFRESH WHEN TAB IS ACTIVE
// ======================================================

document.addEventListener(

"visibilitychange",

()=>{

if(!document.hidden){

loadDashboard();

}

}

);

// ======================================================
// REFRESH WHEN WINDOW GETS FOCUS
// ======================================================

window.addEventListener(

"focus",

()=>{

loadDashboard();

}

);

// ======================================================
// GLOBAL SEARCH (TOP SEARCH BAR)
// ======================================================

const globalSearch =
document.getElementById("globalSearch");

if(globalSearch){

globalSearch.addEventListener(

"keyup",

function(){

const value =
this.value.toLowerCase();

const rows =
document.querySelectorAll("#studentTable tr");

rows.forEach(row=>{

if(row.innerText.toLowerCase().includes(value)){

row.style.display="";

}

else{

row.style.display="none";

}

});

}

);

}

// ======================================================
// PAGE READY
// ======================================================

console.log("================================");

console.log("College Event Manager Loaded");

console.log("Professional Dashboard Ready");

console.log("================================");

// ======================================================
// END OF ADMIN.JS
// ======================================================