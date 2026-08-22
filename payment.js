function getRegistrationData() {

    const registrationData =
        getStorageData("registrationData");

    const studentData =
        getStorageData("studentData");

    const receiptData =
        getStorageData("receiptData");


    let data =
        registrationData ||
        studentData ||
        receiptData ||
        {};


    return {

        fullname:
            data.fullname ||
            data.name ||
            localStorage.getItem("studentName") ||
            "",

        email:
            data.email ||
            localStorage.getItem("studentEmail") ||
            "",

        college:
            data.college ||
            localStorage.getItem("college") ||
            "",

        department:
            data.department ||
            localStorage.getItem("department") ||
            "",

        year:
            data.year ||
            localStorage.getItem("year") ||
            "",

        event:
            data.event ||
            localStorage.getItem("eventName") ||
            "Tech Spark 2027"

    };

}