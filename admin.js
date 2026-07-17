// ======================================================
// COLLEGE EVENT MANAGER
// PROFESSIONAL ADMIN DASHBOARD
// ======================================================

let students = [];

let barChart = null;
let pieChart = null;

// ======================================================
// PAGE LOAD
// ======================================================

window.addEventListener("load", () => {

    checkLogin();

    initializeSidebar();

    initializeNotification();

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

        loadDashboard();

    }

    catch (err) {

        console.log(err);

        window.location.href = "admin-login.html";

    }

}

// ======================================================
// LOAD DASHBOARD
// ======================================================

async function loadDashboard() {

    try {

        const response = await fetch("/students", {
            credentials: "include"
        });

        students = await response.json();

        if (!Array.isArray(students)) {

            students = [];

        }

        updateDashboard();

        loadTable();

        updateCharts();

        updateLatestActivity();

        updateNotifications();

    }

    catch (err) {

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
// NOTIFICATION
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

document.onclick=function(){

popup.classList.remove("show");

};

popup.onclick=function(e){

e.stopPropagation();

};

}
// ======================================================
// DASHBOARD CARDS
// ======================================================

function updateDashboard(){

// -----------------------------
// TOTAL STUDENTS
// -----------------------------

const totalStudents = students.length;

const count =
document.getElementById("count");

if(count){

count.innerText = totalStudents;

}

// -----------------------------
// TOTAL REVENUE
// -----------------------------

const totalRevenue =
students.reduce((sum,student)=>{

return sum + Number(student.amount || 0);

},0);

const revenue =
document.getElementById("revenue");

if(revenue){

revenue.innerText =
"₹" + totalRevenue;

}

// -----------------------------
// PAID PAYMENTS
// -----------------------------

const paidPayments =
students.filter(student=>

student.payment_status==="Paid"

).length;

const paid =
document.getElementById("paid");

if(paid){

paid.innerText =
paidPayments;

}

// -----------------------------
// PENDING PAYMENTS
// -----------------------------

const pendingPayments =
students.filter(student=>

student.payment_status!=="Paid"

).length;

const pending =
document.getElementById("pending");

if(pending){

pending.innerText =
pendingPayments;

}

// -----------------------------
// PARTICIPATING COLLEGES
// -----------------------------

const uniqueColleges =
[...new Set(

students.map(student=>student.college)

)];

const colleges =
document.getElementById("colleges");

if(colleges){

colleges.innerText =
uniqueColleges.length;

}

// -----------------------------
// CERTIFICATES
// -----------------------------

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

// -----------------------------
// TODAY REGISTRATIONS
// -----------------------------

const today =
new Date().toISOString().split("T")[0];

const todayStudents =
students.filter(student=>

student.createdAt &&
student.createdAt.startsWith(today)

);

const todayRegistrations =
document.getElementById("todayRegistrations");

if(todayRegistrations){

todayRegistrations.innerText =
todayStudents.length;

}

// -----------------------------
// TODAY REVENUE
// -----------------------------

const todayRevenue =
todayStudents.reduce((sum,student)=>{

return sum + Number(student.amount || 0);

},0);

const todayRevenueBox =
document.getElementById("todayRevenue");

if(todayRevenueBox){

todayRevenueBox.innerText =
"₹" + todayRevenue;

}

// -----------------------------
// ATTENDANCE
// -----------------------------

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

// -----------------------------
// TOP EVENT
// -----------------------------

const eventCount = {};

students.forEach(student=>{

eventCount[student.event] =
(eventCount[student.event] || 0) + 1;

});

let topEvent = "-";
let max = 0;

for(const event in eventCount){

if(eventCount[event] > max){

max = eventCount[event];

topEvent = event;

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

// -----------------------------
// TOP COLLEGE
// -----------------------------

const collegeCount = {};

students.forEach(student=>{

collegeCount[student.college] =
(collegeCount[student.college] || 0) + 1;

});

let topCollege = "-";

max = 0;

for(const college in collegeCount){

if(collegeCount[college] > max){

max = collegeCount[college];

topCollege = college;

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

function loadTable(){

const tbody =
document.getElementById("studentTable");

if(!tbody){

console.log("studentTable not found");

return;

}

tbody.innerHTML = "";

if(students.length===0){

tbody.innerHTML = `

<tr>

<td colspan="12"
style="text-align:center;padding:35px;">

No student registrations found.

</td>

</tr>

`;

return;

}

students.forEach(student=>{

const row = document.createElement("tr");

row.innerHTML = `

<td>#${student.id}</td>

<td>

<strong>${student.fullname}</strong>

</td>

<td>${student.email}</td>

<td>${student.college}</td>

<td>${student.department}</td>

<td>${student.year}</td>

<td>

<span class="event-badge">

${student.event}

</span>

</td>

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

<td>

₹${student.amount}

</td>

<td>

<button

class="${
student.attendance==="Present"
?
"action-btn present-btn"
:
"action-btn warning-btn"
}"

onclick="markAttendance(${student.id})">

${
student.attendance==="Present"
?
"Present"
:
"Mark"
}

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

`<button
class="action-btn disabled-btn"
disabled>

Not Generated

</button>`

}

</td>

<td>

<button
class="action-btn delete-btn"
onclick="deleteStudent(${student.id})">

Delete

</button>

</td>

`;

tbody.appendChild(row);

});

}
// ======================================================
// SEARCH STUDENT
// ======================================================

function searchStudent(){

const search =
document.getElementById("search");

if(!search){

return;

}

const value =
search.value.toLowerCase();

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

if(data.success){

alert("Attendance marked successfully.");

loadDashboard();

}else{

alert("Unable to mark attendance.");

}

}

catch(err){

console.log(err);

alert("Server error.");

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

alert("Certificate not generated.");

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
confirm("Delete this student?");

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

alert("Student deleted successfully.");

loadDashboard();

}else{

alert("Unable to delete student.");

}

}

catch(err){

console.log(err);

alert("Server error.");

}

}
// ======================================================
// PROFESSIONAL CHARTS
// ======================================================

function updateCharts(){

const eventData = {};

students.forEach(student=>{

eventData[student.event] =
(eventData[student.event] || 0) + 1;

});

const labels = Object.keys(eventData);

const values = Object.values(eventData);

// =====================
// BAR CHART
// =====================

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

label:"Registrations",

data:values,

backgroundColor:[

"#1565C0",
"#2E7D32",
"#EF6C00",
"#C62828",
"#6A1B9A",
"#0288D1"

],

borderRadius:10,

borderSkipped:false

}]

},

options:{

responsive:true,

maintainAspectRatio:false,

plugins:{

legend:{

display:false

}

},

scales:{

y:{

beginAtZero:true,

ticks:{

stepSize:1

}

}

}

}

});

}

