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
            }, 500);
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
    for (var i = currentYear; i >= currentYear - 100; i--) {
        var option = document.createElement("option");
        option.text = "" + i;
        option.value = "" + i;
        yearDropdown.add(option);
    }

    document.getElementById('bookingForm').addEventListener('submit', function (event) {
        if (!validateForm()) {
            event.preventDefault();
        }
    });





    function validateForm() {
        var birthday = document.getElementById("birthday").value;
        var birthmonth = document.getElementById("birthmonth").value;
        var birthyear = document.getElementById("birthyear").value;
        var selectedDate = new Date(birthyear + '-' + birthmonth + '-' + birthday);
        var age = calculateAge(selectedDate);

        // Check if the person is at least 18 years old
        if (age < 18) {
            alert("Du skal være mindst 18 for at foretage bookingen.");
            return false;
        }

        return true;
    }

    function calculateAge(birthDate) {
        var today = new Date();
        var age = today.getFullYear() - birthDate.getFullYear();
        var monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }


















