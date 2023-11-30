document.addEventListener('DOMContentLoaded', function() {
    // This code will run after the DOM is fully loaded
    fetch('/templates/header.html')
        .then(response => response.text())
        .then(html => document.getElementById('header-placeholder').innerHTML = html);
});


    function navigateToPriser() {
    window.location.href = '/templates/pricing.html';
}

    function navigateToOmOs() {
    window.location.href = '/templates/aboutUs.html';
}
