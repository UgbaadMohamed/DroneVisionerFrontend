const url = 'http://localhost:8085';
const div = document.getElementById('container');

function signup(event) {
    event.preventDefault();

    const usernameField = document.getElementById("usernameField").value;
    const passwordField = document.getElementById("passwordField").value;

    let payload = {
        username: usernameField,
        password: passwordField
    };

    console.log("Payload:", payload);

    payload = JSON.stringify(payload);

    fetch(`${url}/signup`, {
        method: "POST",
        body: payload,
        headers: {'content-type': 'application/json'}
    })
        .then(function (res) {
            console.log("Response:", res); // Log the response before parsing it
            return res.json();
        })
        .then(function (data) {
            console.log("Data:", data); // Log the parsed data
            //printThis(div, JSON.stringify(data), "green");
        })
        .catch(function (error) {
            console.error("Error:", error); // Log any errors that occurred
        });
}

function printThis(mydiv, txt, color) {
    mydiv.insertAdjacentHTML(
        'beforeend',
        `<span style="background-color: ${color}">${txt}</span>`,
    );
}


document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signupForm');
        signupForm.addEventListener('submit', signup);

});


