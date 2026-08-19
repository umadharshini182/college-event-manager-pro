// ======================================================
// COLLEGE EVENT MANAGER
// SETTINGS.JS
// CLEAN PROFESSIONAL VERSION
// ======================================================


// ======================================================
// ELEMENTS
// ======================================================

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

const autoRefresh =
    document.getElementById("autoRefresh");

const profileImage =
    document.getElementById("profileImage");

const profilePreview =
    document.getElementById("profilePreview");

const topProfilePreview =
    document.getElementById("topProfilePreview");

const saveBtn =
    document.getElementById("saveSettingsBtn");

const resetBtn =
    document.getElementById("resetSettingsBtn");


// ======================================================
// PAGE LOAD
// ======================================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "Settings Loaded"
        );

        initializeSidebar();

        loadSettings();

        loadProfileImage();

        applyTheme();

        checkLogin();

    }
);


// ======================================================
// SIDEBAR
// ======================================================

function initializeSidebar() {

    if (
        !sidebar ||
        !menuBtn
    ) {

        console.log(
            "Sidebar elements not found"
        );

        return;
    }


    // OPEN SIDEBAR

    menuBtn.addEventListener(
        "click",
        () => {

            sidebar.classList.add(
                "active"
            );


            if (overlay) {

                overlay.classList.add(
                    "show"
                );

            }

        }
    );


    // CLOSE BUTTON

    if (closeBtn) {

        closeBtn.addEventListener(
            "click",
            closeSidebar
        );

    }


    // OVERLAY

    if (overlay) {

        overlay.addEventListener(
            "click",
            closeSidebar
        );

    }

}


function closeSidebar() {

    if (sidebar) {

        sidebar.classList.remove(
            "active"
        );

    }


    if (overlay) {

        overlay.classList.remove(
            "show"
        );

    }

}


// ======================================================
// LOAD SETTINGS
// ======================================================

function loadSettings() {

    if (theme) {

        theme.value =
            localStorage.getItem(
                "theme"
            ) || "Light Mode";

    }


    if (notification) {

        notification.value =
            localStorage.getItem(
                "notification"
            ) || "Enabled";

    }


    if (certificate) {

        certificate.value =
            localStorage.getItem(
                "certificate"
            ) || "Enabled";

    }


    if (autoRefresh) {

        autoRefresh.value =
            localStorage.getItem(
                "autoRefresh"
            ) || "5";

    }

}


// ======================================================
// SAVE BUTTON
// ======================================================

if (saveBtn) {

    saveBtn.addEventListener(
        "click",
        saveSettings
    );

}


// ======================================================
// SAVE SETTINGS
// ======================================================

async function saveSettings() {

    const currentPassword =
        document
            .getElementById(
                "currentPassword"
            )
            ?.value
            .trim() || "";


    const newPassword =
        document
            .getElementById(
                "newPassword"
            )
            ?.value
            .trim() || "";


    const confirmPassword =
        document
            .getElementById(
                "confirmPassword"
            )
            ?.value
            .trim() || "";


    // ==================================================
    // PASSWORD CHANGE REQUESTED
    // ==================================================

    const passwordEntered =
        currentPassword ||
        newPassword ||
        confirmPassword;


    if (passwordEntered) {

        // ----------------------------------------------
        // CHECK ALL PASSWORD FIELDS
        // ----------------------------------------------

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            alert(
                "Please fill all password fields."
            );

            return;

        }


        // ----------------------------------------------
        // CHECK NEW PASSWORDS MATCH
        // ----------------------------------------------

        if (
            newPassword !==
            confirmPassword
        ) {

            alert(
                "New passwords do not match."
            );

            return;

        }


        // ----------------------------------------------
        // PASSWORD LENGTH
        // ----------------------------------------------

        if (
            newPassword.length < 6
        ) {

            alert(
                "New password must contain at least 6 characters."
            );

            return;

        }


        // ----------------------------------------------
        // DON'T ALLOW SAME PASSWORD
        // ----------------------------------------------

        if (
            currentPassword ===
            newPassword
        ) {

            alert(
                "New password must be different from the current password."
            );

            return;

        }


        // ----------------------------------------------
        // SEND TO BACKEND
        // ----------------------------------------------

        try {

            saveBtn.disabled = true;

            saveBtn.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';


            const response =
                await fetch(
                    "/api/change-password",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        credentials:
                            "include",

                        body:
                            JSON.stringify({

                                currentPassword:
                                    currentPassword,

                                newPassword:
                                    newPassword,

                                confirmPassword:
                                    confirmPassword

                            })

                    }
                );


            let data;


            try {

                data =
                    await response.json();

            }

            catch {

                throw new Error(
                    "Invalid response from server."
                );

            }


            // ------------------------------------------
            // LOGIN EXPIRED
            // ------------------------------------------

            if (
                response.status === 401 &&
                data.message ===
                    "Please login first."
            ) {

                alert(
                    "Your login session has expired. Please login again."
                );


                window.location.href =
                    "admin-login.html";


                return;

            }


            // ------------------------------------------
            // BACKEND ERROR
            // ------------------------------------------

            if (
                !response.ok ||
                !data.success
            ) {

                alert(
                    data.message ||
                    "Password change failed."
                );

                return;

            }


            // ------------------------------------------
            // PASSWORD SUCCESS
            // ------------------------------------------

            alert(
                "✅ Password changed successfully!"
            );


            clearPasswordFields();

        }

        catch (error) {

            console.error(
                "Password change error:",
                error
            );


            alert(
                "Unable to connect to the backend."
            );


            return;

        }

        finally {

            saveBtn.disabled =
                false;


            saveBtn.innerHTML =
                '<i class="fa-solid fa-floppy-disk"></i> Save Changes';

        }

    }


    // ==================================================
    // SAVE NORMAL SETTINGS
    // ==================================================

    if (theme) {

        localStorage.setItem(
            "theme",
            theme.value
        );

    }


    if (notification) {

        localStorage.setItem(
            "notification",
            notification.value
        );

    }


    if (certificate) {

        localStorage.setItem(
            "certificate",
            certificate.value
        );

    }


    if (autoRefresh) {

        localStorage.setItem(
            "autoRefresh",
            autoRefresh.value
        );

    }


    applyTheme();


    // If password wasn't changed,
    // show normal settings message.

    if (!passwordEntered) {

        alert(
            "✅ Settings Saved Successfully"
        );

    }

}


