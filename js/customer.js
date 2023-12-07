document.getElementById('bookingForm').addEventListener('submit', function (event) {

        var currentDate = new Date();
        var formattedDate = currentDate.toISOString().split('T')[0];
        document.getElementById('registration_date').value = formattedDate;


        const formData = {
            first_Name: document.getElementById("first_Name").value,
            last_Name: document.getElementById("last_name").value,
            email: document.getElementById("email").value,
            phoneNumber: document.getElementById("phone_number").value,
            birthday: `${document.getElementById("birthyear").value}-${document.getElementById("birthmonth").value}-${document.getElementById("birthday").value}`,
            registration_date: document.getElementById("registration_date").value,
        };


    fetch('http://localhost:8085/register', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);

            // Delay for 5 seconds before redirecting
            setTimeout(() => {
                window.location.href = 'receipt.html';
            }, 0);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

// Prevent the default form submission
    event.preventDefault();
});

     /*   fetch('http://localhost:8085/register', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {

                console.log('Success:', data);

            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });*/

document.getElementById('bookingForm').addEventListener('submit', function (event) {
    if (!validateForm()) {
        event.preventDefault();
    }
});

var dayDropdown = document.getElementById("birthday");
for (var i = 1; i <= 31; i++) {
    var option = document.createElement("option");
    option.text = i < 10 ? "0" + i : "" + i;
    option.value = i < 10 ? "0" + i : "" + i;
    dayDropdown.add(option);
}

var monthDropdown = document.getElementById("birthmonth");
for (var i = 1; i <= 12; i++) {
    var option = document.createElement("option");
    option.text = i < 10 ? "0" + i : "" + i;
    option.value = i < 10 ? "0" + i : "" + i;
    monthDropdown.add(option);
}

var yearDropdown = document.getElementById("birthyear");
var currentYear = new Date().getFullYear();
var minBirthYear = currentYear - 18;

// Set the 'min' attribute for the year input to the calculated minimum birth year
yearDropdown.setAttribute("min", minBirthYear);

for (var i = currentYear - 18; i >= currentYear - 100; i--) {
    var option = document.createElement("option");
    option.text = "" + i;
    option.value = "" + i;
    yearDropdown.add(option);
}















