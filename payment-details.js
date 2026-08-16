// ==========================================
// REGISTRATION QR VERIFICATION
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // ======================================
        // READ QR DATA FROM URL
        // ======================================

        const params =
            new URLSearchParams(
                window.location.search
            );


        // ======================================
        // GET VALUES
        // ======================================

        const name =
            params.get("name");

        const email =
            params.get("email");

        const college =
            params.get("college");

        const department =
            params.get("department");

        const year =
            params.get("year");

        const event =
            params.get("event");


        // ======================================
        // DISPLAY VALUES
        // ======================================

        setValue(
            "studentName",
            name
        );


        setValue(
            "studentEmail",
            email
        );


        setValue(
            "collegeName",
            college
        );


        setValue(
            "departmentName",
            department
        );


        setValue(
            "studentYear",
            year
        );


        setValue(
            "eventName",
            event
        );


        // ======================================
        // HELPER
        // ======================================

        function setValue(
            id,
            value
        ) {

            const element =
                document.getElementById(
                    id
                );


            if (!element) {

                return;

            }


            if (
                value &&
                value.trim() !== ""
            ) {

                element.textContent =
                    value;

            } else {

                element.textContent =
                    "Not available";

            }

        }

    }
);