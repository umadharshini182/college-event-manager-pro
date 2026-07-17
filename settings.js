// ======================================================
// COLLEGE EVENT MANAGER
// SETTINGS.JS
// Professional Version
// ======================================================

// ======================================
// ELEMENTS
// ======================================

const sidebar =
document.getElementById("sidebar");

const menuBtn =
document.getElementById("menuBtn");

const closeBtn =
document.getElementById("closeSidebar");

const overlay =
document.getElementById("overlay");

const theme =
document.getElementById("theme");

const notification =
document.getElementById("notification");

const certificate =
document.getElementById("certificate");

const profileImage =
document.getElementById("profileImage");

const profilePreview =
document.getElementById("profilePreview");

const saveBtn =
document.getElementById("saveSettingsBtn");

const resetBtn =
document.getElementById("resetSettingsBtn");

// ======================================
// PAGE LOAD
// ======================================

window.addEventListener("load",()=>{

loadSettings();

initializeSidebar();

loadProfileImage();

applyTheme();

console.log("Settings Loaded");

});

// ======================================
// SIDEBAR
// ======================================

function initializeSidebar(){

    if(!sidebar || !menuBtn || !closeBtn || !overlay){
        console.log("Sidebar elements not found");
        return;
    }

    menuBtn.onclick = () => {

        sidebar.classList.add("active");

        overlay.classList.add("show");

    };

    closeBtn.onclick = () => {

        sidebar.classList.remove("active");

        overlay.classList.remove("show");

    };

    overlay.onclick = () => {

        sidebar.classList.remove("active");

        overlay.classList.remove("show");

    };

}


// ======================================
// LOAD SETTINGS
// ======================================

function loadSettings(){

if(theme){

theme.value=

localStorage.getItem("theme")

||

"Light Mode";

}

if(notification){

notification.value=

localStorage.getItem("notification")

||

"Enabled";

}

if(certificate){

certificate.value=

localStorage.getItem("certificate")

||

"Enabled";

}

}
// ======================================
// SAVE SETTINGS
// ======================================

if(saveBtn){

saveBtn.onclick=saveSettings;

}

function saveSettings(){

// Theme

if(theme){

localStorage.setItem(

"theme",

theme.value

);

}

// Notifications

if(notification){

localStorage.setItem(

"notification",

notification.value

);

}

// Certificate

if(certificate){

localStorage.setItem(

"certificate",

certificate.value

);

}

// Password

const newPassword=

document.getElementById("newPassword").value;

const confirmPassword=

document.getElementById("confirmPassword").value;

if(newPassword!=="" || confirmPassword!==""){

if(newPassword!==confirmPassword){

alert("Passwords do not match");

return;

}

localStorage.setItem(

"adminPassword",

newPassword

);

}

applyTheme();

alert("✅ Settings Saved Successfully");

}

// ======================================
// PROFILE IMAGE
// ======================================

if(profileImage){

profileImage.onchange=function(){

const file=this.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=function(e){

localStorage.setItem(

"profileImage",

e.target.result

);

profilePreview.src=

e.target.result;

};

reader.readAsDataURL(file);

};

}

function loadProfileImage(){

const image=

localStorage.getItem("profileImage");

if(image && profilePreview){

profilePreview.src=image;

}

}

// ======================================
// RESET SETTINGS
// ======================================

if(resetBtn){

resetBtn.onclick=function(){

if(!confirm("Reset all settings?")){

return;

}

localStorage.removeItem("theme");

localStorage.removeItem("notification");

localStorage.removeItem("certificate");

localStorage.removeItem("profileImage");

location.reload();

};

}
// ======================================
// APPLY THEME
// ======================================

function applyTheme(){

const selectedTheme =
localStorage.getItem("theme") || "Light Mode";

if(theme){

theme.value = selectedTheme;

}

if(selectedTheme==="Dark Mode"){

document.body.classList.add("dark-mode");

}else{

document.body.classList.remove("dark-mode");

}

}

// ======================================
// THEME CHANGE
// ======================================

if(theme){

theme.addEventListener("change",function(){

localStorage.setItem(

"theme",

this.value

);

applyTheme();

});

}

// ======================================
// NOTIFICATION CHANGE
// ======================================

if(notification){

notification.addEventListener("change",function(){

localStorage.setItem(

"notification",

this.value

);

});

}

// ======================================
// CERTIFICATE CHANGE
// ======================================

if(certificate){

certificate.addEventListener("change",function(){

localStorage.setItem(

"certificate",

this.value

);

});

}

// ======================================
// AUTO REFRESH
// ======================================

const autoRefresh =
document.getElementById("autoRefresh");

if(autoRefresh){

autoRefresh.value =
localStorage.getItem("autoRefresh") || "5";

autoRefresh.addEventListener("change",function(){

localStorage.setItem(

"autoRefresh",

this.value

);

});

}
// ======================================
// LOGOUT
// ======================================

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

.catch(()=>{

window.location.href="admin-login.html";

});

}

// ======================================
// CHECK LOGIN
// ======================================

async function checkLogin(){

try{

const response = await fetch("/api/current-user",{

credentials:"include"

});

const data = await response.json();

if(!data.loggedIn){

window.location.href="admin-login.html";

}

}

catch(err){

console.log(err);

window.location.href="admin-login.html";

}

}

// ======================================
// AUTO STATUS
// ======================================

setInterval(()=>{

console.log("Settings Running...");

},30000);

// ======================================
// INITIALIZE
// ======================================
window.addEventListener("DOMContentLoaded",()=>{

checkLogin();

});
