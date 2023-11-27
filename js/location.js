function suggestAddress() {
    const userInput = document.getElementById('location').value;

    // Check if the user input is not empty and has at least 2 characters
    if (userInput.trim() === '' || userInput.length < 2) {
        console.error('Error: Invalid input');
        return;
    }

    // Use OpenCage Geocoding API to fetch Danish address suggestions
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(userInput)}&countrycode=dk&key=a90147f0678b432386f97509921fa8ce`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Invalid response from the API');
            }
            return response.json();
        })
        .then(data => {
            const suggestionsContainer = document.getElementById('suggestionsContainer');
            suggestionsContainer.innerHTML = '';

            if (data.results && data.results.length > 0) {
                const suggestionList = document.createElement('ul');
                suggestionList.setAttribute('id', 'suggestionList');

                data.results.forEach(result => {
                    const suggestionItem = document.createElement('li');
                    suggestionItem.textContent = result.formatted;
                    suggestionItem.addEventListener('click', () => {
                        document.getElementById('location').value = result.formatted;
                        suggestionsContainer.innerHTML = ''; // Remove suggestions after selection
                        addMarker(result.geometry);
                    });
                    suggestionList.appendChild(suggestionItem);
                });

                suggestionsContainer.appendChild(suggestionList);
            }
        })
        .catch(error => {
            console.error('Error fetching suggestions:', error);
        });
}
