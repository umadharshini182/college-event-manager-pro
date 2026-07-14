const form = document.querySelector("form");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    try {
        const response = await fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (data.success) {
            window.location.href = "/admin.html";
        } else {
            alert("Invalid email or password");
        }

    } catch (err) {
        console.log(err);
        alert("Gateway communication error.");
    }
});
