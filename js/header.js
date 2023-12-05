
fetch('/templates/header.html')
        .then(response => response.text())
        .then(html => document.getElementById('header-placeholder').innerHTML = html);


function navigateToPriser() {
    window.location.href = 'pricing.html';
}

function navigateToOmOs() {
    window.location.href = 'aboutUs.html';
}
