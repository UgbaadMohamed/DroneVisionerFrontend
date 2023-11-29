function checkDroneZone() {
    const addressInput = document.getElementById('addressInput');
    const resultDiv = document.getElementById('result');
    const suggestionsDiv = document.getElementById('suggestions');
    const droneMap = document.getElementById('droneMap');

    const address = addressInput.value;

    if (address.trim() === '') {
        resultDiv.innerHTML = '<p>Indtast venligst en adresse.</p>';
        return;
    }

    const apiKey = 'YOUR_API_KEY';
    const addressApiUrl = `https://dawa.aws.dk/adresser/autocomplete?q=${encodeURIComponent(address)}&api-key=${apiKey}`;

    fetch(addressApiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                resultDiv.innerHTML = '<p>Ugyldig adresse. Vælg venligst en adresse fra forslagene.</p>';
                return;
            }

            const suggestions = data.map(item => item.tekst);
            suggestionsDiv.innerHTML = suggestions.map(suggestion => `<p>${suggestion}</p>`).join('');

            const selectedAddress = data[0].tekst; // Vælg den første adresse fra forslagene

            const droneZoneApiUrl = `https://api.regnecentralen.dk/dronezone/v1/zone?address=${encodeURIComponent(selectedAddress)}&api_key=${apiKey}`;

            return fetch(droneZoneApiUrl);
        })
        .then(response => response.json())
        .then(data => {
            if (data.isAllowed) {
                resultDiv.innerHTML = `<p>Droneflyvning er tilladt i denne zone.</p>`;
                droneMap.style.fill = 'green'; // Farve grøn, hvis droneflyvning er tilladt
            } else {
                resultDiv.innerHTML = `<p>Droneflyvning er ikke tilladt i denne zone.</p>`;
                droneMap.style.fill = 'red'; // Farve rød, hvis droneflyvning ikke er tilladt
            }
        })
        .catch(error => {
            resultDiv.innerHTML = `<p>Der opstod en fejl: ${error.message}</p>`;
            droneMap.style.fill = 'gray'; // Farve grå ved fejl
        });

    // Ryd adresseforslag efter tjek
    suggestionsDiv.innerHTML = '';
}


