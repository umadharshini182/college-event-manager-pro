// ======================================================
// COLLEGE EVENT MANAGER
// EVENTS.JS
// Railway + MySQL Version
// ======================================================

let events = [];
let editingId = null;

// ======================================================
// PAGE LOAD
// ======================================================

window.addEventListener("load", () => {

    checkLogin();

    initializeSidebar();

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

        loadEvents();

    }

    catch(err){

        console.log(err);

        window.location.href="admin-login.html";

    }

}

// ======================================================
// LOAD EVENTS
// ======================================================

async function loadEvents(){

    try{

        const response = await fetch("/events",{

            credentials:"include"

        });

        events = await response.json();

        updateCards();

        loadTable();

    }

    catch(err){

        console.log(err);

    }

}
// ======================================================
// UPDATE DASHBOARD CARDS
// ======================================================

function updateCards(){

    document.getElementById("totalEvents").innerText =
    events.length;

    const active =
    events.filter(event=>event.status==="Open").length;

    document.getElementById("activeEvents").innerText =
    active;

    document.getElementById("upcomingEvents").innerText =
    events.length;

    let revenue = 0;

    events.forEach(event=>{

        revenue += Number(event.fee || 0);

    });

    const revenueBox =
    document.getElementById("eventRevenue");

    if(revenueBox){

        revenueBox.innerText = "₹" + revenue;

    }

}

// ======================================================
// LOAD EVENT TABLE
// ======================================================

function loadTable(){

    const tbody =
    document.getElementById("eventTable");

    tbody.innerHTML = "";

    events.forEach(event=>{

        tbody.innerHTML += `

<tr>

<td>${event.id}</td>

<td>${event.event_name}</td>

<td>${event.event_date.substring(0,10)}</td>

<td>${event.venue}</td>

<td>₹${event.fee}</td>

<td>

<span class="${
event.status==="Open"
?
"paid"
:
"pending"
}">

${event.status}

</span>

</td>

<td>

<button
class="action-btn certificate-btn"
onclick="editEvent(${event.id})">

Edit

</button>

<button
class="action-btn delete-btn"
onclick="deleteEvent(${event.id})">

Delete

</button>

</td>

</tr>

`;

    });

}
// ======================================================
// ADD EVENT
// ======================================================

async function saveEvent(){

    const event_name =
    document.getElementById("eventName").value.trim();

    const event_date =
    document.getElementById("eventDate").value;

    const venue =
    document.getElementById("eventVenue").value.trim();

    const fee =
    document.getElementById("eventFee").value;

    const status =
    document.getElementById("eventStatus").value;

    if(
        event_name==="" ||
        event_date==="" ||
        venue==="" ||
        fee===""
    ){

        alert("Please fill all fields.");

        return;

    }

    const response = await fetch("/events",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        credentials:"include",

        body:JSON.stringify({

            event_name,
            event_date,
            venue,
            fee,
            status

        })

    });

    const data = await response.json();

    if(data.success){

        alert("Event Added Successfully");

        clearForm();

        loadEvents();

    }

    else{

        alert("Unable to Add Event");

    }

}

// ======================================================
// CLEAR FORM
// ======================================================

function clearForm(){

    document.getElementById("eventName").value="";

    document.getElementById("eventDate").value="";

    document.getElementById("eventVenue").value="";

    document.getElementById("eventFee").value="";

    document.getElementById("eventStatus").value="Open";

}
// ======================================================
// EDIT EVENT
// ======================================================

function editEvent(id){

    const event = events.find(e => e.id == id);

    if(!event){

        alert("Event not found");

        return;

    }

    editingId = id;

    document.getElementById("eventName").value =
    event.event_name;

    document.getElementById("eventDate").value =
    event.event_date.substring(0,10);

    document.getElementById("eventVenue").value =
    event.venue;

    document.getElementById("eventFee").value =
    event.fee;

    document.getElementById("eventStatus").value =
    event.status;

    const btn =
    document.querySelector(".present-btn");

    btn.innerHTML =
    '<i class="fa-solid fa-floppy-disk"></i> Update Event';

    btn.onclick = updateEvent;

}

// ======================================================
// UPDATE EVENT
// ======================================================

async function updateEvent(){

    const event_name =
    document.getElementById("eventName").value;

    const event_date =
    document.getElementById("eventDate").value;

    const venue =
    document.getElementById("eventVenue").value;

    const fee =
    document.getElementById("eventFee").value;

    const status =
    document.getElementById("eventStatus").value;

    const response = await fetch(

        "/events/" + editingId,

        {

            method:"PUT",

            headers:{
                "Content-Type":"application/json"
            },

            credentials:"include",

            body:JSON.stringify({

                event_name,
                event_date,
                venue,
                fee,
                status

            })

        }

    );

    const data = await response.json();

    if(data.success){

        alert("Event Updated Successfully");

        editingId = null;

        clearForm();

        loadEvents();

        const btn =
        document.querySelector(".present-btn");

        btn.innerHTML =
        '<i class="fa-solid fa-floppy-disk"></i> Save Event';

        btn.onclick = saveEvent;

    }

    else{

        alert("Update Failed");

    }

}
// ======================================================
// DELETE EVENT
// ======================================================

async function deleteEvent(id){

    if(!confirm("Are you sure you want to delete this event?")){

        return;

    }

    try{

        const response = await fetch("/events/" + id,{

            method:"DELETE",

            credentials:"include"

        });

        const data = await response.json();

        if(data.success){

            alert("Event Deleted Successfully");

            loadEvents();

        }

        else{

            alert("Unable to Delete Event");

        }

    }

    catch(err){

        console.log(err);

    }

}

// ======================================================
// SEARCH EVENTS
// ======================================================

const searchBox =
document.getElementById("searchEvent");

if(searchBox){

    searchBox.onkeyup=function(){

        const value =
        this.value.toLowerCase();

        const rows =
        document.querySelectorAll("#eventTable tr");

        rows.forEach(row=>{

            if(row.innerText.toLowerCase().includes(value)){

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

        menuBtn.onclick = () => {

            sidebar.classList.add("active");

            overlay.classList.add("show");

        };

    }

    if(closeBtn){

        closeBtn.onclick = () => {

            sidebar.classList.remove("active");

            overlay.classList.remove("show");

        };

    }

    if(overlay){

        overlay.onclick = () => {

            sidebar.classList.remove("active");

            overlay.classList.remove("show");

        };

    }

}

// ======================================================
// LOGOUT
// ======================================================

function logout(){

    if(!confirm("Logout from Admin Dashboard?")){

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

    loadEvents();

},30000);

// ======================================================
// END OF EVENTS.JS
// ======================================================
