const url = 'http://localhost:8085';
const div = document.getElementById('container');

function login(event) {
    event.preventDefault();

    const usernameField = document.getElementById("usernameField").value;
    const passwordField = document.getElementById("passwordField").value;

    let payload = {
        username: usernameField,
        password: passwordField
    };

    payload = JSON.stringify(payload);

    fetch(`${url}/login`, {
        method: "POST",
        body: payload,
        headers: { 'content-type': 'application/json' }
    })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Invalid username or password');
            }
        })
        .then(function (data) {
            localStorage.setItem('user', JSON.stringify(data));
            window.location.href = '/DroneVisionerFrontend/intern-sys/frontPageInternal.html';
        })
        .catch(function (error) {
            //printThis(div, error.message, "red");
        });
}

function printThis(mydiv, txt, color) {
        mydiv.insertAdjacentHTML(
            'beforeend',
            `<span style="background-color: ${color}">${txt}</span>`,
        );
    }


document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', login);

});



export function getToken() {
    const localStorageUser = JSON.parse(localStorage.getItem('user'));
    return localStorageUser.token
}

