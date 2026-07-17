// ======================================================
// COLLEGE EVENT MANAGER
// PAYMENTS.JS
// PROFESSIONAL VERSION
// ======================================================

let payments=[];

// ======================================================
// PAGE LOAD
// ======================================================

window.addEventListener("load",async()=>{

initializeSidebar();

await checkLogin();

});

// ======================================================
// LOGIN CHECK
// ======================================================

async function checkLogin(){

try{

const response=await fetch("/api/current-user",{

credentials:"include"

});

const data=await response.json();

if(!data.loggedIn){

window.location.href="admin-login.html";

return;

}

await loadPayments();

}

catch(err){

console.log(err);

window.location.href="admin-login.html";

}

}

// ======================================================
// LOAD PAYMENTS
// ======================================================

async function loadPayments(){

try{

const response=await fetch("/students",{

credentials:"include"

});

payments=await response.json();

updateSummaryCards();

loadPaymentTable();

loadRecentPayments();

updateRevenueReport();

}

catch(err){

console.log(err);

}

}
// ======================================================
// SUMMARY CARDS
// ======================================================

function updateSummaryCards(){

// Total Revenue

const totalRevenue =
payments.reduce((sum,p)=>sum+Number(p.amount||0),0);

document.getElementById("totalRevenue").innerText =
"₹"+totalRevenue;

// Paid Payments

const paid =
payments.filter(p=>p.payment_status==="Paid").length;

document.getElementById("paidPayments").innerText =
paid;

// Pending Payments

const pending =
payments.filter(p=>p.payment_status!=="Paid").length;

document.getElementById("pendingPayments").innerText =
pending;

// Today's Revenue

const today =
new Date().toDateString();

const todayPayments =
payments.filter(p=>
p.createdAt &&
new Date(p.createdAt).toDateString()===today
);

const todayRevenue =
todayPayments.reduce(
(sum,p)=>sum+Number(p.amount||0),
0
);

document.getElementById("todayRevenueCard").innerText =
"₹"+todayRevenue;

// Statistics

document.getElementById("transactionCount").innerText =
payments.length;

const highest =
Math.max(
...payments.map(p=>Number(p.amount||0)),
0
);

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

if(!tbody) return;

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

${
payment.createdAt
?
new Date(payment.createdAt).toLocaleDateString()
:
"-"
}

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
// PAID / PENDING FILTER
// ======================================================

const paymentFilter =
document.getElementById("paymentFilter");

if(paymentFilter){

paymentFilter.addEventListener("change",filterPayments);

}

function filterPayments(){

const status =
document.getElementById("paymentFilter").value;

const rows =
document.querySelectorAll("#paymentTable tr");

rows.forEach(row=>{

if(status===""){

row.style.display="";

return;

}

const rowStatus =
row.cells[5].innerText.trim();

if(rowStatus===status){

row.style.display="";

}else{

row.style.display="none";

}

});

}

// ======================================================
// SEARCH
// ======================================================

const paymentSearch =
document.getElementById("paymentSearchTable");

if(paymentSearch){

paymentSearch.addEventListener("keyup",searchPayments);

}

function searchPayments(){

const value =
paymentSearch.value.toLowerCase();

document.querySelectorAll("#paymentTable tr")
.forEach(row=>{

row.style.display =
row.innerText.toLowerCase().includes(value)
?
""
:
"none";

});

}

// ======================================================
// RECENT PAYMENTS
// ======================================================

function loadRecentPayments(){

const recent =
document.getElementById("recentPayments");

if(!recent) return;

recent.innerHTML="";

payments
.slice()
.reverse()
.slice(0,8)
.forEach(payment=>{

recent.innerHTML += `

<li>

💳 ${payment.fullname}

<span>

₹${payment.amount}

</span>

</li>

`;

});

}

// ======================================================
// REVENUE REPORT
// ======================================================

function updateRevenueReport(){

const total =
payments.reduce(

(sum,p)=>sum+Number(p.amount||0),

0

);

document.getElementById("todayRevenueReport").innerText =
"₹"+total;

document.getElementById("weekRevenue").innerText =
"₹"+total;

document.getElementById("monthRevenue").innerText =
"₹"+total;

document.getElementById("overallRevenue").innerText =
"₹"+total;

}

// ======================================================
// RECEIPT
// ======================================================

function downloadReceipt(id){

const payment =
payments.find(p=>p.id===id);

if(!payment){

alert("Receipt not found.");

return;

}

window.open(

`receipt.html?id=${id}`,

"_blank"

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

if(!confirm("Logout from Admin Dashboard?"))

return;

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

// ======================================================
// AUTO REFRESH
// ======================================================

setInterval(()=>{

loadPayments();

},30000);

// ======================================================
// END OF PAYMENTS.JS
// ======================================================