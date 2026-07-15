// ======================================================
// COLLEGE EVENT MANAGER
// ADMIN DASHBOARD
// ======================================================

let students = [];

let barChart = null;
let pieChart = null;

// ======================================================
// PAGE LOAD
// ======================================================

window.addEventListener("load", () => {

    checkLogin();

    sidebarFunctions();

    notificationFunctions();

});

// ======================================================
// LOGIN CHECK
// ======================================================

async function checkLogin() {

    try {

        const res = await fetch("/api/current-user", {
            credentials: "include"
        });

        const data = await res.json();

        if (!data.loggedIn) {

            window.location.href = "admin-login.html";

            return;

        }

        loadStudents();

    }

    catch (err) {

        console.log(err);

        window.location.href = "admin-login.html";

    }

}

// ======================================================
// LOAD STUDENTS
// ======================================================

async function loadStudents() {

    try {
 const response = await fetch("/students",{
    credentials:"include"
});

const students = await response.json();

let revenue = 0;

students.forEach(student=>{
    revenue += Number(student.amount || 0);
});

document.getElementById("eventRevenue").innerText = "₹" + revenue;

}
// ======================================================
// DASHBOARD STATISTICS
// ======================================================

function updateDashboard() {

    // Total Students
    document.getElementById("count").innerText =
        students.length;

    // Revenue
    let revenue = 0;

    students.forEach(student => {

        revenue += Number(student.amount || 0);

    });

    document.getElementById("revenue").innerText =
        "₹" + revenue;

    // Paid / Pending
    const paid =
        students.filter(
            s => s.payment_status === "Paid"
        ).length;

    const pending =
        students.filter(
            s => s.payment_status !== "Paid"
        ).length;

    document.getElementById("paid").innerText =
        paid;

    document.getElementById("pending").innerText =
        pending;

    // ==================================================
    // Participating Colleges
    // ==================================================

    const collegeMap = {};

    students.forEach(student => {

        collegeMap[student.college] = true;

    });

    document.getElementById("colleges").innerText =
        Object.keys(collegeMap).length;

    // ==================================================
    // Top College
    // ==================================================

    const collegeCount = {};

    students.forEach(student => {

        collegeCount[student.college] =
            (collegeCount[student.college] || 0) + 1;

    });

    let topCollege = "-";
    let maxCollege = 0;

    for (const college in collegeCount) {

        if (collegeCount[college] > maxCollege) {

            maxCollege = collegeCount[college];
            topCollege = college;

        }

    }

    document.getElementById("topCollege").innerText =
        topCollege;

    // ==================================================
    // Top Event
    // ==================================================

    const eventCount = {};

    students.forEach(student => {

        eventCount[student.event] =
            (eventCount[student.event] || 0) + 1;

    });

    let topEvent = "-";
    let maxEvent = 0;

    for (const event in eventCount) {

        if (eventCount[event] > maxEvent) {

            maxEvent = eventCount[event];
            topEvent = event;

        }

    }

    document.getElementById("topEvent").innerText =
        topEvent;

    document.getElementById("bestEvent").innerText =
        topEvent;

    // ==================================================
    // Today's Registrations
    // ==================================================

    const today =
        new Date().toISOString().split("T")[0];

    const todayStudents =
        students.filter(student =>
            student.createdAt &&
            student.createdAt.startsWith(today)
        );

    document.getElementById("todayRegistrations").innerText =
        todayStudents.length;

    // ==================================================
    // Today's Revenue
    // ==================================================

    const todayRevenue =
        todayStudents.reduce(
            (sum, s) => sum + Number(s.amount || 0),
            0
        );

    document.getElementById("todayRevenue").innerText =
        "₹" + todayRevenue;

    // ==================================================
    // Attendance
    // ==================================================

    const attendance =
        students.filter(
            s => s.attendance === "Present"
        ).length;

    document.getElementById("attendanceCount").innerText =
        attendance;

    // ==================================================
    // Certificates
    // ==================================================

    const certificates =
        students.filter(
            s => s.certificate_id
        ).length;

    document.getElementById("certificateCount").innerText =
        certificates;

    document.getElementById("certificateGenerated").innerText =
        certificates;

    // ==================================================
    // Summary Cards
    // ==================================================

    document.getElementById("summaryStudents").innerText =
        students.length;

    document.getElementById("summaryRevenue").innerText =
        "₹" + revenue;

    document.getElementById("summaryAttendance").innerText =
        attendance;

    document.getElementById("summaryCertificates").innerText =
        certificates;

}
// ======================================================
// STUDENT TABLE
// ======================================================

function loadTable() {

    const tbody = document.getElementById("studentTable");

    tbody.innerHTML = "";

    students.forEach(student => {

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
student.payment_status === "Paid"
? "paid"
: "pending"
}">
${student.payment_status}
</span>

</td>

<td>₹${student.amount}</td>

<td>

${
student.attendance === "Present"
?

'<span style="color:green;font-weight:bold;">Present</span>'

:

'<span style="color:red;font-weight:bold;">Absent</span>'

}

</td>

<td>

${
student.certificate_id

?

student.certificate_id

:

"-"

}

</td>

<td>

<button
class="action-btn present-btn"
onclick="markPresent(${student.id})">

Present

</button>

<button
class="action-btn certificate-btn"
onclick="viewCertificate(${student.id})">

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
// SEARCH
// ======================================================

function searchStudent(){

    const value =
    document
    .getElementById("search")
    .value
    .toLowerCase();

    const rows =
    document
    .querySelectorAll("#studentTable tr");

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

}

// Search from top search box

const globalSearch =
document.getElementById("globalSearch");

if(globalSearch){

globalSearch.addEventListener(

"keyup",

function(){

document.getElementById("search").value =
this.value;

searchStudent();

}

);

}
// ======================================================
// DELETE STUDENT
// ======================================================

async function deleteStudent(id){

    if(!confirm("Delete this student?")){

        return;

    }

    try{

        const response = await fetch("/student/" + id,{

            method:"DELETE",

            credentials:"include"

        });

        const data = await response.json();

        if(data.success){

            alert("Student Deleted Successfully");

            loadStudents();

        }

        else{

            alert("Delete Failed");

        }

    }

    catch(err){

        console.log(err);

        alert("Server Error");

    }

}

// ======================================================
// MARK ATTENDANCE
// ======================================================

async function markPresent(id){

    try{

        const response = await fetch("/attendance/" + id,{

            method:"PUT",

            credentials:"include"

        });

        const data = await response.json();

        if(data.success){

            alert("Attendance Marked Successfully");

            loadStudents();

        }

        else{

            alert("Unable to Mark Attendance");

        }

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

        "/certificate.html?id="+id,

        "_blank"

    );

}

// ======================================================
// BAR & PIE CHARTS
// ======================================================

function updateCharts(){

    const eventCount={};

    students.forEach(student=>{

        eventCount[student.event]=
        (eventCount[student.event]||0)+1;

    });

    if(barChart){

        barChart.destroy();

    }

    if(pieChart){

        pieChart.destroy();

    }

    const bar=document.getElementById("barChart");

    if(bar){

        barChart=new Chart(bar,{

            type:"bar",

            data:{

                labels:[
                    "Students",
                    "Paid",
                    "Pending",
                    "Colleges"
                ],

                datasets:[{

                    label:"Statistics",

                    data:[

                        students.length,

                        students.filter(s=>s.payment_status==="Paid").length,

                        students.filter(s=>s.payment_status!=="Paid").length,

                        [...new Set(students.map(s=>s.college))].length

                    ]

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                plugins:{

                    legend:{

                        display:false

                    }

                }

            }

        });

    }

    const pie=document.getElementById("pieChart");

    if(pie){

        pieChart=new Chart(pie,{

            type:"pie",

            data:{

                labels:Object.keys(eventCount),

                datasets:[{

                    data:Object.values(eventCount)

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        });

    }

}
// ======================================================
// SIDEBAR
// ======================================================

function sidebarFunctions(){

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
// NOTIFICATION
// ======================================================

function notificationFunctions(){

const bell =
document.getElementById("notificationBtn");

const dropdown =
document.getElementById("notificationDropdown");

if(!bell || !dropdown) return;

bell.onclick=function(e){

e.stopPropagation();

dropdown.classList.toggle("show");

};

document.addEventListener("click",function(e){

if(
!dropdown.contains(e.target) &&
!bell.contains(e.target)
){

dropdown.classList.remove("show");

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

});

}

// ======================================================
// AUTO REFRESH
// ======================================================

setInterval(function(){

loadStudents();

},30000);

// ======================================================
// WINDOW RESIZE
// ======================================================

window.addEventListener("resize",function(){

const sidebar =
document.getElementById("sidebar");

const overlay =
document.getElementById("overlay");

if(window.innerWidth>992){

sidebar.classList.remove("active");

overlay.classList.remove("show");

}

});

// ======================================================
// END
// ======================================================