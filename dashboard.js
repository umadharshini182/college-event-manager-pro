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


        if (!response.ok) {

            throw new Error(
                "Unable to load dashboard data."
            );

        }


        const data = await response.json();


        students = Array.isArray(data)
            ? data
            : [];


        updateCards();

        updateCharts();

    }

    catch (err) {

        console.log(
            "Dashboard loading error:",
            err
        );

    }

}


// ======================================================
// UPDATE DASHBOARD CARDS
// ======================================================

function updateCards() {


    // ==================================================
    // TOTAL STUDENTS
    // ==================================================

    const count =
        document.getElementById("count");


    if (count) {

        count.innerText =
            students.length;

    }


    // ==================================================
    // REVENUE
    // ==================================================

    let revenue = 0;


    students.forEach(student => {

        const paymentStatus =
            String(
                student.payment_status ||
                student.paymentStatus ||
                ""
            ).trim().toLowerCase();


        if (
            paymentStatus === "paid" ||
            paymentStatus === "successful" ||
            paymentStatus === "completed"
        ) {

            revenue += Number(

                student.amount ||
                student.payment_amount ||
                student.paymentAmount ||
                0

            );

        }

    });


    const revenueElement =
        document.getElementById("revenue");


    if (revenueElement) {

        revenueElement.innerText =
            "₹" +
            revenue.toLocaleString("en-IN");

    }


    // ==================================================
    // PAID
    // ==================================================

    const paid =
        students.filter(student => {

            const status =
                String(

                    student.payment_status ||
                    student.paymentStatus ||
                    ""

                ).trim().toLowerCase();


            return (

                status === "paid" ||
                status === "successful" ||
                status === "completed"

            );

        }).length;


    const paidElement =
        document.getElementById("paid");


    if (paidElement) {

        paidElement.innerText =
            paid;

    }


    // ==================================================
    // PENDING
    // ==================================================

    const pending =
        students.length -
        paid;


    const pendingElement =
        document.getElementById("pending");


    if (pendingElement) {

        pendingElement.innerText =
            pending;

    }


    // ==================================================
    // PARTICIPATING COLLEGES
    // ==================================================

    const uniqueColleges =
        new Set();


    students.forEach(student => {

        if (

            student.college &&
            String(student.college).trim() !== ""

        ) {

            uniqueColleges.add(
                String(student.college).trim()
            );

        }

    });


    const colleges =
        document.getElementById("colleges");


    if (colleges) {

        colleges.innerText =
            uniqueColleges.size;

    }


    // ==================================================
    // TOP EVENT
    // ==================================================

    const eventCount = {};


    students.forEach(student => {

        const event =
            student.event ||
            "Unknown";


        eventCount[event] =
            (eventCount[event] || 0) + 1;

    });


    let topEvent = "-";

    let highest = 0;


    for (const event in eventCount) {

        if (
            eventCount[event] >
            highest
        ) {

            highest =
                eventCount[event];


            topEvent =
                event;

        }

    }


    const topEventElement =
        document.getElementById("topEvent");


    if (topEventElement) {

        topEventElement.innerText =
            topEvent;

    }


    const bestEvent =
        document.getElementById("bestEvent");


    if (bestEvent) {

        bestEvent.innerText =
            topEvent;

    }


    // ==================================================
    // TOP COLLEGE
    // ==================================================

    const collegeCount = {};


    students.forEach(student => {

        const college =
            student.college ||
            "Unknown";


        collegeCount[college] =
            (collegeCount[college] || 0) + 1;

    });


    let topCollege = "-";

    let maxCollege = 0;


    for (const college in collegeCount) {

        if (
            collegeCount[college] >
            maxCollege
        ) {

            maxCollege =
                collegeCount[college];


            topCollege =
                college;

        }

    }


    const topCollegeElement =
        document.getElementById("topCollege");


    if (topCollegeElement) {

        topCollegeElement.innerText =
            topCollege;

    }


    // ==================================================
    // TODAY'S REGISTRATIONS
    // ==================================================

    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const todayStudents =
        students.filter(student => {

            const dateValue =
                student.createdAt ||
                student.created_at ||
                student.paymentDate ||
                student.payment_date;


            if (!dateValue) {

                return false;

            }


            const studentDate =
                new Date(dateValue);


            if (
                isNaN(
                    studentDate.getTime()
                )
            ) {

                return false;

            }


            studentDate.setHours(
                0,
                0,
                0,
                0
            );


            return (
                studentDate.getTime() ===
                today.getTime()
            );

        });


    const todayRegistrations =
        document.getElementById(
            "todayRegistrations"
        );


    if (todayRegistrations) {

        todayRegistrations.innerText =
            todayStudents.length;

    }


    // ==================================================
    // TODAY'S REVENUE
    // ==================================================

    const todayRevenue =
        todayStudents.reduce(
            (sum, student) => {

                const status =
                    String(

                        student.payment_status ||
                        student.paymentStatus ||
                        ""

                    ).trim().toLowerCase();


                if (

                    status === "paid" ||
                    status === "successful" ||
                    status === "completed"

                ) {

                    return sum +
                        Number(

                            student.amount ||
                            student.payment_amount ||
                            student.paymentAmount ||
                            0

                        );

                }


                return sum;

            },
            0
        );


    const todayRevenueElement =
        document.getElementById(
            "todayRevenue"
        );


    if (todayRevenueElement) {

        todayRevenueElement.innerText =
            "₹" +
            todayRevenue.toLocaleString(
                "en-IN"
            );

    }


    // ==================================================
    // ATTENDANCE
    // ==================================================

    const attendance =
        students.filter(student => {

            return (
                String(
                    student.attendance || ""
                ).trim().toLowerCase() ===
                "present"
            );

        }).length;


    const attendanceCount =
        document.getElementById(
            "attendanceCount"
        );


    if (attendanceCount) {

        attendanceCount.innerText =
            attendance;

    }


    // ==================================================
    // CERTIFICATES GENERATED
    // ==================================================

    const certificates =
        students.filter(student => {

            const certificateStatus =
                String(

                    student.certificate_status ||
                    student.certificateStatus ||
                    ""

                ).trim().toLowerCase();


            return (

                certificateStatus ===
                "generated"

            );

        }).length;


    const certificateGenerated =
        document.getElementById(
            "certificateGenerated"
        );


    const certificateCount =
        document.getElementById(
            "certificateCount"
        );


    if (certificateGenerated) {

        certificateGenerated.innerText =
            certificates;

    }


    if (certificateCount) {

        certificateCount.innerText =
            certificates;

    }

}


