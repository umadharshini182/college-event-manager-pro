// ===========================================
// COLLEGE EVENT MANAGER
// script.js
// ===========================================

window.addEventListener("load", function () {

    // ==========================
    // LOADER
    // ==========================

    const loader = document.getElementById("loader");

    if (loader) {
        loader.style.display = "none";
    }


    // ==========================
    // EVENT NAME
    // ==========================

    const params = new URLSearchParams(
        window.location.search
    );

    const selectedEvent = params.get("event");

    const eventBox = document.getElementById("event");

    if (eventBox && selectedEvent) {
        eventBox.value = selectedEvent;
    }


    // ==========================
    // EVENT FEE
    // ==========================

    const fee = document.getElementById("fee");

    if (fee) {
        fee.innerHTML = "₹1000";
    }


    // ==========================
    // REGISTRATION FORM
    // ==========================

    const form = document.getElementById(
        "registrationForm"
    );

    if (form) {

        form.addEventListener(
            "submit",
            function (e) {

                e.preventDefault();


                const fullname =
                    document.querySelector(
                        'input[name="fullname"]'
                    ).value.trim();


                const email =
                    document.querySelector(
                        'input[name="email"]'
                    ).value.trim();


                const college =
                    document.querySelector(
                        'input[name="college"]'
                    ).value.trim();


                const department =
                    document.getElementById(
                        "department"
                    ).value;


                const year =
                    document.getElementById(
                        "year"
                    ).value;


                const event =
                    document.getElementById(
                        "event"
                    ).value;


                // ==========================
                // STUDENT DATA
                // ==========================

                const studentData = {

                    fullname: fullname,

                    email: email,

                    college: college,

                    department: department,

                    year: year,

                    event: event

                };


                // ==========================
                // SAVE COMPLETE DATA
                // ==========================

                localStorage.setItem(
                    "studentData",
                    JSON.stringify(studentData)
                );


                localStorage.setItem(
                    "registrationData",
                    JSON.stringify(studentData)
                );


                // ==========================
                // SAVE INDIVIDUAL DATA
                // ==========================

                localStorage.setItem(
                    "fullname",
                    fullname
                );


                localStorage.setItem(
                    "email",
                    email
                );


                localStorage.setItem(
                    "college",
                    college
                );


                localStorage.setItem(
                    "department",
                    department
                );


                localStorage.setItem(
                    "year",
                    year
                );


                localStorage.setItem(
                    "event",
                    event
                );


                // ==========================
                // CHECK DATA
                // ==========================

                console.log(
                    "REGISTRATION DATA SAVED:",
                    studentData
                );


                // ==========================
                // GO TO PAYMENT
                // ==========================

                window.location.href =
                    "payment.html";

            }
        );

    }


    // ==========================
    // COUNTDOWN
    // ==========================

    if (

        document.getElementById("days") &&

        document.getElementById("hours") &&

        document.getElementById("minutes") &&

        document.getElementById("seconds")

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

                document.getElementById(
                    "days"
                ).textContent = "0";

                document.getElementById(
                    "hours"
                ).textContent = "0";

                document.getElementById(
                    "minutes"
                ).textContent = "0";

                document.getElementById(
                    "seconds"
                ).textContent = "0";

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


            document.getElementById(
                "days"
            ).textContent = days;


            document.getElementById(
                "hours"
            ).textContent =
                String(hours).padStart(
                    2,
                    "0"
                );


            document.getElementById(
                "minutes"
            ).textContent =
                String(minutes).padStart(
                    2,
                    "0"
                );


            document.getElementById(
                "seconds"
            ).textContent =
                String(seconds).padStart(
                    2,
                    "0"
                );

        }


        // Run immediately

        updateCountdown();


        // Update every second

        setInterval(
            updateCountdown,
            1000
        );

    }

});


// ===========================================
// PAYMENT PAGE
// ===========================================

const paymentForm =
    document.getElementById("paymentForm");


if (paymentForm) {

    paymentForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            const fullname =
                localStorage.getItem(
                    "fullname"
                );


            const email =
                localStorage.getItem(
                    "email"
                );


            const college =
                localStorage.getItem(
                    "college"
                );


            const department =
                localStorage.getItem(
                    "department"
                );


            const year =
                localStorage.getItem(
                    "year"
                );


            const event =
                localStorage.getItem(
                    "event"
                );


            fetch(
                "https://college-event-manager-pro.onrender.com/register",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        fullname: fullname,

                        email: email,

                        college: college,

                        department: department,

                        year: year,

                        event: event

                    })

                }
            )

            .then(function (response) {

                return response.json();

            })

            .then(function (data) {

                if (data.success) {

                    localStorage.setItem(
                        "registrationId",
                        data.registrationId
                    );


                    window.location.href =
                        "registration-success.html";

                }

                else {

                    alert(
                        "Registration Failed"
                    );

                }

            })

            .catch(function () {

                alert(
                    "Server Error"
                );

            });

        }
    );

}


// ===========================================
// SUCCESS PAGE
// ===========================================

const studentName =
    document.getElementById(
        "studentName"
    );


const regId =
    document.getElementById(
        "registrationId"
    );


const eventName =
    document.getElementById(
        "eventName"
    );


if (studentName) {

    studentName.innerHTML =
        localStorage.getItem(
            "fullname"
        ) || "";

}


if (regId) {

    regId.innerHTML =
        localStorage.getItem(
            "registrationId"
        ) || "";

}


if (eventName) {

    eventName.innerHTML =
        localStorage.getItem(
            "event"
        ) || "";

}


// ===========================================
// SEARCH STUDENT
// ===========================================

function searchStudent() {

    const searchInput =
        document.getElementById(
            "search"
        );


    const table =
        document.getElementById(
            "studentTable"
        );


    if (!searchInput || !table) {

        return;

    }


    const input =
        searchInput.value.toLowerCase();


    const rows =
        table.getElementsByTagName(
            "tr"
        );


    for (
        let i = 0;
        i < rows.length;
        i++
    ) {

        const text =
            rows[i].innerText.toLowerCase();


        if (
            text.indexOf(input) > -1
        ) {

            rows[i].style.display = "";

        }

        else {

            rows[i].style.display = "none";

        }

    }

}


// ===========================================
// STUDENT COUNT
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


    data.forEach(
        function (student) {

            if (
                student.payment_status ===
                "Paid"
            ) {

                paid++;

                revenue += Number(
                    student.amount
                ) || 0;

            }

            else {

                pending++;

            }

        }
    );


    const countElement =
        document.getElementById(
            "count"
        );


    const paidElement =
        document.getElementById(
            "paid"
        );


    const pendingElement =
        document.getElementById(
            "pending"
        );


    const revenueElement =
        document.getElementById(
            "revenue"
        );


    if (countElement) {

        countElement.innerText =
            total;

    }


    if (paidElement) {

        paidElement.innerText =
            paid;

    }


    if (pendingElement) {

        pendingElement.innerText =
            pending;

    }


    if (revenueElement) {

        revenueElement.innerText =
            "₹" + revenue;

    }

}


// ===========================================
// EVENT COUNT
// ===========================================

function getEventCounts(data) {

    const events = {};


    data.forEach(
        function (student) {

            if (
                events[student.event]
            ) {

                events[student.event]++;

            }

            else {

                events[student.event] = 1;

            }

        }
    );


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

        if (
            events[event] > max
        ) {

            max =
                events[event];


            trending =
                event;

        }

    }


    const trendingElement =
        document.getElementById(
            "trending"
        );


    if (trendingElement) {

        trendingElement.innerText =
            trending;

    }

}