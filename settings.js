// ======================================================
// COLLEGE EVENT MANAGER
// SETTINGS.JS
// ======================================================

// Sidebar Elements

const sidebar =
document.getElementById("sidebar");

const menuBtn =
document.getElementById("menuBtn");

const closeBtn =
document.getElementById("closeSidebar");

const overlay =
document.getElementById("overlay");

// ======================================================
// PAGE LOAD
// ======================================================

window.addEventListener("load",()=>{

initializeSidebar();

loadSettings();

});

// ======================================================
// SIDEBAR
// ======================================================

function initializeSidebar(){

if(menuBtn){

menuBtn.onclick=()=>{

sidebar.classList.add("active");

overlay.classList.add("show");

};

}

if(closeBtn){

closeBtn.onclick=()=>{

sidebar.classList.remove("active");

overlay.classList.remove("show");

};

}

if(overlay){

overlay.onclick=()=>{

sidebar.classList.remove("active");

overlay.classList.remove("show");

};

}

}

// ======================================================
// LOAD SETTINGS
// ======================================================

function loadSettings(){

document.getElementById("theme").value =
localStorage.getItem("theme") || "Light Mode";

document.getElementById("notification").value =
localStorage.getItem("notification") || "Enabled";

document.getElementById("certificate").value =
localStorage.getItem("certificate") || "Enabled";

document.getElementById("accountStatus").value =
localStorage.getItem("accountStatus") || "Active";

}
// ======================================================
// SAVE SETTINGS
// ======================================================

const saveButton =
document.querySelector(".save-btn");

if(saveButton){

saveButton.onclick = saveSettings;

}

function saveSettings(){

const newPassword =
document.getElementById("newPassword").value;

const confirmPassword =
document.getElementById("confirmPassword").value;

// Password Validation

if(newPassword!=="" || confirmPassword!==""){

if(newPassword!==confirmPassword){

alert("Passwords do not match.");

return;

}

}

// Save Settings

localStorage.setItem(

"theme",

document.getElementById("theme").value

);

localStorage.setItem(

"notification",

document.getElementById("notification").value

);

localStorage.setItem(

"certificate",

document.getElementById("certificate").value

);

localStorage.setItem(

"accountStatus",

document.getElementById("accountStatus").value

);

// Save Password (Demo Only)

if(newPassword!=""){

localStorage.setItem(

"adminPassword",

newPassword

);

}

// Profile Image

const profileImage =

document.getElementById("profileImage");

if(profileImage.files.length>0){

const reader = new FileReader();

reader.onload=function(e){

localStorage.setItem(

"profileImage",

e.target.result

);

};

reader.readAsDataURL(profileImage.files[0]);

}

alert("Settings saved successfully.");

}
// ======================================================
// LOAD PROFILE IMAGE
// ======================================================

window.addEventListener("load",()=>{

const savedImage =
localStorage.getItem("profileImage");

if(savedImage){

const preview =
document.getElementById("profilePreview");

if(preview){

preview.src = savedImage;

}

}

});

// ======================================================
// THEME
// ======================================================

const theme =
document.getElementById("theme");

if(theme){

theme.onchange=()=>{

if(theme.value==="Dark Mode"){

document.body.classList.add("dark-mode");

}else{

document.body.classList.remove("dark-mode");

}

};

}

// ======================================================
// LOGOUT
// ======================================================

function logout(){

if(confirm("Logout from Admin Dashboard?")){

fetch("/logout",{

credentials:"include"

})
.then(()=>{

window.location.href="admin-login.html";

});

}

}

// ======================================================
// AUTO SAVE (OPTIONAL)
// ======================================================

setInterval(()=>{

console.log("Settings Ready");

},30000);

// ======================================================
// END OF SETTINGS.JS
// ======================================================