fetch("/api/current-user", {
    credentials: "include"
})
.then(res => res.json())
.then(data => {

    if (!data.loggedIn) {
        window.location.href = "admin-login.html";
    
    }

});
// ===============================
// CHECK LOGIN
// ===============================

fetch("/api/current-user", {
    credentials: "include"
})
.then(res => {

    if (!res.ok) {
        window.location.href = "admin-login.html";
        return;
    }

    return res.json();

})
.then(user => {

    if (user) {
        console.log("Welcome", user.user.email);
    }
 
});

// ===============================
// LOAD STUDENTS
// ===============================
fetch("/students", {
    credentials: "include"
})
.then(res => res.json())
.then(data => {

    document.getElementById("count").innerText = data.length;

    let revenue = 0;
    let paid = 0;
    let pending = 0;

    let eventCount = {};
    let collegeSet = new Set();

    let rows = "";

    data.forEach(student => {

        collegeSet.add(student.college);

        revenue += Number(student.amount);

        if(student.payment_status === "Paid"){
            paid++;
        }else{
            pending++;
        }

        eventCount[student.event] =
            (eventCount[student.event] || 0) + 1;

        rows += `
<tr>

<td>${student.id}</td>

<td>${student.fullname}</td>

<td>${student.email}</td>

<td>${student.college}</td>

<td>${student.department}</td>

<td>${student.year}</td>

<td>${student.event}</td>

<td>
<span class="${student.payment_status=="Paid"?"paid":"pending"}">
${student.payment_status}
</span>
</td>

<td>₹${student.amount}</td>

<td>
<button class="action-btn present-btn"
onclick="markAttendance(${student.id})">
Present
</button>

<button class="action-btn certificate-btn"
onclick="generateCertificate(${student.id})">
Certificate
</button>

<button class="action-btn delete-btn"
onclick="deleteStudent(${student.id})">
Delete
</button>

</td>

</tr>
`;

    });

    document.getElementById("studentTable").innerHTML = rows;

    document.getElementById("revenue").innerText = "₹" + revenue;

    document.getElementById("paid").innerText = paid;

    document.getElementById("pending").innerText = pending;

    document.getElementById("colleges").innerText = collegeSet.size;

    let trending = "-";
    let max = 0;

    for(let event in eventCount){

        if(eventCount[event] > max){

            max = eventCount[event];

            trending = event;

        }

    }

    document.getElementById("trending").innerText = trending;
    const today = new Date().toISOString().split("T")[0];

let todayCount = 0;
let todayRevenue = 0;

data.forEach(student => {
    if (
        student.createdAt &&
        student.createdAt.startsWith(today)
    ) {
        todayCount++;
        todayRevenue += Number(student.amount);
    }
});

document.getElementById("todayRegistrations").innerText = todayCount;
document.getElementById("todayRevenue").innerText = "₹" + todayRevenue;
    // ===============================
// BAR CHART
// ===============================

const ctx = document.getElementById("barChart");

new Chart(ctx, {

    type: "bar",

    data: {

        labels: [
            "Students",
            "Paid",
            "Pending",
            "Colleges"
        ],

        datasets: [{

            label: "Statistics",

            data: [
                data.length,
                paid,
                pending,
                collegeSet.size
            ],

            backgroundColor: [
                "#1565C0",
                "#2E7D32",
                "#D32F2F",
                "#F9A825"
            ],

            borderRadius: 8

        }]

    },

    options: {

        responsive: true,

        plugins: {

            legend: {

                display: false

            }

        }

    }

});

// ===============================
// PIE CHART
// ===============================

const pie = document.getElementById("pieChart");

new Chart(pie, {

    type: "pie",

    data: {

        labels: Object.keys(eventCount),

        datasets: [{

            data: Object.values(eventCount),

            backgroundColor: [
                "#1565C0",
                "#2E7D32",
                "#EF6C00",
                "#AB47BC",
                "#29B6F6",
                "#FDD835"
            ]

        }]

    }

});

})
.catch(err => {

    console.error(err);

    alert("Unable to load student data.");

});

// ===============================
// SEARCH
// ===============================

function searchStudent() {

    let input = document
        .getElementById("search")
        .value
        .toLowerCase();

    let rows = document.querySelectorAll("#studentTable tr");

    rows.forEach(row => {

        if (row.innerText.toLowerCase().includes(input)) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

}

// ===============================
// ATTENDANCE
// ===============================

function markAttendance(id) {

    fetch("/attendance/" + id, {

    method: "PUT",
    credentials: "include"

})

    .then(res => res.json())

    .then(() => {

        alert("Attendance Marked Successfully");

        location.reload();

    });

}

// ===============================
// CERTIFICATE
// ===============================

function generateCertificate(id) {

    window.open(
        "certificate.html?id=" + id,
        "_blank"
    );

}

// ===============================
// LOGOUT
// ===============================

function logout() {

    fetch("/logout")

    .then(() => {

        window.location.href = "admin-login.html";

    });

}
function deleteStudent(id) {

    if (!confirm("Delete this registration?")) return;

    fetch("/student/" + id, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {

        if (data.success) {
            alert("Student deleted successfully");
            location.reload();
        } else {
            alert("Delete failed");
        }

    });

}
const menuBtn = document.getElementById("menuBtn");

if(menuBtn){

menuBtn.onclick=function(){

document
.querySelector(".sidebar")
.classList.toggle("active");

};

}
const menuBtn = document.getElementById("menuBtn");

if(menuBtn){

menuBtn.onclick = function(){

document
.querySelector(".sidebar")
.classList.toggle("active");

};

}