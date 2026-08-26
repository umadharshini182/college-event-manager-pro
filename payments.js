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

    console.log("PAYMENTS.JS LOADED");

    initializeSidebar();

    initializeSearch();

    loadPayments();

});

// ======================================================
// LOAD PAYMENTS
// ======================================================

async function loadPayments() {

    console.log("Loading payment records...");

    try {

        const response = await fetch(
            BACKEND_URL + "/students",
            {
                method: "GET"
            }
        );

        console.log(
            "Response status:",
            response.status
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

        if (!Array.isArray(data)) {

            console.error(
                "Backend did not return an array:",
                data
            );

            allPayments = [];

        } else {

            allPayments = data;

        }

        renderPayments(allPayments);

        updateStatistics(allPayments);

        updateRecentPayments(allPayments);

    }

    catch (error) {

        console.error(
            "PAYMENT LOADING ERROR:",
            error
        );

        showTableError(
            error.message
        );

    }

}

// ======================================================
// FIND PAYMENT TABLE
// ======================================================

function getPaymentTable() {

    return (
        document.getElementById("paymentTable") ||

        document.querySelector("#paymentTable tbody") ||

        document.querySelector(
            ".payment-table tbody"
        ) ||

        document.querySelector(
            "table tbody"
        )
    );

}

// ======================================================
// RENDER PAYMENTS
// ======================================================

function renderPayments(payments) {

    console.log(
        "Rendering payments:",
        payments.length
    );

    const table =
        getPaymentTable();

    if (!table) {

        console.error(
            "PAYMENT TABLE NOT FOUND!"
        );

        console.log(
            "Check your HTML table ID. It should be paymentTable."
        );

        return;

    }

    table.innerHTML = "";

    if (!payments || payments.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="8"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >
                    No payment records found.
                </td>
            </tr>
        `;

        return;

    }

    payments.forEach(student => {

        const status =
            getPaymentStatus(
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

        const transactionId =
            student.transaction_id ||
            "—";

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>
                ${escapeHtml(student.id)}
            </td>

            <td>
                <strong>
                    ${escapeHtml(
                        student.fullname
                    )}
                </strong>
            </td>

            <td>
                ${escapeHtml(
                    student.email
                )}
            </td>

            <td>
                ${escapeHtml(
                    student.event
                )}
            </td>

            <td>
                ₹${amount.toLocaleString(
                    "en-IN"
                )}
            </td>

            <td>
                <span class="status-badge ${status.toLowerCase()}">
                    ${status}
                </span>
            </td>

            <td>
                ${escapeHtml(
                    transactionId
                )}
            </td>

            <td>
                ${escapeHtml(
                    date
                )}
            </td>

        `;

        table.appendChild(row);

    });

    console.log(
        "Payment table rendered successfully"
    );

}

// ======================================================
// PAYMENT STATUS
// ======================================================

function getPaymentStatus(status) {

    if (!status) {

        return "Pending";

    }

    const value =
        String(status)
        .trim()
        .toLowerCase();

    if (
        value === "paid" ||
        value === "success" ||
        value === "successful"
    ) {

        return "Paid";

    }

    return "Pending";

}

// ======================================================
// STATISTICS
// ======================================================

function updateStatistics(payments) {

    const paidPayments =
        payments.filter(student =>
            getPaymentStatus(
                student.payment_status
            ) === "Paid"
        );

    const pendingPayments =
        payments.filter(student =>
            getPaymentStatus(
                student.payment_status
            ) === "Pending"
        );

    const totalRevenue =
        paidPayments.reduce(
            (total, student) => {

                return (
                    total +
                    Number(
                        student.amount || 0
                    )
                );

            },
            0
        );

    setElementText(
        "totalRevenue",
        formatRupee(totalRevenue)
    );

    setElementText(
        "paidPayments",
        paidPayments.length
    );

    setElementText(
        "pendingPayments",
        pendingPayments.length
    );

    setElementText(
        "transactionCount",
        payments.length
    );

    setElementText(
        "todayRevenue",
        formatRupee(
            getTodayRevenue(
                paidPayments
            )
        )
    );

    setElementText(
        "todayRevenueCard",
        formatRupee(
            getTodayRevenue(
                paidPayments
            )
        )
    );

}

// ======================================================
// TODAY REVENUE
// ======================================================

function getTodayRevenue(payments) {

    const today =
        new Date();

    return payments
        .filter(student => {

            const date =
                new Date(
                    student.payment_date ||
                    student.createdAt
                );

            return (
                date.getDate() ===
                    today.getDate() &&

                date.getMonth() ===
                    today.getMonth() &&

                date.getFullYear() ===
                    today.getFullYear()
            );

        })

        .reduce(
            (total, student) =>
                total +
                Number(
                    student.amount || 0
                ),
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
                    new Date(
                        a.payment_date ||
                        a.createdAt ||
                        0
                    );

                const dateB =
                    new Date(
                        b.payment_date ||
                        b.createdAt ||
                        0
                    );

                return dateB - dateA;

            }
        )
        .slice(0, 5);

    if (recent.length === 0) {

        list.innerHTML = `
            <li>No payments yet.</li>
        `;

        return;

    }

    recent.forEach(student => {

        const item =
            document.createElement("li");

        item.innerHTML = `

            <div>

                <strong>
                    ${escapeHtml(
                        student.fullname
                    )}
                </strong>

                <small>
                    ${escapeHtml(
                        student.event
                    )}
                </small>

            </div>

            <strong>
                ${formatRupee(
                    student.amount
                )}
            </strong>

        `;

        list.appendChild(item);

    });

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

// ======================================================
// APPLY FILTERS
// ======================================================

function applyFilters() {

    const searchElement =
        document.getElementById(
            "paymentSearchTable"
        );

    const filterElement =
        document.getElementById(
            "paymentFilter"
        );

    const search =
        searchElement
            ? searchElement.value
                .toLowerCase()
                .trim()
            : "";

    const filter =
        filterElement
            ? filterElement.value
            : "";

    const filtered =
        allPayments.filter(student => {

            const status =
                getPaymentStatus(
                    student.payment_status
                );

            const searchable =
                [
                    student.id,
                    student.fullname,
                    student.email,
                    student.event,
                    student.transaction_id,
                    student.payment_method
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

        });

    renderPayments(filtered);

}

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

    if (menuBtn && sidebar) {

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

    }

    if (closeBtn && sidebar) {

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

        console.error(error);

    }

    window.location.href =
        "admin-login.html";

}

// ======================================================
// TABLE ERROR
// ======================================================

function showTableError(message) {

    const table =
        getPaymentTable();

    if (!table) {

        return;

    }

    table.innerHTML = `

        <tr>

            <td
                colspan="8"
                style="
                    text-align:center;
                    padding:30px;
                    color:red;
                "
            >

                Unable to load payments.

                <br>

                <small>
                    ${escapeHtml(message)}
                </small>

            </td>

        </tr>

    `;

}

// ======================================================
// HELPERS
// ======================================================

function setElementText(id, value) {

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
        ).toLocaleString("en-IN")
    );

}

function formatDate(value) {

    if (!value) {

        return "—";

    }

    const date =
        new Date(value);

    if (
        isNaN(
            date.getTime()
        )
    ) {

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

function escapeHtml(value) {

    return String(
        value ?? ""
    )

    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}

// ======================================================
// AUTO REFRESH
// ======================================================

setInterval(
    loadPayments,
    10000
);