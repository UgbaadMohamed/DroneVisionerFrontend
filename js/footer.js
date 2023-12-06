// Your JavaScript code for fetching and inserting the footer

// Function to dynamically insert a script into the document
function loadScript(src, crossorigin) {
    const script = document.createElement('script');
    script.src = src;
    script.crossOrigin = crossorigin || 'anonymous';
    document.head.appendChild(script);
}

// Fetch and insert the footer
fetch('/templates/footer.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('footer-placeholder').innerHTML = html;

        // Check if Font Awesome script is not already loaded
        if (!window.FontAwesomeKitConfig) {
            // Load Font Awesome script dynamically
            loadScript('https://kit.fontawesome.com/d17da6709b.js');
        }
    });
