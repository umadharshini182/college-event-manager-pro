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

loadProfileImage();

applyTheme();

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

const theme =
document.getElementById("theme");

const notification =
document.getElementById("notification");

const certificate =
document.getElementById("certificate");

if(theme){

theme.value =
localStorage.getItem("theme") || "Light Mode";

}

if(notification){

notification.value =
localStorage.getItem("notification") || "Enabled";

}

if(certificate){

certificate.value =
localStorage.getItem("certificate") || "Enabled";

}

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

// Check Password

if(newPassword!=="" || confirmPassword!==""){

if(newPassword!==confirmPassword){

alert("Passwords do not match.");

return;

}

localStorage.setItem(

"adminPassword",

newPassword

);

}

// Save Theme

const theme =
document.getElementById("theme");

if(theme){

localStorage.setItem(

"theme",

theme.value

);

}

// Save Notifications

const notification =
document.getElementById("notification");

if(notification){

localStorage.setItem(

"notification",

notification.value

);

}

// Save Certificate Option

const certificate =
document.getElementById("certificate");

if(certificate){

localStorage.setItem(

"certificate",

certificate.value

);

}

// Save Profile Image

const profileImage =
document.getElementById("profileImage");

if(profileImage && profileImage.files.length>0){

const reader = new FileReader();

reader.onload=function(e){

localStorage.setItem(

"profileImage",

e.target.result

);

document.getElementById("profilePreview").src =
e.target.result;

};

reader.readAsDataURL(profileImage.files[0]);

}

alert("Settings saved successfully.");

applyTheme();

}
// ======================================================
// LOAD PROFILE IMAGE
// ======================================================

function loadProfileImage(){

const preview =
document.getElementById("profilePreview");

const savedImage =
localStorage.getItem("profileImage");

if(preview && savedImage){

preview.src = savedImage;

}

}

// ======================================================
// APPLY THEME
// ======================================================
function applyTheme(){

const theme =
localStorage.getItem("theme") || "Light Mode";

const themeSelect =
document.getElementById("theme");

if(themeSelect){

themeSelect.value = theme;

}

if(theme === "Dark Mode"){

document.body.classList.add("dark-mode");

}else{

document.body.classList.remove("dark-mode");

}

}
// ======================================================
// THEME CHANGE
// ======================================================

const themeSelect =
document.getElementById("theme");

if(themeSelect){

themeSelect.addEventListener("change", function(){

localStorage.setItem("theme", this.value);

applyTheme();

});

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

})
.catch(()=>{

window.location.href="admin-login.html";

});

}

}

// ======================================================
// AUTO STATUS
// ======================================================

setInterval(()=>{

console.log("Settings Ready");

},30000);

// ======================================================
// END OF SETTINGS.JS
// ======================================================