document.addEventListener("DOMContentLoaded", function () {
    const isAuthenticated = sessionStorage.getItem("authenticated");

    if (!isAuthenticated) {
        sessionStorage.setItem("redirectUrl", window.location.href);
        window.location.href = "../templates/Login.html";
    }
});



