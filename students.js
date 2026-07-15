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
// ======================================================
// UPDATE SUMMARY
// ======================================================

function updateSummary() {

    // Total Students
    document.getElementById("totalStudents").innerText =
        students.length;

    // Present
    const present =
        students.filter(
            s => s.attendance === "Present"
        ).length;

    document.getElementById("presentStudents").innerText =
        present;

    // Absent
    document.getElementById("absentStudents").innerText =
        students.length - present;

    // Certificates
    const certificates =
        students.filter(
            s => s.certificate_id
        ).length;

    document.getElementById("studentCertificates").innerText =
        certificates;

    document.getElementById("issuedCertificates").innerText =
        certificates;

    document.getElementById("todayPresent").innerText =
        present;

    // Colleges
    const colleges =
        [...new Set(students.map(
            s => s.college
        ))];

    document.getElementById("collegeCount").innerText =
        colleges.length;

}

// ======================================================
// LOAD TABLE
// ======================================================

function loadTable(){

    const tbody =
    document.getElementById("studentTable");

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
// SEARCH
// ======================================================

function searchStudent(){

    const value =
    document
    .getElementById("search")
    .value
    .toLowerCase();

    const rows =
    document.querySelectorAll(
        "#studentTable tr"
    );

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

// ======================================================
// EVENT FILTER
// ======================================================

const eventFilter =
document.getElementById("eventFilter");

if(eventFilter){

eventFilter.onchange=function(){

const event =
this.value;

const rows =
document.querySelectorAll(
"#studentTable tr"
);

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
