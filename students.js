// ======================================================
// GLOBAL VARIABLES
// ======================================================

let students = [];

let barChart = null;

let pieChart = null;

// ======================================================
// START
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    checkLogin();

    initializeSidebar();

    initializeNotifications();

    loadStudents();

});

// ======================================================
// LOGIN CHECK
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

    }

    catch(err){

        console.log(err);

    }

}

// ======================================================
// LOAD STUDENTS
// ======================================================

async function loadStudents(){

    try{

        const response = await fetch("/students",{

            credentials:"include"

        });

        students = await response.json();

        updateSummary();

        loadTable();

        updateCharts();

        loadRecentActivity();

    }

    catch(err){

        console.log(err);

    }

}
// ======================================================
// UPDATE SUMMARY
// ======================================================

function updateSummary(){

    document.getElementById("totalStudents").innerText =
    students.length;

    const present =
    students.filter(
        s=>s.attendance==="Present"
    ).length;

    document.getElementById("presentStudents").innerText =
    present;

    document.getElementById("absentStudents").innerText =
    students.length - present;

    const certificates =
    students.filter(
        s=>s.certificate_id
    ).length;

    document.getElementById("studentCertificates").innerText =
    certificates;

    document.getElementById("issuedCertificates").innerText =
    certificates;

    document.getElementById("todayPresent").innerText =
    present;

    const colleges =
    [...new Set(
        students.map(s=>s.college)
    )];

    document.getElementById("collegeCount").innerText =
    colleges.length;

    const events =
    [...new Set(
        students.map(s=>s.event)
    )];

    document.getElementById("eventCount").innerText =
    events.length;

}

// ======================================================
// LOAD TABLE
// ======================================================

function loadTable(){

    const tbody =
    document.getElementById("studentTable");

    tbody.innerHTML="";

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

<span class="paid">

${student.payment_status}

</span>

</td>

<td>

${
student.attendance==="Present"

?

'<span class="paid">Present</span>'

:

'<span class="pending">Absent</span>'

}

</td>

<td>

${student.certificate_id || "-"}

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

            alert("Attendance Updated");

            loadStudents();

        }

        else{

            alert("Unable to Update Attendance");

        }

    }

    catch(err){

        console.log(err);

    }

}

// ======================================================
// VIEW CERTIFICATE
// ======================================================

async function viewCertificate(id){

    try{

        const response = await fetch("/certificate/" + id,{

            credentials:"include"

        });

        const student = await response.json();

        if(!student.id){

            alert("Certificate Not Available");

            return;

        }

        alert(

`Certificate ID : ${student.certificate_id}

Student : ${student.fullname}

Event : ${student.event}`

        );

    }

    catch(err){

        console.log(err);

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

        const response = await fetch("/student/" + id,{

            method:"DELETE",

            credentials:"include"

        });

        const data = await response.json();

        if(data.success){

            alert("Student Deleted");

            loadStudents();

        }

        else{

            alert("Unable to Delete Student");

        }

    }

    catch(err){

        console.log(err);

    }

}

// ======================================================
// RECENT ACTIVITY
// ======================================================

function loadRecentActivity(){

    const activity =
    document.getElementById("activityList");

    const latest =
    document.getElementById("latestRegistrations");

    if(!activity || !latest) return;

    activity.innerHTML="";

    latest.innerHTML="";

    students.slice(0,5).forEach(student=>{

        activity.innerHTML += `

<li>

${student.fullname}
registered for
${student.event}

</li>

`;

        latest.innerHTML += `

<tr>

<td>${student.fullname}</td>

<td>${student.event}</td>

<td>

<span class="paid">

${student.payment_status}

</span>

</td>

</tr>

`;

    });

}
// ======================================================
// SEARCH STUDENT
// ======================================================

function searchStudent(){

    const value =
    document
    .getElementById("search")
    .value
    .toLowerCase();

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
// EVENT FILTER
// ======================================================

const eventFilter =
document.getElementById("eventFilter");

if(eventFilter){

    eventFilter.onchange=function(){

        const event=this.value;

        const rows=
        document.querySelectorAll("#studentTable tr");

        rows.forEach(row=>{

            if(

                event===""

                ||

                row.innerText.includes(event)

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

function initializeNotifications(){

    const bell =
    document.getElementById("notificationBtn");

    const dropdown =
    document.getElementById("notificationDropdown");

    if(!bell || !dropdown) return;

    bell.onclick=(e)=>{

        e.stopPropagation();

        dropdown.classList.toggle("show");

    };

    document.addEventListener("click",(e)=>{

        if(

            !dropdown.contains(e.target)

            &&

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

    if(!confirm("Logout?")){

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
// CHARTS
// ======================================================

let barChart = null;
let pieChart = null;

function updateCharts(){

    const eventData = {};

    students.forEach(student=>{

        eventData[student.event] =
        (eventData[student.event] || 0) + 1;

    });

    if(barChart){

        barChart.destroy();

    }

    if(pieChart){

        pieChart.destroy();

    }

    const barCanvas =
    document.getElementById("barChart");

    if(barCanvas){

        barChart = new Chart(barCanvas,{

            type:"bar",

            data:{

                labels:[
                    "Students",
                    "Paid",
                    "Present",
                    "Certificates"
                ],

                datasets:[{

                    label:"Statistics",

                    data:[

                        students.length,

                        students.filter(
                        s=>s.payment_status==="Paid"
                        ).length,

                        students.filter(
                        s=>s.attendance==="Present"
                        ).length,

                        students.filter(
                        s=>s.certificate_id
                        ).length

                    ]

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        });

    }

    const pieCanvas =
    document.getElementById("pieChart");

    if(pieCanvas){

        pieChart = new Chart(pieCanvas,{

            type:"pie",

            data:{

                labels:Object.keys(eventData),

                datasets:[{

                    data:Object.values(eventData)

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
// AUTO REFRESH
// ======================================================

setInterval(()=>{

    loadStudents();

},30000);

// ======================================================
// PAGE START
// ======================================================

window.onload=()=>{

    initializeSidebar();

    initializeNotifications();

    checkLogin();

    loadStudents();

};