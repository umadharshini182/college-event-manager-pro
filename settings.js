// ======================================================
// SETTINGS PAGE
// ======================================================

window.addEventListener("DOMContentLoaded", () => {

    initializeSidebar();

    loadSettings();

    loadProfileImage();

    applyTheme();

    const saveBtn = document.getElementById("saveSettingsBtn");

    if (saveBtn) {

        saveBtn.addEventListener("click", saveSettings);

    }

});

// ======================================================
// SIDEBAR
// ======================================================

function initializeSidebar(){

const sidebar=document.getElementById("sidebar");

const menuBtn=document.getElementById("menuBtn");

const closeBtn=document.getElementById("closeSidebar");

const overlay=document.getElementById("overlay");

if(menuBtn){

menuBtn.onclick=function(){

sidebar.classList.add("active");

overlay.classList.add("show");

};

}

if(closeBtn){

closeBtn.onclick=function(){

sidebar.classList.remove("active");

overlay.classList.remove("show");

};

}

if(overlay){

overlay.onclick=function(){

sidebar.classList.remove("active");

overlay.classList.remove("show");

};

}

}
// ======================================================
// LOAD SETTINGS
// ======================================================

function loadSettings(){

const theme=document.getElementById("theme");

const notification=document.getElementById("notification");

const certificate=document.getElementById("certificate");

if(theme){

theme.value=localStorage.getItem("theme") || "Light Mode";

}

if(notification){

notification.value=localStorage.getItem("notification") || "Enabled";

}

if(certificate){

certificate.value=localStorage.getItem("certificate") || "Enabled";

}

}

// ======================================================
// SAVE SETTINGS
// ======================================================

function saveSettings(){

const newPassword=document.getElementById("newPassword").value.trim();

const confirmPassword=document.getElementById("confirmPassword").value.trim();

if(newPassword!=="" || confirmPassword!==""){

if(newPassword!==confirmPassword){

alert("❌ Passwords do not match.");

return;

}

localStorage.setItem("adminPassword",newPassword);

}

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

saveProfileImage();

applyTheme();

alert("✅ Settings Saved Successfully!");

}
// ======================================================
// PROFILE IMAGE
// ======================================================

function saveProfileImage(){

const file=document.getElementById("profileImage");

if(!file || file.files.length===0){

return;

}

const reader=new FileReader();

reader.onload=function(e){

localStorage.setItem("profileImage",e.target.result);

loadProfileImage();

};

reader.readAsDataURL(file.files[0]);

}

function loadProfileImage(){

const preview=document.getElementById("profilePreview");

const image=localStorage.getItem("profileImage");

if(preview && image){

preview.src=image;

}

}

// ======================================================
// THEME
// ======================================================

function applyTheme(){

const theme=localStorage.getItem("theme") || "Light Mode";

if(theme==="Dark Mode"){

document.body.classList.add("dark-mode");

}else{

document.body.classList.remove("dark-mode");

}

}

const themeSelect=document.getElementById("theme");

if(themeSelect){

themeSelect.addEventListener("change",function(){

localStorage.setItem("theme",this.value);

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

console.log("✅ Settings Loaded Successfully");