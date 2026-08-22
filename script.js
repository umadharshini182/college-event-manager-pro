// ===========================================
// COLLEGE EVENT MANAGER
// SCRIPT.JS
// ===========================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("SCRIPT.JS LOADED");

    // ==========================================
    // LOADER
    // ==========================================

    const loader = document.getElementById("loader");

    if (loader) {
        loader.style.display = "none";
    }


    // ==========================================
    // EVENT FROM URL
    // ==========================================

    const params = new URLSearchParams(
        window.location.search
    );

    const selectedEvent = params.get("event");

    const eventBox =
        document.getElementById("event");

    if (eventBox && selectedEvent) {
        eventBox.value = selectedEvent;
    }


    // ==========================================
    // EVENT FEE
    // ==========================================

    const fee =
        document.getElementById("fee");

    if (fee) {
        fee.textContent = "₹1000";
    }


    // ==========================================
    // REGISTRATION FORM
    // ==========================================

    const form =
        document.getElementById("registrationForm");

    if (form) {

        console.log("REGISTRATION FORM FOUND");

        form.addEventListener(
            "submit",
            function (e) {

                e.preventDefault();

                const fullnameInput =
                    form.querySelector(
                        '[name="fullname"]'
                    );

                const emailInput =
                    form.querySelector(
                        '[name="email"]'
                    );

                const collegeInput =
                    form.querySelector(
                        '[name="college"]'
                    );

                const departmentInput =
                    document.getElementById(
                        "department"
                    );

                const yearInput =
                    document.getElementById(
                        "year"
                    );

                const eventInput =
                    document.getElementById(
                        "event"
                    );


                const studentData = {

                    fullname:
                        fullnameInput
                            ? fullnameInput.value.trim()
                            : "",

                    email:
                        emailInput
                            ? emailInput.value.trim()
                            : "",

                    college:
                        collegeInput
                            ? collegeInput.value.trim()
                            : "",

                    department:
                        departmentInput
                            ? departmentInput.value
                            : "",

                    year:
                        yearInput
                            ? yearInput.value
                            : "",

                    event:
                        eventInput
                            ? eventInput.value
                            : ""
                };


                console.log(
                    "REGISTRATION DATA:",
                    studentData
                );


                if (
                    !studentData.fullname ||
                    !studentData.email ||
                    !studentData.college ||
                    !studentData.department ||
                    !studentData.year ||
                    !studentData.event
                ) {

                    alert(
                        "Please fill all registration details."
                    );

                    return;
                }


                // SAVE UNDER BOTH NAMES
                // So payment.js can find it

                localStorage.setItem(
                    "studentData",
                    JSON.stringify(studentData)
                );

                localStorage.setItem(
                    "registrationData",
                    JSON.stringify(studentData)
                );


                // BACKUP INDIVIDUAL VALUES

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


                console.log(
                    "STUDENT DATA SAVED SUCCESSFULLY"
                );


                // CONFIRM DATA EXISTS BEFORE REDIRECT

                const checkSavedData =
                    localStorage.getItem(
                        "studentData"
                    );

                if (!checkSavedData) {

                    alert(
                        "Unable to save registration data."
                    );

                    return;
                }


                // OPEN PAYMENT PAGE

                window.location.href =
                    "payment.html";

            }
        );

    } else {

        console.log(
            "REGISTRATION FORM NOT FOUND"
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


            const days =
                Math.floor(
                    distance /
                    (1000 * 60 * 60 * 24)
                );


            const hours =
                Math.floor(
                    (
                        distance %
                        (1000 * 60 * 60 * 24)
                    ) /
                    (1000 * 60 * 60)
                );


            const minutes =
                Math.floor(
                    (
                        distance %
                        (1000 * 60 * 60)
                    ) /
                    (1000 * 60)
                );


            const seconds =
                Math.floor(
                    (
                        distance %
                        (1000 * 60)
                    ) /
                    1000
                );


            daysElement.textContent = days;
            hoursElement.textContent = hours;
            minutesElement.textContent = minutes;
            secondsElement.textContent = seconds;

        }


        updateCountdown();

        setInterval(
            updateCountdown,
            1000
        );

    }

});


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


    for (
        let i = 0;
        i < rows.length;
        i++
    ) {

        const text =
            rows[i].innerText.toLowerCase();


        rows[i].style.display =
            text.indexOf(input) > -1
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


    const total =
        data.length;


    let paid = 0;
    let pending = 0;
    let revenue = 0;


    data.forEach(function (student) {

        if (
            student.payment_status ===
            "Paid"
        ) {

            paid++;

            revenue += Number(
                student.amount || 0
            );

        } else {

            pending++;

        }

    });


    const count =
        document.getElementById("count");

    const paidElement =
        document.getElementById("paid");

    const pendingElement =
        document.getElementById("pending");

    const revenueElement =
        document.getElementById("revenue");


    if (count) {
        count.textContent = total;
    }

    if (paidElement) {
        paidElement.textContent = paid;
    }

    if (pendingElement) {
        pendingElement.textContent =
            pending;
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

        const eventName =
            student.event ||
            "Unknown";


        if (events[eventName]) {

            events[eventName]++;

        } else {

            events[eventName] = 1;

        }

    });


    return events;

}


// ===========================================
// TRENDING EVENT
// ===========================================

function updateTrendingEvent(data) {

    if (!data || data.length === 0) {
        return;
    }


    const events =
        getEventCounts(data);


    let max = 0;
    let trending = "-";


    for (const event in events) {

        if (events[event] > max) {

            max =
                events[event];

            trending =
                event;

        }

    }


    const trendingElement =
        document.getElementById("trending");


    if (trendingElement) {

        trendingElement.textContent =
            trending;

    }

}