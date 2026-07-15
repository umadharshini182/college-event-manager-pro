// ======================================================
// COLLEGE EVENT MANAGER
// DASHBOARD.JS
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

    initializeNotifications();

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

        updateCards();

        updateCharts();

    }

    catch (err) {

        console.log(err);

    }

}
// ======================================================
// UPDATE DASHBOARD CARDS
// ======================================================

function updateCards(){

    // Total Students
    document.getElementById("count").innerText =
    students.length;

    // Revenue
    let revenue = 0;

    students.forEach(student=>{

        revenue += Number(student.amount || 0);

    });

    document.getElementById("revenue").innerText =
    "₹" + revenue;

    // Paid
    const paid =
    students.filter(
        s=>s.payment_status==="Paid"
    ).length;

    // Pending
    const pending =
    students.filter(
        s=>s.payment_status!=="Paid"
    ).length;

    document.getElementById("paid").innerText =
    paid;

    document.getElementById("pending").innerText =
    pending;

    // ---------------------------------------
    // Participating Colleges
    // ---------------------------------------

    const collegeMap = {};

    students.forEach(student=>{

        collegeMap[student.college]=true;

    });

    document.getElementById("colleges").innerText =
    Object.keys(collegeMap).length;

    // ---------------------------------------
    // Top Event
    // ---------------------------------------

    const eventCount = {};

    students.forEach(student=>{

        eventCount[student.event] =
        (eventCount[student.event] || 0) + 1;

    });

    let topEvent = "-";
    let highest = 0;

    for(const event in eventCount){

        if(eventCount[event] > highest){

            highest = eventCount[event];
            topEvent = event;

        }

    }

    document.getElementById("topEvent").innerText =
    topEvent;

    document.getElementById("bestEvent").innerText =
    topEvent;

    // ---------------------------------------
    // Top College
    // ---------------------------------------

    const collegeCount = {};

    students.forEach(student=>{

        collegeCount[student.college] =
        (collegeCount[student.college] || 0) + 1;

    });

    let topCollege = "-";
    let maxCollege = 0;

    for(const college in collegeCount){

        if(collegeCount[college] > maxCollege){

            maxCollege = collegeCount[college];
            topCollege = college;

        }

    }

    document.getElementById("topCollege").innerText =
    topCollege;

    // ---------------------------------------
    // Today's Registration
    // ---------------------------------------

    const today =
    new Date().toISOString().split("T")[0];

    const todayStudents =
    students.filter(student=>

        student.createdAt &&
        student.createdAt.startsWith(today)

    );

    document.getElementById("todayRegistrations").innerText =
    todayStudents.length;

    // Today's Revenue

    const todayRevenue =
    todayStudents.reduce(

        (sum,s)=>sum+Number(s.amount || 0),

        0

    );

    document.getElementById("todayRevenue").innerText =
    "₹"+todayRevenue;

    // Attendance

    const attendance =
    students.filter(
        s=>s.attendance==="Present"
    ).length;

    document.getElementById("attendanceCount").innerText =
    attendance;

    // Certificates

    const certificates =
    students.filter(
        s=>s.certificate_id
    ).length;

    document.getElementById("certificateCount").innerText =
    certificates;

    document.getElementById("certificateGenerated").innerText =
    certificates;

}
// ======================================================
// CHARTS
// ======================================================

function updateCharts(){

    const eventData = {};

    students.forEach(student=>{

        eventData[student.event] =
        (eventData[student.event] || 0) + 1;

    });

    // Destroy existing charts

    if(barChart){

        barChart.destroy();

    }

    if(pieChart){

        pieChart.destroy();

    }

    // -----------------------------
    // BAR CHART
    // -----------------------------

    const barCanvas =
    document.getElementById("barChart");

    if(barCanvas){

        barChart = new Chart(barCanvas,{

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

                        students.filter(
                        s=>s.payment_status==="Paid"
                        ).length,

                        students.filter(
                        s=>s.payment_status!=="Paid"
                        ).length,

                        [...new Set(
                        students.map(s=>s.college)
                        )].length

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

    // -----------------------------
    // PIE CHART
    // -----------------------------

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
// NOTIFICATIONS
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
// AUTO REFRESH
// ======================================================

setInterval(()=>{

    loadDashboard();

},30000);
