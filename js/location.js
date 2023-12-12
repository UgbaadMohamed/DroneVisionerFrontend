function suggestAddress() {
    const inputElement = document.getElementById('location');
    const suggestionsContainer = document.getElementById('suggestionsContainer');

    // Check if the user input is not empty and has at least 2 characters
    const userInput = inputElement.value.trim();
    if (userInput === '' || userInput.length < 2) {
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
            // Clear previous suggestions
            suggestionsContainer.innerHTML = '';

            if (data.results && data.results.length > 0) {
                const suggestionList = document.createElement('ul');
                suggestionList.setAttribute('id', 'suggestionList');

                data.results.forEach(result => {
                    const suggestionItem = document.createElement('li');
                    suggestionItem.textContent = result.formatted;
                    suggestionItem.addEventListener('click', () => {
                        inputElement.value = result.formatted;
                        suggestionsContainer.innerHTML = ''; // Remove suggestions after selection
                        addMarker(result.geometry);
                    });
                    suggestionList.appendChild(suggestionItem);
                });

                suggestionsContainer.appendChild(suggestionList);

                // Position suggestionsContainer underneath the input field
                suggestionsContainer.style.position = 'absolute';
                suggestionsContainer.style.top = inputElement.offsetTop + inputElement.offsetHeight + 'px';
                suggestionsContainer.style.left = inputElement.offsetLeft + 'px';

                // Adjust the position of elements below the suggestionsContainer
                const elementsToMove = document.querySelectorAll('.elements-to-move');
                elementsToMove.forEach(element => {
                    element.style.marginTop = suggestionsContainer.offsetHeight + 'px';
                });
            }
        })
        .catch(error => {
            console.error('Error fetching suggestions:', error);
        });
}



//og når klikket udenfor boksen, så skal den lukke