// ======================================================
// CLEAR PASSWORD FIELDS
// ======================================================

function clearPasswordFields() {

    const current =
        document.getElementById(
            "currentPassword"
        );

    const newPass =
        document.getElementById(
            "newPassword"
        );

    const confirmPass =
        document.getElementById(
            "confirmPassword"
        );


    if (current) {

        current.value = "";

    }


    if (newPass) {

        newPass.value = "";

    }


    if (confirmPass) {

        confirmPass.value = "";

    }

}


// ======================================================
// PROFILE IMAGE
// ======================================================

if (profileImage) {

    profileImage.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];


            if (!file) {

                return;

            }


            // Only image files

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Please select an image file."
                );

                this.value = "";

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const imageData =
                        event.target.result;


                    localStorage.setItem(
                        "profileImage",
                        imageData
                    );


                    if (profilePreview) {

                        profilePreview.src =
                            imageData;

                    }


                    if (topProfilePreview) {

                        topProfilePreview.src =
                            imageData;

                    }

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


// ======================================================
// LOAD PROFILE IMAGE
// ======================================================

function loadProfileImage() {

    const image =
        localStorage.getItem(
            "profileImage"
        );


    if (!image) {

        return;

    }


    if (profilePreview) {

        profilePreview.src =
            image;

    }


    if (topProfilePreview) {

        topProfilePreview.src =
            image;

    }

}


// ======================================================
// RESET SETTINGS
// ======================================================

if (resetBtn) {

    resetBtn.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Reset all dashboard preferences?"
                );


            if (!confirmed) {

                return;

            }


            // Password is NOT reset here.
            // Password belongs to MySQL.

            localStorage.removeItem(
                "theme"
            );

            localStorage.removeItem(
                "notification"
            );

            localStorage.removeItem(
                "certificate"
            );

            localStorage.removeItem(
                "autoRefresh"
            );

            localStorage.removeItem(
                "profileImage"
            );


            location.reload();

        }
    );

}


// ======================================================
// APPLY THEME
// ======================================================

function applyTheme() {

    const selectedTheme =
        localStorage.getItem(
            "theme"
        ) || "Light Mode";


    if (theme) {

        theme.value =
            selectedTheme;

    }


    if (
        selectedTheme ===
        "Dark Mode"
    ) {

        document.body.classList.add(
            "dark-mode"
        );

    }

    else {

        document.body.classList.remove(
            "dark-mode"
        );

    }

}


// ======================================================
// THEME CHANGE
// ======================================================

if (theme) {

    theme.addEventListener(
        "change",
        function () {

            localStorage.setItem(
                "theme",
                this.value
            );


            applyTheme();

        }
    );

}


// ======================================================
// NOTIFICATION CHANGE
// ======================================================

if (notification) {

    notification.addEventListener(
        "change",
        function () {

            localStorage.setItem(
                "notification",
                this.value
            );

        }
    );

}


// ======================================================
// CERTIFICATE CHANGE
// ======================================================

if (certificate) {

    certificate.addEventListener(
        "change",
        function () {

            localStorage.setItem(
                "certificate",
                this.value
            );

        }
    );

}


// ======================================================
// AUTO REFRESH
// ======================================================

if (autoRefresh) {

    autoRefresh.addEventListener(
        "change",
        function () {

            localStorage.setItem(
                "autoRefresh",
                this.value
            );

        }
    );

}


// ======================================================
// LOGOUT
// ======================================================

async function logout() {

    const confirmed =
        confirm(
            "Logout from Admin Dashboard?"
        );


    if (!confirmed) {

        return;

    }


    try {

        await fetch(
            "/logout",
            {

                method: "GET",

                credentials:
                    "include"

            }
        );

    }

    catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }


    window.location.href =
        "admin-login.html";

}


// ======================================================
// CHECK LOGIN
// ======================================================

async function checkLogin() {

    try {

        const response =
            await fetch(
                "/api/current-user",
                {

                    credentials:
                        "include"

                }
            );


        const data =
            await response.json();


        if (!data.loggedIn) {

            window.location.href =
                "admin-login.html";

        }

    }

    catch (error) {

        console.error(
            "Login check error:",
            error
        );


        window.location.href =
            "admin-login.html";

    }

}


// ======================================================
// STATUS
// ======================================================

setInterval(
    () => {

        console.log(
            "Settings Running..."
        );

    },
    30000
);