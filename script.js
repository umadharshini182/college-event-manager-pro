// ===========================================
// COLLEGE EVENT MANAGER
// script.js
// ===========================================

window.addEventListener("load", function () {

    // ==========================================
    // LOADER
    // ==========================================

    const loader = document.getElementById("loader");

    if (loader) {
        loader.style.display = "none";
    }


    // ==========================================
    // EVENT NAME FROM URL
    // ==========================================

    const params = new URLSearchParams(
        window.location.search
    );

    const selectedEvent = params.get("event");

    const eventBox = document.getElementById("event");

    if (eventBox && selectedEvent) {
        eventBox.value = selectedEvent;
    }


    // ==========================================
    // EVENT FEE
    // ==========================================

    const fee = document.getElementById("fee");

    if (fee) {
        fee.textContent = "₹1000";
    }


    // ==========================================
    // REGISTRATION FORM
    // ==========================================
    const form = document.getElementById("registrationForm");

if (form) {

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const studentData = {
            fullname: document.querySelector('input[name="fullname"]').value.trim(),
            email: document.querySelector('input[name="email"]').value.trim(),
            college: document.querySelector('input[name="college"]').value.trim(),
            department: document.getElementById("department").value,
            year: document.getElementById("year").value,
            event: document.getElementById("event").value
        };

        console.log("SAVING STUDENT DATA:", studentData);

        localStorage.setItem(
            "studentData",
            JSON.stringify(studentData)
        );

        localStorage.setItem(
            "registrationData",
            JSON.stringify(studentData)
        );

        // IMPORTANT: check immediately
        console.log(
            "SAVED studentData:",
            localStorage.getItem("studentData")
        );

        console.log(
            "SAVED registrationData:",
            localStorage.getItem("registrationData")
        );

        window.location.href = "payment.html";

    });

}
    if (form) {

        form.addEventListener(
            "submit",
            function (e) {

                e.preventDefault();


                const studentData = {

                    fullname:
                        document
                            .querySelector(
                                'input[name="fullname"]'
                            )
                            .value
                            .trim(),

                    email:
                        document
                            .querySelector(
                                'input[name="email"]'
                            )
                            .value
                            .trim(),

                    college:
                        document
                            .querySelector(
                                'input[name="college"]'
                            )
                            .value
                            .trim(),

                    department:
                        document
                            .getElementById("department")
                            .value,

                    year:
                        document
                            .getElementById("year")
                            .value,

                    event:
                        document
                            .getElementById("event")
                            .value
                };


                // Check data

                console.log(
                    "SAVING REGISTRATION DATA:",
                    studentData
                );


                // IMPORTANT:
                // Save using BOTH names so all
                // payment and receipt pages can use it

                localStorage.setItem(
                    "studentData",
                    JSON.stringify(studentData)
                );

                localStorage.setItem(
                    "registrationData",
                    JSON.stringify(studentData)
                );


                // Also save individual values

                localStorage.setItem(
                    "fullname",
                    studentData.fullname
                );

                localStorage.setItem(
                    "email",
                    studentData.email
                );

                localStorage.setItem(
                    "college",
                    studentData.college
                );

                localStorage.setItem(
                    "department",
                    studentData.department
                );

                localStorage.setItem(
                    "year",
                    studentData.year
                );

                localStorage.setItem(
                    "event",
                    studentData.event
                );


                // Go to payment page

                window.location.href =
                    "payment.html";

            }
        );

    }


    // ==========================================
    // COUNTDOWN
    // ==========================================

    const daysElement =
        document.getElementById("days");

    const hoursElement =
        document.getElementById("hours");

    const minutesElement =
        document.getElementById("minutes");

    const secondsElement =
        document.getElementById("seconds");


    if (
        daysElement &&
        hoursElement &&
        minutesElement &&
        secondsElement
    ) {

        const eventDate =
            new Date(
                "December 31, 2027 10:00:00"
            ).getTime();


        function updateCountdown() {

            const now =
                new Date().getTime();

            const distance =
                eventDate - now;


            if (distance <= 0) {

                daysElement.textContent = "0";
                hoursElement.textContent = "0";
                minutesElement.textContent = "0";
                secondsElement.textContent = "0";

                return;

            }


            const days = Math.floor(
                distance /
                (1000 * 60 * 60 * 24)
            );


            const hours = Math.floor(
                (
                    distance %
                    (1000 * 60 * 60 * 24)
                ) /
                (1000 * 60 * 60)
            );


            const minutes = Math.floor(
                (
                    distance %
                    (1000 * 60 * 60)
                ) /
                (1000 * 60)
            );


            const seconds = Math.floor(
                (
                    distance %
                    (1000 * 60)
                ) /
                1000
            );


            daysElement.textContent =
                String(days).padStart(2, "0");

            hoursElement.textContent =
                String(hours).padStart(2, "0");

            minutesElement.textContent =
                String(minutes).padStart(2, "0");

            secondsElement.textContent =
                String(seconds).padStart(2, "0");

        }


        updateCountdown();

        setInterval(
            updateCountdown,
            1000
        );

    }


});


