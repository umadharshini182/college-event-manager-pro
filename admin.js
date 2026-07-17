// ======================================================
// COLLEGE EVENT MANAGER
// ADMIN.JS
// PROFESSIONAL VERSION
// ======================================================

let students = [];

// ======================================================
// PAGE LOAD
// ======================================================

window.addEventListener("load", async () => {

    initializeSidebar();

    await checkLogin();

});

// ======================================================
// LOGIN
// ======================================================

async function checkLogin(){

    try{

        const response = await fetch("/api/current-user",{

            credentials:"include"

        });

        const data = await response.json();

        if(!data.loggedIn){

            window.location.href="admin-login.html";

            return;

        }

        await loadDashboard();

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

        const response = await fetch("/students",{

            credentials:"include"

        });

        students = await response.json();

        updateCards();

        loadStudentTable();

        loadNotifications();

        loadLatestActivity();

        loadCharts();

    }

    catch(err){

        console.log(err);

    }

}

// ======================================================
// REAL NOTIFICATIONS
// ======================================================
function loadNotifications(){

const list =
document.getElementById("notificationList");

const count =
document.getElementById("notificationCount");

if(!list || !count) return;

list.innerHTML="";

students
.slice()
.reverse()
.slice(0,5)
.forEach(student=>{

list.innerHTML+=`

<div class="notify-item">

<h4>🎓 New Registration</h4>

<p>

${student.fullname}

registered for

${student.event}

</p>

<small>

${new Date(student.createdAt).toLocaleString()}

</small>

</div>

`;

});

const total = students.length;

count.innerText = total;

if(total===0){

count.style.display="none";

}else{

count.style.display="flex";

}
}


// ======================================================
// REAL LATEST ACTIVITY
// ======================================================

function loadLatestActivity(){

const activity =
document.getElementById("activityList");

if(!activity) return;

activity.innerHTML="";

students
.slice()
.reverse()
.slice(0,8)
.forEach(student=>{

activity.innerHTML += `

<li>

🎓 <strong>${student.fullname}</strong>

registered for

<strong>${student.event}</strong>

</li>

`;

if(student.attendance==="Present"){

activity.innerHTML += `

<li>

✅ Attendance marked for

<strong>${student.fullname}</strong>

</li>

`;

}

});

}
// ======================================================
// DASHBOARD CARDS
// ======================================================

function updateCards(){

document.getElementById("count").innerText =
students.length;
const paidRevenue =
students
.filter(student=>student.payment_status==="Paid")
.reduce(
(sum,student)=>sum+Number(student.amount||0),
0
);

document.getElementById("revenue").innerText =
"₹"+paidRevenue;

const paid =
students.filter(
s=>s.payment_status==="Paid"
).length;

document.getElementById("paid").innerText =
paid;

const pending =
students.length-paid;

document.getElementById("pending").innerText =
pending;

// Participating Colleges

const colleges =
[...new Set(students.map(s=>s.college))];

document.getElementById("colleges").innerText =
colleges.length;
// Top College

const collegeCount = {};

students.forEach(student=>{

if(student.college){

collegeCount[student.college] =
(collegeCount[student.college]||0)+1;

}

});

let topCollege = "-";

let highestCollege = 0;

for(const college in collegeCount){

if(collegeCount[college] > highestCollege){

highestCollege = collegeCount[college];

topCollege = college;

}

}

document.getElementById("topCollege").innerText =
topCollege;
// Trending Event

const eventCount={};

students.forEach(student=>{

eventCount[student.event]=
(eventCount[student.event]||0)+1;

});

let top="-";

let max=0;

for(const event in eventCount){

if(eventCount[event]>max){

max=eventCount[event];

top=event;

}

}

document.getElementById("topEvent").innerText=
top;

document.getElementById("bestEvent").innerText=
top;

// Total Registrations

document.getElementById("todayRegistrations").innerText =
students.length;

// Attendance

const attendance=
students.filter(student=>

student.attendance==="Present"

).length;

document.getElementById("attendanceCount").innerText=
attendance;

// Certificates

const certificates=
students.filter(student=>

student.certificate==="Generated"

).length;

document.getElementById("certificateGenerated").innerText=
certificates;
// Today's Revenue

document.getElementById("todayRevenue").innerText =
"₹"+paidRevenue;

}

// ======================================================
// STUDENT TABLE
// ======================================================

