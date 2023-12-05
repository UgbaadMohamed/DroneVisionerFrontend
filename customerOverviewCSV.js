const csvmaker = function (data) {
    // Extract only the required fields
    const extractedData = data.map(({ first_Name, last_Name, registration_date }) => ({
        first_Name,
        last_Name,
        registration_date
    }));

    // Sort the data by registration_date
    extractedData.sort((a, b) => new Date(a.registration_date) - new Date(b.registration_date));

    const headers = Object.keys(extractedData[0]);

    // Create an array to store lines of the CSV
    const csvLines = [];

    // Add headers to the CSV
    csvLines.push(headers.join(','));

    let currentMonth = '';

    // Iterate through the sorted data
    extractedData.forEach(entry => {
        const entryMonth = new Date(entry.registration_date).toLocaleString('en-US', { month: 'long' });

        // Check if a new month is encountered
        if (entryMonth !== currentMonth) {
            csvLines.push(`\n${entryMonth}`);
            csvLines.push(headers.join(','));
            currentMonth = entryMonth;
        }

        // Add data to the CSV
        csvLines.push(headers.map(header => entry[header]).join(','));
    });

    return csvLines.join('\n');
}

const download = function (csvdata) {
    const blob = new Blob([csvdata], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'download.csv');
    a.click();
}

const get = async function () {
    try {
        const response = await fetch('http://localhost:8085/all');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const csvdata = csvmaker(data);
        download(csvdata);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('action');
    if (btn) {
        btn.addEventListener('click', get);
    } else {
        console.error('Element with ID "action" not found.');
    }
});