// ===========================================
// SUCCESS PAGE
// ===========================================

const studentName =
    document.getElementById("studentName");

const regId =
    document.getElementById("registrationId");

const eventName =
    document.getElementById("eventName");


const savedStudentData =
    JSON.parse(
        localStorage.getItem("studentData")
    ) || {};


if (studentName) {

    studentName.textContent =
        savedStudentData.fullname || "";

}


if (regId) {

    regId.textContent =
        localStorage.getItem("registrationId") ||
        "";

}


if (eventName) {

    eventName.textContent =
        savedStudentData.event || "";

}


// ===========================================
// SEARCH STUDENT
// ===========================================

function searchStudent() {

    const searchElement =
        document.getElementById("search");

    const table =
        document.getElementById("studentTable");


    if (!searchElement || !table) {
        return;
    }


    const input =
        searchElement.value.toLowerCase();

    const rows =
        table.getElementsByTagName("tr");


    for (let i = 0; i < rows.length; i++) {

        const text =
            rows[i].innerText.toLowerCase();


        rows[i].style.display =
            text.includes(input)
                ? ""
                : "none";

    }

}


// ===========================================
// DASHBOARD COUNTS
// ===========================================

function updateDashboardCounts(data) {

    if (!data) {
        return;
    }


    const total = data.length;

    let paid = 0;
    let pending = 0;
    let revenue = 0;


    data.forEach(function (student) {

        if (
            student.payment_status === "Paid"
        ) {

            paid++;

            revenue += Number(
                student.amount || 0
            );

        } else {

            pending++;

        }

    });


    const countElement =
        document.getElementById("count");

    const paidElement =
        document.getElementById("paid");

    const pendingElement =
        document.getElementById("pending");

    const revenueElement =
        document.getElementById("revenue");


    if (countElement) {
        countElement.textContent = total;
    }

    if (paidElement) {
        paidElement.textContent = paid;
    }

    if (pendingElement) {
        pendingElement.textContent = pending;
    }

    if (revenueElement) {
        revenueElement.textContent =
            "₹" +
            revenue.toLocaleString("en-IN");
    }

}


// ===========================================
// EVENT COUNTS
// ===========================================

function getEventCounts(data) {

    const events = {};


    data.forEach(function (student) {

        if (!events[student.event]) {

            events[student.event] = 0;

        }

        events[student.event]++;

    });


    return events;

}


// ===========================================
// TRENDING EVENT
// ===========================================

function updateTrendingEvent(data) {

    const events =
        getEventCounts(data);

    let max = 0;

    let trending = "-";


    for (const event in events) {

        if (events[event] > max) {

            max = events[event];

            trending = event;

        }

    }


    const trendingElement =
        document.getElementById("trending");


    if (trendingElement) {

        trendingElement.textContent =
            trending;

    }

}