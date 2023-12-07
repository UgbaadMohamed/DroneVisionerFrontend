fetch('/intern-sys/frontPageInternal.html')
    .then(response => response.text())
    .then(html => document.getElementById('internal-placeholder').innerHTML = html);