// ======================================================
// UPDATE CHARTS
// ======================================================

function updateCharts() {


    // ==================================================
    // EVENT DATA
    // ==================================================

    const eventData = {};


    students.forEach(student => {

        const event =
            student.event ||
            "Unknown";


        eventData[event] =
            (eventData[event] || 0) + 1;

    });


    // ==================================================
    // DESTROY OLD CHARTS
    // ==================================================

    if (barChart) {

        barChart.destroy();

        barChart = null;

    }


    if (pieChart) {

        pieChart.destroy();

        pieChart = null;

    }


    // ==================================================
    // CALCULATE PAID AND PENDING
    // ==================================================

    const paid =
        students.filter(student => {

            const status =
                String(

                    student.payment_status ||
                    student.paymentStatus ||
                    ""

                ).trim().toLowerCase();


            return (

                status === "paid" ||
                status === "successful" ||
                status === "completed"

            );

        }).length;


    const pending =
        students.length -
        paid;


    const collegeCount =
        new Set(

            students
                .map(
                    student =>
                        student.college
                )
                .filter(Boolean)

        ).size;


    // ==================================================
    // BAR CHART
    // ==================================================

    const barCanvas =
        document.getElementById(
            "barChart"
        );


    if (
        barCanvas &&
        typeof Chart !== "undefined"
    ) {

        barChart =
            new Chart(
                barCanvas,
                {

                    type: "bar",

                    data: {

                        labels: [

                            "Students",
                            "Paid",
                            "Pending",
                            "Colleges"

                        ],

                        datasets: [

                            {

                                label:
                                    "Statistics",

                                data: [

                                    students.length,
                                    paid,
                                    pending,
                                    collegeCount

                                ]

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        plugins: {

                            legend: {

                                display: false

                            }

                        }

                    }

                }
            );

    }


    // ==================================================
    // PIE CHART
    // ==================================================

    const pieCanvas =
        document.getElementById(
            "pieChart"
        );


    if (
        pieCanvas &&
        typeof Chart !== "undefined"
    ) {

        pieChart =
            new Chart(
                pieCanvas,
                {

                    type: "pie",

                    data: {

                        labels:
                            Object.keys(
                                eventData
                            ),

                        datasets: [

                            {

                                data:
                                    Object.values(
                                        eventData
                                    )

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false

                    }

                }
            );

    }

}


// ======================================================
// SIDEBAR
// ======================================================

function initializeSidebar() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );


    const menuBtn =
        document.getElementById(
            "menuBtn"
        );


    const closeBtn =
        document.getElementById(
            "closeSidebar"
        );


    const overlay =
        document.getElementById(
            "overlay"
        );


    if (
        menuBtn &&
        sidebar &&
        overlay
    ) {

        menuBtn.onclick =
            () => {

                sidebar.classList.add(
                    "active"
                );

                overlay.classList.add(
                    "show"
                );

            };

    }


    if (
        closeBtn &&
        sidebar &&
        overlay
    ) {

        closeBtn.onclick =
            () => {

                sidebar.classList.remove(
                    "active"
                );

                overlay.classList.remove(
                    "show"
                );

            };

    }


    if (
        overlay &&
        sidebar
    ) {

        overlay.onclick =
            () => {

                sidebar.classList.remove(
                    "active"
                );

                overlay.classList.remove(
                    "show"
                );

            };

    }

}


// ======================================================
// NOTIFICATIONS
// ======================================================

function initializeNotifications() {

    const bell =
        document.getElementById(
            "notificationBtn"
        );


    const dropdown =
        document.getElementById(
            "notificationDropdown"
        );


    if (
        !bell ||
        !dropdown
    ) {

        return;

    }


    bell.onclick =
        (event) => {

            event.stopPropagation();

            dropdown.classList.toggle(
                "show"
            );

        };


    document.addEventListener(
        "click",
        (event) => {

            if (

                !dropdown.contains(
                    event.target
                )

                &&

                !bell.contains(
                    event.target
                )

            ) {

                dropdown.classList.remove(
                    "show"
                );

            }

        }
    );

}


// ======================================================
// LOGOUT
// ======================================================

function logout() {

    if (
        !confirm(
            "Logout?"
        )
    ) {

        return;

    }


    fetch(
        "/logout",
        {

            credentials:
                "include"

        }
    )

    .then(
        () => {

            window.location.href =
                "admin-login.html";

        }
    )

    .catch(
        error => {

            console.log(
                "Logout error:",
                error
            );

        }
    );

}


// ======================================================
// AUTO REFRESH
// ======================================================

setInterval(
    () => {

        loadDashboard();

    },
    30000
);