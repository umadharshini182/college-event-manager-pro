// ======================================================
// COLLEGE EVENT MANAGER
// PAYMENTS.JS
// ======================================================

let payments = [];

// ======================================================
// PAGE LOAD
// ======================================================

window.addEventListener("load", () => {

    checkLogin();

    initializeSidebar();

});

// ======================================================
// LOGIN CHECK
// ======================================================

async function checkLogin() {

    try {

        const response = await fetch("/api/current-user", {
            credentials: "include"
        });

        const data = await response.json();

        if (!data.loggedIn) {

            window.location.href = "admin-login.html";

            return;

        }

        loadPayments();

    }

    catch (err) {

        console.log(err);

        window.location.href = "admin-login.html";

    }

}

// ======================================================
// LOAD PAYMENTS
// ======================================================

async function loadPayments() {

    try {

        const response = await fetch("/students", {
            credentials: "include"
        });

        payments = await response.json();

        updatePaymentSummary();

        loadPaymentTable();

    }

    catch (err) {

        console.log(err);

    }

}
// ======================================================
// PAYMENT SUMMARY
// ======================================================

function updatePaymentSummary(){

    // Total Revenue

    const totalRevenue =
    payments.reduce(

        (sum,p)=>sum+Number(p.amount || 0),

        0

    );

    document.getElementById("totalRevenue").innerText =
    "₹"+totalRevenue;

    // Paid Payments

    const paid =
    payments.filter(
        p=>p.payment_status==="Paid"
    ).length;

    document.getElementById("paidPayments").innerText =
    paid;

    // Pending Payments

    const pending =
    payments.filter(
        p=>p.payment_status!=="Paid"
    ).length;

    document.getElementById("pendingPayments").innerText =
    pending;

    // Today's Revenue

    const today =
    new Date().toISOString().split("T")[0];

    const todayPayments =
    payments.filter(p=>

        p.createdAt &&
        p.createdAt.startsWith(today)

    );

    const todayRevenue =
    todayPayments.reduce(

        (sum,p)=>sum+Number(p.amount || 0),

        0

    );

    document.getElementById("todayRevenue").innerText =
    "₹"+todayRevenue;

    // Statistics

    document.getElementById("transactionCount").innerText =
    payments.length;

    const highest =
    Math.max(...payments.map(p=>Number(p.amount||0)),0);

    document.getElementById("highestPayment").innerText =
    "₹"+highest;

    const average =
    payments.length
    ?
    Math.round(totalRevenue/payments.length)
    :
    0;

    document.getElementById("averagePayment").innerText =
    "₹"+average;

    document.getElementById("todayTransactions").innerText =
    todayPayments.length;

}

// ======================================================
// PAYMENT TABLE
// ======================================================

function loadPaymentTable(){

    const tbody =
    document.getElementById("paymentTable");

    tbody.innerHTML="";

    payments.forEach(payment=>{

        tbody.innerHTML += `

<tr>

<td>${payment.id}</td>

<td>${payment.fullname}</td>

<td>${payment.email}</td>

<td>${payment.event}</td>

<td>₹${payment.amount}</td>

<td>

<span class="${
payment.payment_status==="Paid"
?
"paid"
:
"pending"
}">

${payment.payment_status}

</span>

</td>

<td>

${payment.createdAt
?
new Date(payment.createdAt)
.toLocaleDateString()
:
"-"}

</td>

<td>

<button
class="action-btn certificate-btn"
onclick="downloadReceipt(${payment.id})">

Receipt

</button>

</td>

</tr>

`;

    });

}

// ======================================================
// SEARCH PAYMENTS
// ======================================================

const paymentSearch =
document.getElementById("paymentSearch");

if(paymentSearch){

paymentSearch.onkeyup=function(){

const value=
this.value.toLowerCase();

const rows=
document.querySelectorAll(
"#paymentTable tr"
);

rows.forEach(row=>{

if(

row.innerText
.toLowerCase()
.includes(value)

){

row.style.display="";

}

else{

row.style.display="none";

}

});

};

}
// ======================================================
// DOWNLOAD RECEIPT
// ======================================================

function downloadReceipt(id){

    const payment =
    payments.find(p=>p.id===id);

    if(!payment){

        alert("Receipt not found.");

        return;

    }

    alert(
        "Receipt Download\n\n"+
        "Student : "+payment.fullname+"\n"+
        "Event : "+payment.event+"\n"+
        "Amount : ₹"+payment.amount+"\n"+
        "Status : "+payment.payment_status
    );

}

// ======================================================
// SIDEBAR
// ======================================================

function initializeSidebar(){

    const sidebar =
    document.getElementById("sidebar");

    const menuBtn =
    document.getElementById("menuBtn");

    const closeBtn =
    document.getElementById("closeSidebar");

    const overlay =
    document.getElementById("overlay");

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
// LOGOUT
// ======================================================

function logout(){

    if(!confirm("Logout from Admin Dashboard?")){

        return;

    }

    fetch("/logout",{

        credentials:"include"

    })

    .then(()=>{

        window.location.href="admin-login.html";

    });

}

// ======================================================
// AUTO REFRESH
// ======================================================

setInterval(()=>{

    loadPayments();

},30000);

// ======================================================
// END OF PAYMENTS.JS
// ======================================================