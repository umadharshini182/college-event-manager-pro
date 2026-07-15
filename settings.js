// ======================================================
// COLLEGE EVENT MANAGER
// SETTINGS.JS
// ======================================================

// ======================================================
// PAGE LOAD
// ======================================================

window.addEventListener("load", () => {

    checkLogin();

    initializeSidebar();

    loadSettings();

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

    }

    catch(err){

        console.log(err);

        window.location.href="admin-login.html";

    }

}

// ======================================================
// LOAD SETTINGS
// ======================================================

function loadSettings(){

    document.getElementById("adminName").value =
    localStorage.getItem("adminName") || "Administrator";

    document.getElementById("adminEmail").value =
    localStorage.getItem("adminEmail") || "admin@gmail.com";

    document.getElementById("adminPhone").value =
    localStorage.getItem("adminPhone") || "";

    document.getElementById("collegeName").value =
    localStorage.getItem("collegeName") ||
    "ABC Engineering College";

}
// ======================================================
// SAVE PROFILE
// ======================================================

function saveProfile(){

    localStorage.setItem(
        "adminName",
        document.getElementById("adminName").value
    );

    localStorage.setItem(
        "adminEmail",
        document.getElementById("adminEmail").value
    );

    localStorage.setItem(
        "adminPhone",
        document.getElementById("adminPhone").value
    );

    localStorage.setItem(
        "collegeName",
        document.getElementById("collegeName").value
    );

    alert("Profile Saved Successfully");

}

// ======================================================
// CHANGE PASSWORD
// ======================================================

function changePassword(){

    const current =
    document.getElementById("currentPassword").value;

    const newPass =
    document.getElementById("newPassword").value;

    const confirm =
    document.getElementById("confirmPassword").value;

    if(current===""){

        alert("Enter Current Password");

        return;

    }

    if(newPass===""){

        alert("Enter New Password");

        return;

    }

    if(newPass!==confirm){

        alert("Passwords do not match");

        return;

    }

    alert("Password Changed Successfully");

    document.getElementById("currentPassword").value="";

    document.getElementById("newPassword").value="";

    document.getElementById("confirmPassword").value="";

}

// ======================================================
// DARK MODE
// ======================================================

const darkMode =
document.getElementById("darkMode");

if(darkMode){

darkMode.onchange=function(){

if(this.checked){

document.body.classList.add("dark");

}

else{

document.body.classList.remove("dark");

}

};

}

// ======================================================
// NOTIFICATIONS
// ======================================================

const notifications =
document.getElementById("notifications");

if(notifications){

notifications.onchange=function(){

localStorage.setItem(

"notifications",

this.checked

);

};

}

const emailAlerts =
document.getElementById("emailAlerts");

if(emailAlerts){

emailAlerts.onchange=function(){

localStorage.setItem(

"emailAlerts",

this.checked

);

};

}

const backup =
document.getElementById("backup");

if(backup){

backup.onchange=function(){

localStorage.setItem(

"backup",

this.checked

);

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
// AUTO SAVE (Optional)
// ======================================================

setInterval(()=>{

    localStorage.setItem(
        "notifications",
        document.getElementById("notifications")?.checked || false
    );

    localStorage.setItem(
        "emailAlerts",
        document.getElementById("emailAlerts")?.checked || false
    );

    localStorage.setItem(
        "backup",
        document.getElementById("backup")?.checked || false
    );

},30000);

// ======================================================
// BUTTON EVENTS
// ======================================================

document.addEventListener("DOMContentLoaded",()=>{

    const saveBtn =
    document.querySelector(".present-btn");

    if(saveBtn){

        saveBtn.addEventListener("click",saveProfile);

    }

    const passwordBtn =
    document.querySelector(".certificate-btn");

    if(passwordBtn){

        passwordBtn.addEventListener("click",changePassword);

    }

});

// ======================================================
// END OF SETTINGS.JS
// ======================================================