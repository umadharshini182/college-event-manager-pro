// ======================================================
// COLLEGE EVENT MANAGER
// EVENTS.JS
// Professional Version
// ======================================================

// ======================================================
// GLOBAL VARIABLES
// ======================================================

let events = [];
let students = [];

// ======================================================
// PAGE LOAD
// ======================================================

window.addEventListener("load", () => {

    checkLogin();

    initializeSidebar();

    const btn = document.getElementById("saveEventBtn");

    if(btn){

        btn.onclick = saveEvent;

    }

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

        await loadEvents();

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

        const eventResponse = await fetch("/events",{

            credentials:"include"

        });

        events = await eventResponse.json();

        const studentResponse = await fetch("/students",{

            credentials:"include"

        });

        students = await studentResponse.json();

        updateCards();

        loadTable();

    }

    catch(err){

        console.log("Error loading events:",err);

    }

}
// ======================================================
// UPDATE DASHBOARD CARDS
// ======================================================

function updateCards(){

    const totalEvents=document.getElementById("totalEvents");
    if(totalEvents){
        totalEvents.innerText=events.length;
    }

    const activeEvents=document.getElementById("activeEvents");
    if(activeEvents){
        activeEvents.innerText=
        events.filter(e=>e.status==="Open").length;
    }

    const upcomingEvents=document.getElementById("upcomingEvents");
    if(upcomingEvents){
        upcomingEvents.innerText=events.length;
    }

    const registrations=document.getElementById("eventRegistrations");
    if(registrations){
        registrations.innerText=students.length;
    }

    let revenue=0;

    events.forEach(event=>{

        revenue+=Number(event.fee||0);

    });

    const revenueBox=document.getElementById("eventRevenue");

    if(revenueBox){

        revenueBox.innerText="₹"+revenue;

    }

    const completed=document.getElementById("completedEvents");

    if(completed){

        completed.innerText=

        events.filter(e=>e.status==="Closed").length;

    }

    const future=document.getElementById("futureEvents");

    if(future){

        const today=new Date();

        future.innerText=

        events.filter(e=>

        new Date(e.event_date)>=today

        ).length;

    }

}
// ======================================================
// LOAD EVENT TABLE
// ======================================================

function loadTable(){

    const tbody=document.getElementById("eventTable");

    if(!tbody) return;

    tbody.innerHTML="";

    events.forEach(event=>{

        tbody.innerHTML+=`

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
class="action-btn delete-btn"
onclick="deleteEvent(${event.id})">

<i class="fa-solid fa-trash"></i>

Delete

</button>

</td>

</tr>

`;

    });

}

// ======================================================
// SAVE NEW EVENT
// ======================================================

async function saveEvent(){

    const event_name=
    document.getElementById("eventName").value.trim();

    const event_date=
    document.getElementById("eventDate").value;

    const venue=
    document.getElementById("eventVenue").value.trim();

    const fee=
    document.getElementById("eventFee").value;

    const status=
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

    try{

        const response=await fetch("/events",{

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

        if(!response.ok){

            alert("Server Error");

            return;

        }

        const data=await response.json();

        if(data.success){

            alert("Event Added Successfully");

            clearForm();

            loadEvents();

        }

        else{

            alert("Unable to Add Event");

        }

    }

    catch(err){

        console.log(err);

        alert("Something went wrong.");

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
// DELETE EVENT
// ======================================================

async function deleteEvent(id){

    if(!confirm("Are you sure you want to delete this event?")){
        return;
    }

    try{

        const response=await fetch("/events/"+id,{

            method:"DELETE",

            credentials:"include"

        });

        if(!response.ok){

            alert("Server Error");

            return;

        }

        const data=await response.json();

        if(data.success){

            alert("Event Deleted Successfully");

            loadEvents();

        }else{

            alert("Unable to Delete Event");

        }

    }

    catch(err){

        console.log(err);

        alert("Something went wrong while deleting.");

    }

}

// ======================================================
// SEARCH EVENTS
// ======================================================

const searchBox=document.getElementById("searchEvent");

if(searchBox){

    searchBox.addEventListener("keyup",function(){

        const value=this.value.toLowerCase();

        document.querySelectorAll("#eventTable tr")
        .forEach(row=>{

            row.style.display=

            row.innerText.toLowerCase().includes(value)

            ?

            ""

            :

            "none";

        });

    });

}

// ======================================================
// SIDEBAR
// ======================================================

function initializeSidebar(){

    const sidebar=document.getElementById("sidebar");
    const menuBtn=document.getElementById("menuBtn");
    const closeBtn=document.getElementById("closeSidebar");
    const overlay=document.getElementById("overlay");

    if(!sidebar || !menuBtn || !closeBtn || !overlay){
        return;
    }

    menuBtn.onclick=()=>{

        sidebar.classList.add("active");
        overlay.classList.add("show");

    };

    closeBtn.onclick=()=>{

        sidebar.classList.remove("active");
        overlay.classList.remove("show");

    };

    overlay.onclick=()=>{

        sidebar.classList.remove("active");
        overlay.classList.remove("show");

    };

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

    })

    .catch(err=>{

        console.log(err);

        alert("Logout Failed");

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