// =====================
// PIE CHART
// =====================

const pieCanvas =
document.getElementById("pieChart");

if(pieCanvas){

if(pieChart){

pieChart.destroy();

}

pieChart = new Chart(pieCanvas,{

type:"doughnut",

data:{

labels:labels,

datasets:[{

data:values,

backgroundColor:[

"#1565C0",
"#2E7D32",
"#EF6C00",
"#C62828",
"#6A1B9A",
"#0288D1"

],

borderWidth:2

}]

},

options:{

responsive:true,

maintainAspectRatio:false,

plugins:{

legend:{

position:"bottom"

}

}

}

});

}

}
// ======================================================
// LATEST ACTIVITY
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

<li>No recent activity.</li>

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

🎓 <strong>${student.fullname}</strong>

registered for

<strong>${student.event}</strong>

</li>

`;

});

}

// ======================================================
// REAL NOTIFICATIONS
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

popup.innerHTML += `

<div class="notify-item">

<h4>🎓 New Registration</h4>

<p>

${student.fullname}

registered for

${student.event}

</p>

<small>

Payment :
${student.payment_status}

</small>

</div>

`;

});

if(badge){

badge.innerText = latest.length;

}

}

// ======================================================
// LOGOUT
// ======================================================

function logout(){

const answer =
confirm("Are you sure you want to logout?");

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
.catch(err=>{

console.log(err);

window.location.href =
"admin-login.html";

});

}
// ======================================================
// AUTO REFRESH
// ======================================================

setInterval(()=>{

loadDashboard();

},30000);

// ======================================================
// REFRESH WHEN TAB BECOMES ACTIVE
// ======================================================

document.addEventListener("visibilitychange",()=>{

if(!document.hidden){

loadDashboard();

}

});

// ======================================================
// REFRESH WHEN WINDOW GETS FOCUS
// ======================================================

window.addEventListener("focus",()=>{

loadDashboard();

});

// ======================================================
// LOADING
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

style="text-align:center;
padding:35px;">

Loading student registrations...

</td>

</tr>

`;

}

// ======================================================
// GLOBAL SEARCH (TOP SEARCH BAR)
// ======================================================

const globalSearch =
document.getElementById("globalSearch");

if(globalSearch){

globalSearch.addEventListener("keyup",()=>{

const value =
globalSearch.value.toLowerCase();

const rows =
document.querySelectorAll("#studentTable tr");

rows.forEach(row=>{

if(row.innerText.toLowerCase().includes(value)){

row.style.display="";

}else{

row.style.display="none";

}

});

});

}

// ======================================================
// PAGE READY
// ======================================================

console.log("======================================");

console.log("College Event Manager Admin Ready");

console.log("Professional Dashboard Loaded");

console.log("======================================");

// ======================================================
// END OF ADMIN.JS
// ======================================================