const table = document.getElementById("certificateTable");

fetch("/students")
    .then(res => res.json())
    .then(data => {

        table.innerHTML = "";

        data.forEach(student => {

            table.innerHTML += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.fullname}</td>
                    <td>${student.event}</td>
                    <td>
                        <button onclick="generateCertificate(${student.id})">
                            Generate
                        </button>
                    </td>
                </tr>
            `;

        });

    });

function generateCertificate(id) {

    fetch("/certificate/" + id, {

        method: "PUT"

    })

    .then(res => res.json())

    .then(data => {

        if (data.success) {

            alert("Certificate Generated Successfully!");

            location.reload();

        } else {

            alert("Failed!");

        }

    });

}