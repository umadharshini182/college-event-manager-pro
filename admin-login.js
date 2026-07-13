const form = document.getElementById("loginForm");

const toggle = document.getElementById("togglePassword");

const password = document.getElementById("password");

toggle.onclick = () => {

    if(password.type==="password"){

        password.type="text";

        toggle.classList.replace("fa-eye","fa-eye-slash");

    }

    else{

        password.type="password";

        toggle.classList.replace("fa-eye-slash","fa-eye");

    }

};

form.addEventListener("submit", async function(e){

    e.preventDefault();

    const email=document.getElementById("email").value;

    const pass=document.getElementById("password").value;

    const btn=document.getElementById("loginBtn");

    btn.innerHTML="Logging in...";

    btn.disabled=true;

    try{

        const res=await fetch("http://localhost:5000/auth/login",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                email,
                password:pass
            })

        });

        const data=await res.json();

        if(data.success){

            window.location.href="http://localhost:5000/dashboard";

        }

        else{

            alert("Invalid Email or Password");

            btn.innerHTML="Login";

            btn.disabled=false;

        }

    }

    catch{

        alert("Server Error");

        btn.innerHTML="Login";

        btn.disabled=false;

    }

});