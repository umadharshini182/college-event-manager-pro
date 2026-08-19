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

    loadPayments();

    initializeSearch();

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

        console.log(
            "Sidebar elements missing"
        );

        return;

    }


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
// LOAD PAYMENTS
// ======================================================

async function loadPayments() {

    try {

        console.log(
            "Loading payment records..."
        );


        const response =
            await fetch(
                BACKEND_URL +
                "/students"
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
            "Payment data:",
            data
        );


        allPayments =
            Array.isArray(data)
                ? data
                : [];


        renderPayments(
            allPayments
        );


        updateStatistics(
            allPayments
        );


        updateRecentPayments(
            allPayments
        );


        updateRevenueReport(
            allPayments
        );


    }

    catch (error) {

        console.error(
            "Payment loading error:",
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
                            color:#ef4444;
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
// RENDER PAYMENT TABLE
// ======================================================

function renderPayments(
    payments
) {

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
        (student) => {

            const row =
                document.createElement(
                    "tr"
                );


            const status =
                normalizeStatus(
                    student.payment_status
                );


            const amount =
                Number(
                    student.amount || 0
                );


            const date =
                formatDate(
                    student.payment_date ||
                    student.createdAt
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

                        ${escapeHtml(
                            status
                        )}

                    </span>

                </td>


                <td>

                    ${escapeHtml(
                        date
                    )}

                </td>


                <td>

                    <button
                        class="receipt-view-btn"
                        onclick="viewReceipt(
                            ${Number(student.id)}
                        )"
                    >

                        <i
                            class="fa-solid fa-receipt"
                        ></i>

                        View

                    </button>

                </td>

            `;


            table.appendChild(
                row
            );

        }
    );

}


// ======================================================
// NORMALIZE PAYMENT STATUS
// ======================================================

function normalizeStatus(
    status
) {

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
        value === "success"
    ) {

        return "Paid";

    }


    return "Pending";

}


// ======================================================
// STATISTICS
// ======================================================

function updateStatistics(
    payments
) {

    const paid =
        payments.filter(
            payment =>
                normalizeStatus(
                    payment.payment_status
                ) === "Paid"
        );


    const pending =
        payments.filter(
            payment =>
                normalizeStatus(
                    payment.payment_status
                ) === "Pending"
        );


    const totalRevenue =
        paid.reduce(
            (
                total,
                payment
            ) => {

                return total +
                    Number(
                        payment.amount || 0
                    );

            },
            0
        );


    const amounts =
        payments.map(
            payment =>
                Number(
                    payment.amount || 0
                )
        );


    const highest =
        amounts.length
            ? Math.max(...amounts)
            : 0;


    const average =
        payments.length
            ? totalRevenue /
              paid.length
            : 0;


    const todayPayments =
        payments.filter(
            payment =>
                isToday(
                    payment.payment_date ||
                    payment.createdAt
                )
        );


    const todayPaid =
        todayPayments.filter(
            payment =>
                normalizeStatus(
                    payment.payment_status
                ) === "Paid"
        );


    const todayRevenue =
        todayPaid.reduce(
            (
                total,
                payment
            ) => {

                return total +
                    Number(
                        payment.amount || 0
                    );

            },
            0
        );


    setText(
        "totalRevenue",
        formatRupee(
            totalRevenue
        )
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
        formatRupee(
            todayRevenue
        )
    );


    setText(
        "transactionCount",
        payments.length
    );


    setText(
        "highestPayment",
        formatRupee(
            highest
        )
    );


    setText(
        "averagePayment",
        formatRupee(
            Math.round(
                average || 0
            )
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

function updateRevenueReport(
    payments
) {

    const paid =
        payments.filter(
            payment =>
                normalizeStatus(
                    payment.payment_status
                ) === "Paid"
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
            (
                total,
                payment
            ) => {

                return total +
                    Number(
                        payment.amount || 0
                    );

            },
            0
        );


    setText(
        "todayRevenueReport",
        formatRupee(
            todayRevenue
        )
    );


    setText(
        "weekRevenue",
        formatRupee(
            weekRevenue
        )
    );


    setText(
        "monthRevenue",
        formatRupee(
            monthRevenue
        )
    );


    setText(
        "overallRevenue",
        formatRupee(
            overallRevenue
        )
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
        (
            total,
            payment
        ) => {

            const date =
                parseDate(
                    payment.payment_date ||
                    payment.createdAt
                );


            if (
                date &&
                date >= start &&
                date <= now
            ) {

                return total +
                    Number(
                        payment.amount || 0
                    );

            }


            return total;

        },
        0
    );

}


// ======================================================
// RECENT PAYMENTS
// ======================================================

function updateRecentPayments(
    payments
) {

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
                (
                    a,
                    b
                ) => {

                    const dateA =
                        parseDate(
                            a.payment_date ||
                            a.createdAt
                        ) || 0;


                    const dateB =
                        parseDate(
                            b.payment_date ||
                            b.createdAt
                        ) || 0;


                    return dateB - dateA;

                }
            )
            .slice(
                0,
                5
            );


    if (
        recent.length === 0
    ) {

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
                document.createElement(
                    "li"
                );


            li.innerHTML = `

                <div>

                    <strong>
                        ${escapeHtml(
                            payment.fullname ||
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
                        Number(
                            payment.amount || 0
                        )
                    )}
                </strong>

            `;


            list.appendChild(
                li
            );

        }
    );

}


// ======================================================
// SEARCH + FILTER
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
                    normalizeStatus(
                        payment.payment_status
                    );


                const searchable =
                    [

                        payment.id,

                        payment.fullname,

                        payment.email,

                        payment.event,

                        payment.transaction_id,

                        payment.payment_method

                    ]
                        .join(" ")
                        .toLowerCase();


                const matchesSearch =
                    !search ||
                    searchable.includes(
                        search
                    );


                const matchesFilter =
                    !filter ||
                    status === filter;


                return (
                    matchesSearch &&
                    matchesFilter
                );

            }
        );


    renderPayments(
        filtered
    );

}


// ======================================================
// VIEW RECEIPT
// ======================================================

function viewReceipt(
    id
) {

    localStorage.setItem(
        "viewRegistrationId",
        id
    );


    window.location.href =
        "receipt.html?id=" +
        encodeURIComponent(
            id
        );

}


// ======================================================
// LOGOUT
// ======================================================

async function logout() {

    try {

        await fetch(
            BACKEND_URL +
            "/logout",
            {
                credentials:
                    "include"
            }
        );

    }

    catch (error) {

        console.log(
            error
        );

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
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


function formatRupee(
    amount
) {

    return (
        "₹" +
        Number(
            amount || 0
        ).toLocaleString(
            "en-IN"
        )
    );

}


function parseDate(
    value
) {

    if (!value) {

        return null;

    }


    const date =
        new Date(
            value
        );


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return null;

    }


    return date;

}


function formatDate(
    value
) {

    const date =
        parseDate(
            value
        );


    if (!date) {

        return "—";

    }


    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


function isToday(
    value
) {

    const date =
        parseDate(
            value
        );


    if (!date) {

        return false;

    }


    const today =
        new Date();


    return (
        date.getDate() ===
            today.getDate() &&

        date.getMonth() ===
            today.getMonth() &&

        date.getFullYear() ===
            today.getFullYear()
    );

}


function escapeHtml(
    value
) {

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