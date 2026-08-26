// ======================================================
// COLLEGE EVENT MANAGER
// PAYMENTS.JS
// ======================================================

const BACKEND_URL =
    "https://college-event-manager-pro.onrender.com";

let allPayments = [];
// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    initializeSidebar();

    initializeSearch();

    loadPayments();

});


// ======================================================
// SIDEBAR
// ======================================================

function initializeSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    const menuBtn =
        document.getElementById("menuBtn");

    const closeBtn =
        document.getElementById("closeSidebar");

    const overlay =
        document.getElementById("overlay");


    if (!sidebar || !menuBtn) {

        return;

    }


    menuBtn.addEventListener(
        "click",
        () => {

            sidebar.classList.add("active");

            if (overlay) {

                overlay.classList.add("show");

            }

        }
    );


    if (closeBtn) {

        closeBtn.addEventListener(
            "click",
            closeSidebar
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeSidebar
        );

    }

}


function closeSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    const overlay =
        document.getElementById("overlay");


    if (sidebar) {

        sidebar.classList.remove("active");

    }


    if (overlay) {

        overlay.classList.remove("show");

    }

}


// ======================================================
// LOAD PAYMENTS
// ======================================================

async function loadPayments() {

    try {

        console.log(
            "Loading payment records..."
        );


        const response =
            await fetch(
                BACKEND_URL + "/students",
                {
                    credentials: "include"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Server returned " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "BACKEND STUDENT DATA:",
            data
        );


        allPayments =
            Array.isArray(data)
                ? data
                : [];


        renderPayments(allPayments);

        updateStatistics(allPayments);

        updateRecentPayments(allPayments);

        updateRevenueReport(allPayments);

    }

    catch (error) {

        console.error(
            "PAYMENT LOADING ERROR:",
            error
        );


        const table =
            document.getElementById(
                "paymentTable"
            );


        if (table) {

            table.innerHTML = `
                <tr>
                    <td
                        colspan="8"
                        style="
                            text-align:center;
                            padding:30px;
                        "
                    >
                        Unable to load payment data.
                        <br>
                        <small>
                            ${escapeHtml(
                                error.message
                            )}
                        </small>
                    </td>
                </tr>
            `;

        }

    }

}


// ======================================================
// GET PAYMENT STATUS
// ======================================================

function getPaymentStatus(payment) {

    return normalizeStatus(

        payment.payment_status ||
        payment.paymentStatus ||
        payment.status

    );

}


// ======================================================
// GET PAYMENT AMOUNT
// ======================================================

function getPaymentAmount(payment) {

    return Number(

        payment.amount ||
        payment.payment_amount ||
        payment.paymentAmount ||
        0

    );

}


// ======================================================
// GET PAYMENT DATE
// ======================================================

function getPaymentDate(payment) {

    return (

        payment.payment_date ||
        payment.paymentDate ||
        payment.createdAt ||
        payment.created_at

    );

}


// ======================================================
// GET TRANSACTION ID
// ======================================================

function getTransactionId(payment) {

    return (

        payment.transaction_id ||
        payment.transactionId ||
        payment.payment_id ||
        payment.paymentId ||
        "-"

    );

}


// ======================================================
// GET PAYMENT METHOD
// ======================================================

function getPaymentMethod(payment) {

    return (

        payment.payment_method ||
        payment.paymentMethod ||
        "-"

    );

}


// ======================================================
// RENDER PAYMENT TABLE
// ======================================================

function renderPayments(payments) {

    const table =
        document.getElementById(
            "paymentTable"
        );


    if (!table) {

        return;

    }


    table.innerHTML = "";


    if (
        !payments ||
        payments.length === 0
    ) {

        table.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    style="
                        text-align:center;
                        padding:35px;
                        color:#64748b;
                    "
                >
                    No payment records found.
                </td>
            </tr>
        `;

        return;

    }


    payments.forEach(
        student => {

            const row =
                document.createElement("tr");


            const status =
                getPaymentStatus(student);


            const amount =
                getPaymentAmount(student);


            const date =
                formatDate(
                    getPaymentDate(student)
                );


            row.innerHTML = `

                <td>
                    ${escapeHtml(
                        student.id ?? "—"
                    )}
                </td>

                <td>
                    <strong>
                        ${escapeHtml(
                            student.fullname ||
                            student.name ||
                            "—"
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(
                        student.email ||
                        "—"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        student.event ||
                        "—"
                    )}
                </td>

                <td>
                    <strong>
                        ₹${amount.toLocaleString(
                            "en-IN"
                        )}
                    </strong>
                </td>

                <td>
                    <span
                        class="status-badge ${status.toLowerCase()}"
                    >
                        ${escapeHtml(status)}
                    </span>
                </td>

                <td>
                    ${escapeHtml(date)}
                </td>

                <td>
                    <button
                        class="receipt-view-btn"
                        onclick="viewReceipt(${Number(student.id)})"
                    >
                        <i
                            class="fa-solid fa-receipt"
                        ></i>

                        View
                    </button>
                </td>

            `;


            table.appendChild(row);

        }
    );

}


// ======================================================
// NORMALIZE STATUS
// ======================================================

function normalizeStatus(status) {

    if (!status) {

        return "Pending";

    }


    const value =
        String(status)
            .trim()
            .toLowerCase();


    if (
        value === "paid" ||
        value === "successful" ||
        value === "success" ||
        value === "completed"
    ) {

        return "Paid";

    }


    return "Pending";

}


// ======================================================
// UPDATE STATISTICS
// ======================================================

function updateStatistics(payments) {

    const paid =
        payments.filter(
            payment =>
                getPaymentStatus(payment) ===
                "Paid"
        );


    const pending =
        payments.filter(
            payment =>
                getPaymentStatus(payment) ===
                "Pending"
        );


    const totalRevenue =
        paid.reduce(
            (total, payment) => {

                return total +
                    getPaymentAmount(payment);

            },
            0
        );


    const amounts =
        paid.map(
            payment =>
                getPaymentAmount(payment)
        );


    const highest =
        amounts.length > 0
            ? Math.max(...amounts)
            : 0;


    const average =
        paid.length > 0
            ? totalRevenue / paid.length
            : 0;


    const todayPayments =
        payments.filter(
            payment =>
                isToday(
                    getPaymentDate(payment)
                )
        );


    const todayPaid =
        todayPayments.filter(
            payment =>
                getPaymentStatus(payment) ===
                "Paid"
        );


    const todayRevenue =
        todayPaid.reduce(
            (total, payment) => {

                return total +
                    getPaymentAmount(payment);

            },
            0
        );


    setText(
        "totalRevenue",
        formatRupee(totalRevenue)
    );


    setText(
        "paidPayments",
        paid.length
    );


    setText(
        "pendingPayments",
        pending.length
    );


    setText(
        "todayRevenueCard",
        formatRupee(todayRevenue)
    );


    setText(
        "transactionCount",
        payments.length
    );


    setText(
        "highestPayment",
        formatRupee(highest)
    );


    setText(
        "averagePayment",
        formatRupee(
            Math.round(average)
        )
    );


    setText(
        "todayTransactions",
        todayPaid.length
    );

}


// ======================================================
// REVENUE REPORT
// ======================================================

function updateRevenueReport(payments) {

    const paid =
        payments.filter(
            payment =>
                getPaymentStatus(payment) ===
                "Paid"
        );


    const todayRevenue =
        calculateRevenue(
            paid,
            1
        );


    const weekRevenue =
        calculateRevenue(
            paid,
            7
        );


    const monthRevenue =
        calculateRevenue(
            paid,
            30
        );


    const overallRevenue =
        paid.reduce(
            (total, payment) => {

                return total +
                    getPaymentAmount(payment);

            },
            0
        );


    setText(
        "todayRevenueReport",
        formatRupee(todayRevenue)
    );


    setText(
        "weekRevenue",
        formatRupee(weekRevenue)
    );


    setText(
        "monthRevenue",
        formatRupee(monthRevenue)
    );


    setText(
        "overallRevenue",
        formatRupee(overallRevenue)
    );

}


// ======================================================
// CALCULATE REVENUE
// ======================================================

function calculateRevenue(
    payments,
    days
) {

    const now =
        new Date();


    const start =
        new Date();


    start.setDate(
        now.getDate() -
        (days - 1)
    );


    start.setHours(
        0,
        0,
        0,
        0
    );


    return payments.reduce(
        (total, payment) => {

            const date =
                parseDate(
                    getPaymentDate(payment)
                );


            if (
                date &&
                date >= start &&
                date <= now
            ) {

                return total +
                    getPaymentAmount(payment);

            }


            return total;

        },
        0
    );

}


// ======================================================
// RECENT PAYMENTS
// ======================================================

function updateRecentPayments(payments) {

    const list =
        document.getElementById(
            "recentPayments"
        );


    if (!list) {

        return;

    }


    list.innerHTML = "";


    const recent =
        [...payments]
            .sort(
                (a, b) => {

                    const dateA =
                        parseDate(
                            getPaymentDate(a)
                        ) || 0;


                    const dateB =
                        parseDate(
                            getPaymentDate(b)
                        ) || 0;


                    return dateB - dateA;

                }
            )
            .slice(0, 5);


    if (recent.length === 0) {

        list.innerHTML = `
            <li>
                No payments yet.
            </li>
        `;

        return;

    }


    recent.forEach(
        payment => {

            const li =
                document.createElement("li");


            li.innerHTML = `

                <div>

                    <strong>
                        ${escapeHtml(
                            payment.fullname ||
                            payment.name ||
                            "Student"
                        )}
                    </strong>

                    <small>
                        ${escapeHtml(
                            payment.event ||
                            "Event"
                        )}
                    </small>

                </div>

                <strong>
                    ${formatRupee(
                        getPaymentAmount(payment)
                    )}
                </strong>

            `;


            list.appendChild(li);

        }
    );

}


// ======================================================
// SEARCH AND FILTER
// ======================================================

function initializeSearch() {

    const search =
        document.getElementById(
            "paymentSearchTable"
        );


    const filter =
        document.getElementById(
            "paymentFilter"
        );


    if (search) {

        search.addEventListener(
            "input",
            applyFilters
        );

    }


    if (filter) {

        filter.addEventListener(
            "change",
            applyFilters
        );

    }

}


function applyFilters() {

    const search =
        (
            document.getElementById(
                "paymentSearchTable"
            )?.value || ""
        )
            .toLowerCase()
            .trim();


    const filter =
        document.getElementById(
            "paymentFilter"
        )?.value || "";


    const filtered =
        allPayments.filter(
            payment => {

                const status =
                    getPaymentStatus(payment);


                const searchable =
                    [

                        payment.id,

                        payment.fullname,

                        payment.name,

                        payment.email,

                        payment.event,

                        getTransactionId(payment),

                        getPaymentMethod(payment)

                    ]
                        .join(" ")
                        .toLowerCase();


                const matchesSearch =
                    !search ||
                    searchable.includes(search);


                const matchesFilter =
                    !filter ||
                    status === filter;


                return (
                    matchesSearch &&
                    matchesFilter
                );

            }
        );


    renderPayments(filtered);

}


// ======================================================
// VIEW RECEIPT
// ======================================================

function viewReceipt(id) {

    localStorage.setItem(
        "viewRegistrationId",
        id
    );


    window.location.href =
        "receipt.html?id=" +
        encodeURIComponent(id);

}


// ======================================================
// LOGOUT
// ======================================================

async function logout() {

    try {

        await fetch(
            BACKEND_URL + "/logout",
            {
                credentials: "include"
            }
        );

    }

    catch (error) {

        console.log(error);

    }


    window.location.href =
        "admin-login.html";

}


// ======================================================
// HELPERS
// ======================================================

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


function formatRupee(amount) {

    return (
        "₹" +
        Number(
            amount || 0
        ).toLocaleString(
            "en-IN"
        )
    );

}


function parseDate(value) {

    if (!value) {

        return null;

    }


    const date =
        new Date(value);


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return null;

    }


    return date;

}


function formatDate(value) {

    const date =
        parseDate(value);


    if (!date) {

        return "—";

    }


    return date.toLocaleString(
        "en-IN",
        {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


function isToday(value) {

    const date =
        parseDate(value);


    if (!date) {

        return false;

    }


    const today =
        new Date();


    return (

        date.getDate() ===
        today.getDate()

        &&

        date.getMonth() ===
        today.getMonth()

        &&

        date.getFullYear() ===
        today.getFullYear()

    );

}


function escapeHtml(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ======================================================
// AUTO REFRESH
// ======================================================

setInterval(
    loadPayments,
    10000
);