function loadStudentTable(){

const tbody=
document.getElementById("studentTable");

if(!tbody) return;

tbody.innerHTML="";

students.forEach(student=>{

tbody.innerHTML+=`

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

<td>

₹${student.amount}

</td>

<td>

<span class="${
student.attendance==="Present"
?
"present"
:
"absent"
}">

${student.attendance}

</span>

</td>

<td>

<button
class="action-btn view-btn"
onclick="viewCertificate(${student.id})">

View

</button>

</td>

<td>

<button
class="action-btn present-btn"
onclick="markAttendance(${student.id})">

Present

</button>

<button
class="action-btn certificate-btn"
onclick="generateCertificate(${student.id})">

Certificate

</button>

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

const value=
document
.getElementById("search")
.value
.toLowerCase();

document
.querySelectorAll("#studentTable tr")
.forEach(row=>{

row.style.display=

row.innerText
.toLowerCase()
.includes(value)

?

""

:

"none";

});

}
// ======================================================
// CHARTS
// ======================================================

function loadCharts(){

// Destroy old charts

if(window.barChartInstance){

window.barChartInstance.destroy();

}

if(window.eventChartInstance){

window.eventChartInstance.destroy();

}

// Registration Bar Chart

const eventNames=[...new Set(students.map(s=>s.event))];

const eventCounts=eventNames.map(event=>

students.filter(s=>s.event===event).length

);

window.barChartInstance=new Chart(

document.getElementById("barChart"),

{

type:"bar",

data:{

labels:eventNames,

datasets:[{

label:"Registrations",

data:eventCounts,

backgroundColor:[

"#2563EB",

"#10B981",

"#F59E0B",

"#EF4444",

"#7C3AED",

"#06B6D4"

],

borderRadius:12,

borderSkipped:false

}]

},

options:{

responsive:true,

plugins:{

legend:{display:false}

},

scales:{

y:{

beginAtZero:true

}

}

}

}

);

// Professional Colorful Pie Chart

window.eventChartInstance = new Chart(

document.getElementById("pieChart"),

{

type:"pie",

data:{

labels:eventNames,

datasets:[{

data:eventCounts,

backgroundColor:[

"#2563EB",
"#10B981",
"#F59E0B",
"#EF4444",
"#8B5CF6",
"#06B6D4",
"#EC4899",
"#14B8A6"

],

borderColor:"#ffffff",

borderWidth:4,

hoverOffset:18

}]

},

options:{

responsive:true,

plugins:{

legend:{

position:"bottom",

labels:{

padding:20,

font:{

size:14,

weight:"bold"

}

}

},

tooltip:{

backgroundColor:"#1E293B",

titleColor:"#ffffff",

bodyColor:"#ffffff"

}

}

}

}

);


}

// ======================================================
// NOTIFICATION BUTTON
// ======================================================

const bell=document.getElementById("notificationBtn");

const popup=document.getElementById("notificationDropdown");

if(bell && popup){

bell.onclick=function(e){

e.stopPropagation();

popup.classList.toggle("show");

};

document.addEventListener("click",function(){

popup.classList.remove("show");

});

popup.onclick=function(e){

e.stopPropagation();

};

}

// ======================================================
// ATTENDANCE
// ======================================================

async function markAttendance(id){

try{

await fetch("/attendance/"+id,{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

attendance:"Present"

})

});

await loadDashboard();

}

catch(err){

console.log(err);

}

}

// ======================================================
// CERTIFICATE
// ======================================================

async function generateCertificate(id){

try{

await fetch("/certificate/"+id,{

method:"PUT"

});

await loadDashboard();

alert("Certificate Generated Successfully");

}

catch(err){

console.log(err);

}

}

// ======================================================
// VIEW CERTIFICATE
// ======================================================

function viewCertificate(id){

window.open(

"/certificate/"+id,

"_blank"

);

}


// ======================================================
// DELETE STUDENT
// ======================================================

async function deleteStudent(id){

if(!confirm("Delete this student?")) return;

try{

await fetch("/student/"+id,{

method:"DELETE"

});

await loadDashboard();

alert("Student Deleted Successfully");

}

catch(err){

console.log(err);

}

}
// ======================================================
// SIDEBAR
// ======================================================

function initializeSidebar(){

const sidebar=document.getElementById("sidebar");

const menu=document.getElementById("menuBtn");

const close=document.getElementById("closeSidebar");

const overlay=document.getElementById("overlay");

if(menu){

menu.onclick=function(){

sidebar.classList.add("active");

overlay.classList.add("show");

};

}

if(close){

close.onclick=function(){

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
// LOGOUT
// ======================================================

function logout(){

if(!confirm("Logout from Admin Dashboard?")) return;

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

loadDashboard();

},3000);

// ======================================================
// END OF ADMIN.JS
// ======================================================