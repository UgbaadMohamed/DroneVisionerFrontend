// Function to get customer data for each month
async function getCustomerData() {
    try {
        const response = await fetch('http://localhost:8085/all');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const rawData = await response.json();
        const customerData = processCustomerData(rawData);
        createCharts(customerData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to process raw customer data and create a dataset for each year
function processCustomerData(rawData) {
    // Assuming rawData is an array of objects with 'registration_date' property
    const customerData = {};

    // Iterate through each data point and count registrations for each year
    rawData.forEach(dataPoint => {
        const year = new Date(dataPoint.registration_date).getFullYear();
        const month = new Date(dataPoint.registration_date).toLocaleString('default', {
            month: 'long'
        });

        // Initialize the dataset for the year if not present
        if (!customerData[year]) {
            customerData[year] = {};
        }

        // Initialize the count for the month if not present
        customerData[year][month] = (customerData[year][month] || 0) + 1;
    });

    return customerData;
}

function createCharts(customerData) {
    // Get the container to append charts
    const chartsContainer = document.getElementById('chartsContainer');

    // Iterate through each year and create a chart
    Object.keys(customerData).forEach(year => {
        // Create a new canvas for each year
        const canvas = document.createElement('canvas');
        canvas.id = `customerChart${year}`;
        canvas.width = 400;
        canvas.height = 200;
        chartsContainer.appendChild(canvas);

        // Find the most selling month for the current year
        const mostSellingMonth = Object.keys(customerData[year]).reduce((a, b) =>
            customerData[year][a] > customerData[year][b] ? a : b
        );

        // Create a chart for the current year
        const ctx = canvas.getContext('2d');
        const sortedMonths = Object.keys(customerData[year]).sort((a, b) => {
            const monthsOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return monthsOrder.indexOf(a) - monthsOrder.indexOf(b);
        });

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: sortedMonths,
                datasets: [{
                    label: `Antal af kunder (${year})`, // Change label here
                    data: sortedMonths.map(month => customerData[year][month]),
                    fill: true,
                    borderColor: 'rgba(75,158,9,0.34)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgb(25,66,0)',
                    pointRadius: 5
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        ticks: {
                            stepSize: 0,
                        },
                        title: {
                            display: true,
                            text: 'Months'
                        }
                    },
                    y: {
                        type: 'linear',
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Antal af kunder' // Change label here
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'xy',
                    intersect: false
                },
                plugins: {
                    legend: {
                        onClick: function (e, legendItem) {
                            // Prevent default behavior (toggling visibility)
                            e.preventDefault();
                        },
                        labels: {
                            clickable: false
                        }
                    }
                }
            }
        });

        // Highlight the most selling month for the current year
        const index = sortedMonths.indexOf(mostSellingMonth);
        const dataset = ctx.chart.data.datasets[0];
        dataset.pointBackgroundColor[index] = 'red';
        ctx.update();
    });
}

document.addEventListener('DOMContentLoaded', function () {
    getCustomerData();
});
