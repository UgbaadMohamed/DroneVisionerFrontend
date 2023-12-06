function showPrice(paymentId, hardcodedPrice) {
    document.getElementById('price').innerText = `Price: ${hardcodedPrice}`;

    document.getElementById('pricePopup').style.display = 'block';

    savePriceToDatabase(paymentId, hardcodedPrice);
}

function savePriceToDatabase(paymentId, price) {
    const data = {
        paymentId: paymentId,
        price: price
    };

    fetch('http://localhost:8085/updatePrice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Price saved successfully:', data);
        })
        .catch(error => {
            console.error('Error saving price:', error);
        });
}

function closePopup() {
    // Close the popup
    document.getElementById('pricePopup').style.display = 'none';
}