// =====================================================
// COLLEGE EVENT MANAGER - ADMIN PANEL
// PART 1
// =====================================================

let students = [];

// ----------------------------
// Load Dashboard
// ----------------------------

window.onload = function () {

    loadStudents();

    createCharts();

};

// ----------------------------
// Fetch Students
// ----------------------------

async function loadStudents() {

    try {

        const response = await fetch("/students");

        students = await response.json();

        updateDashboard();

        loadTable();

        updateCharts();

    }

    catch (err) {

        console.error(err);

    }

}

// ----------------------------
// Dashboard Statistics
// ----------------------------

function updateDashboard() {

    const totalStudents = students.length;

    const totalRevenue = students.reduce(
        (sum, s) => sum + Number(s.amount),
        0
    );

    const paidPayments = students.filter(
        s => s.payment_status === "Paid"
    ).length;

    const pendingPayments = students.filter(
        s => s.payment_status !== "Paid"
    ).length;

    document.getElementById("count").innerText =
        totalStudents;

    document.getElementById("revenue").innerText =
        "₹" + totalRevenue;

    document.getElementById("paid").innerText =
        paidPayments;

    document.getElementById("pending").innerText =
        pendingPayments;
         // ----------------------------
    // Participating Colleges
    // ----------------------------

    const colleges = [...new Set(
        students.map(s => s.college)
    )];

    document.getElementById("colleges").innerText =
        colleges.length;

    // ----------------------------
    // Top College
    // ----------------------------

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

    // ----------------------------
    // Top Event
    // ----------------------------

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

    // ----------------------------
    // Today's Registrations
    // ----------------------------

    const today = new Date().toISOString().split("T")[0];

    const todayStudents = students.filter(student =>
        student.createdAt &&
        student.createdAt.startsWith(today)
    );

    document.getElementById("todayRegistrations").innerText =
        todayStudents.length;

    // ----------------------------
    // Today's Revenue
    // ----------------------------

    const todayRevenue =
        todayStudents.reduce(
            (sum, s) => sum + Number(s.amount),
            0
        );

    document.getElementById("todayRevenue").innerText =
        "₹" + todayRevenue;

    // ----------------------------
    // Attendance
    // ----------------------------

    const attendance =
        students.filter(
            s => s.attendance === "Present"
        ).length;

    document.getElementById("attendanceCount").innerText =
        attendance;

    // ----------------------------
    // Certificates
    // ----------------------------

    const certificates =
        students.filter(
            s => s.certificate_id
        ).length;

    const certificateElement =
        document.getElementById("certificateGenerated") ||
        document.getElementById("certificateCount");

    if (certificateElement) {

        certificateElement.innerText =
            certificates;

    }

}
   // =====================================================
// STUDENT TABLE
// =====================================================

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

// =====================================================
// SEARCH STUDENT
// =====================================================

function searchStudent() {

    const value =
    document
    .getElementById("search")
    .value
    .toLowerCase();

    const rows =
    document
    .querySelectorAll("#studentTable tr");

    rows.forEach(row => {

        if (
            row.innerText
            .toLowerCase()
            .includes(value)
        ) {

            row.style.display = "";

        }

        else {

            row.style.display = "none";

        }

    });

}
// =====================================================
// DELETE STUDENT
// =====================================================

async function deleteStudent(id){

    const confirmDelete = confirm(
        "Delete this student?"
    );

    if(!confirmDelete) return;

    try{

        const res = await fetch(
            "/student/" + id,
            {
                method:"DELETE"
            }
        );

        const data = await res.json();

        if(data.success){

            alert("Student Deleted");

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

// =====================================================
// MARK ATTENDANCE
// =====================================================

async function markPresent(id){

    try{

        const res = await fetch(
            "/attendance/" + id,
            {
                method:"PUT"
            }
        );

        const data = await res.json();

        if(data.success){

            alert("Attendance Marked");

            loadStudents();

        }

        else{

            alert("Failed");

        }

    }

    catch(err){

        console.log(err);

    }

}

// =====================================================
// VIEW CERTIFICATE
// =====================================================

function viewCertificate(id){

    window.open(

        "/certificate.html?id=" + id,

        "_blank"

    );

}
// =====================================================
// CHARTS
// =====================================================

let barChart = null;
let pieChart = null;

function createCharts(){}

function updateCharts(){

    const eventCount = {};

    students.forEach(student=>{

        eventCount[student.event] =
        (eventCount[student.event] || 0)+1;

    });

    // Destroy old charts

    if(barChart){

        barChart.destroy();

    }

    if(pieChart){

        pieChart.destroy();

    }

    // -----------------------
    // BAR CHART
    // -----------------------

    const bar = document.getElementById("barChart");

    if(bar){

        barChart = new Chart(bar,{

            type:"bar",

            data:{

                labels:[
                    "Students",
                    "Paid",
                    "Pending",
                    "Colleges"
                ],

                datasets:[{

                    data:[

                        students.length,

                        students.filter(s=>s.payment_status=="Paid").length,

                        students.filter(s=>s.payment_status!="Paid").length,

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

    // -----------------------
    // PIE CHART
    // -----------------------

    const pie = document.getElementById("pieChart");

    if(pie){

        pieChart = new Chart(pie,{

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

// =====================================================
// LOGOUT
// =====================================================

function logout(){

    fetch("/logout")

    .then(()=>{

        window.location.href="admin-login.html";

    });

}

// =====================================================
// MOBILE MENU
// =====================================================

const menuBtn =
document.getElementById("menuBtn");

if(menuBtn){

menuBtn.onclick=function(){

document
.querySelector(".sidebar")
.classList.toggle("active");

}

}