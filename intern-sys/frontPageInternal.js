import { getToken } from './security.js';

fetch('../templates/customerOverview.html', {
    headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
    }
})
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to fetch customerOverview.html: ${response.statusText}`);
        }
        return response.text();
    })
    .then(html => {
        document.getElementById('customerOverview').innerHTML = html;
    })
    .catch(error => console.error('Error:', error));