document.addEventListener("DOMContentLoaded", function () {
    // Select the form and the button
    const form = document.querySelector("form");
    const loginButton = document.querySelector(".btn-primary");

    // Add an event listener to the button
    loginButton.addEventListener("click", function () {
    // Select the username and password input fields
    const usernameInput = document.getElementById("form2Example11");
    const passwordInput = document.getElementById("form2Example22");

    // Get the values entered by the user
    const enteredUsername = usernameInput.value.trim();
    const enteredPassword = passwordInput.value.trim();

    // Check if the entered credentials match the hardcoded ones
    if (enteredUsername === "admin520" && enteredPassword === "12345678") {
    // Redirect to frontPageInternal.html for successful login
    window.location.href = "frontPageInternal.html";
} else {
    // Display an error message for unsuccessful login
    alert("forkert brugernavn eller adgangskode!.");
}
});
});
