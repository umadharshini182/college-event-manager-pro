document.addEventListener(
    "DOMContentLoaded",
    function () {

        const params =
            new URLSearchParams(
                window.location.search
            );


        document.getElementById(
            "studentName"
        ).textContent =
            params.get("name") ||
            "Not available";


        document.getElementById(
            "studentEmail"
        ).textContent =
            params.get("email") ||
            "Not available";


        document.getElementById(
            "collegeName"
        ).textContent =
            params.get("college") ||
            "Not available";


        document.getElementById(
            "departmentName"
        ).textContent =
            params.get("department") ||
            "Not available";


        document.getElementById(
            "studentYear"
        ).textContent =
            params.get("year") ||
            "Not available";


        document.getElementById(
            "eventName"
        ).textContent =
            params.get("event") ||
            "Not available";

    }
);