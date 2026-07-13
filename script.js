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

    const params = new URLSearchParams(window.location.search);
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

    const form = document.getElementById("registrationForm");

    if (form) {

        form.addEventListener("submit", function (e) {

            e.preventDefault();

            const fullname = document.querySelector('input[name="fullname"]').value;
            const email = document.querySelector('input[name="email"]').value;
            const college = document.querySelector('input[name="college"]').value;
            const department = document.getElementById("department").value;
            const year = document.getElementById("year").value;
            const event = document.getElementById("event").value;

            localStorage.setItem("fullname", fullname);
            localStorage.setItem("email", email);
            localStorage.setItem("college", college);
            localStorage.setItem("department", department);
            localStorage.setItem("year", year);
            localStorage.setItem("event", event);

            window.location.href = "payment.html";

        });

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

        const eventDate = new Date("December 31, 2027 10:00:00").getTime();

        setInterval(function () {

            const now = new Date().getTime();

            const distance = eventDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));

            const hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) /
                (1000 * 60 * 60)
            );

            const minutes = Math.floor(
                (distance % (1000 * 60 * 60)) /
                (1000 * 60)
            );

            const seconds = Math.floor(
                (distance % (1000 * 60)) /
                1000
            );

            document.getElementById("days").textContent = days;
            document.getElementById("hours").textContent = hours;
            document.getElementById("minutes").textContent = minutes;
            document.getElementById("seconds").textContent = seconds;

        }, 1000);

    }

});
// ===========================================
// PAYMENT PAGE
// ===========================================

const paymentForm = document.getElementById("paymentForm");

if (paymentForm) {

    paymentForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const fullname = localStorage.getItem("fullname");
        const email = localStorage.getItem("email");
        const college = localStorage.getItem("college");
        const department = localStorage.getItem("department");
        const year = localStorage.getItem("year");
        const event = localStorage.getItem("event");

        fetch("http://localhost:5000/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                fullname,
                email,
                college,
                department,
                year,
                event

            })

        })

        .then(response => response.json())

        .then(data => {

            if (data.success) {

                localStorage.setItem(
                    "registrationId",
                    data.registrationId
                );

                window.location.href = "registration-success.html";

            } else {

                alert("Registration Failed");

            }

        })

        .catch(() => {

            alert("Server Error");

        });

    });

}

// ===========================================
// SUCCESS PAGE
// ===========================================

const studentName = document.getElementById("studentName");
const regId = document.getElementById("registrationId");
const eventName = document.getElementById("eventName");

if (studentName) {

    studentName.innerHTML =
        localStorage.getItem("fullname") || "";

}

if (regId) {

    regId.innerHTML =
        localStorage.getItem("registrationId") || "";

}

if (eventName) {

    eventName.innerHTML =
        localStorage.getItem("event") || "";

}
// ===========================================
// SEARCH STUDENT
// ===========================================

function searchStudent() {

    const input = document
        .getElementById("search")
        .value
        .toLowerCase();

    const table =
        document.getElementById("studentTable");

    if (!table) return;

    const rows = table.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {

        const text =
            rows[i].innerText.toLowerCase();

        if (text.indexOf(input) > -1) {

            rows[i].style.display = "";

        } else {

            rows[i].style.display = "none";

        }

    }

}

// ===========================================
// STUDENT COUNT
// ===========================================

function updateDashboardCounts(data) {

    if (!data) return;

    const total = data.length;

    let paid = 0;
    let pending = 0;
    let revenue = 0;

    data.forEach(student => {

        if (student.payment_status === "Paid") {

            paid++;
            revenue += Number(student.amount);

        } else {

            pending++;

        }

    });

    if (document.getElementById("count"))
        document.getElementById("count").innerText = total;

    if (document.getElementById("paid"))
        document.getElementById("paid").innerText = paid;

    if (document.getElementById("pending"))
        document.getElementById("pending").innerText = pending;

    if (document.getElementById("revenue"))
        document.getElementById("revenue").innerText = "₹" + revenue;

}

// ===========================================
// EVENT COUNT
// ===========================================

function getEventCounts(data){

    let events = {};

    data.forEach(student=>{

        if(events[student.event]){

            events[student.event]++;

        }else{

            events[student.event]=1;

        }

    });

    return events;

}

// ===========================================
// TRENDING EVENT
// ===========================================

function updateTrendingEvent(data){

    const events=getEventCounts(data);

    let max=0;

    let trending="-";

    for(let event in events){

        if(events[event]>max){

            max=events[event];

            trending=event;

        }

    }

    if(document.getElementById("trending")){

        document.getElementById("trending").innerText=trending;

    }

}