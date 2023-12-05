//LOOP TIL TIME --------------------------------------------------------------------------------------------

function generateTimeOptions() {
    var startTime = 10; // Starting hour
    var endTime = 21;   // Ending hour
    var timeOptions = [];

    for (var hour = startTime; hour <= endTime; hour++) {
        // Add options with 30-minute intervals
        timeOptions.push(hour + ":00");
        timeOptions.push(hour + ":30");
    }

    return timeOptions;
}

//
function populateDropdown() {
    var timeOptions = generateTimeOptions();

    var dropdown = document.getElementById("timeDropdown");

    timeOptions.forEach(function (time) {
        var option = document.createElement("a");
        option.textContent = time;
        dropdown.appendChild(option);
    });
}

//TIME DROPDOWN --------------------------------------------------------------------------------------------

function showTimeDropdown() {
    var dropdown = document.getElementById("timeDropdown");
    dropdown.classList.toggle("show");
}

//Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

//DOM CONTENT LOADED --------------------------------------------------------------------------------------------


document.addEventListener('DOMContentLoaded', function () {
    // Retrieve the captureDeviceId from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const captureDeviceId = urlParams.get('captureDeviceId');
    document.getElementById('captureDeviceId').value = captureDeviceId;

    populateDropdown();
    handleClickTime();
    postAppointmentToDatabase();
});


//CALENDER --------------------------------------------------------------------------------------------

var clickedDay;
let isCalendarVisible = false; // Variable to track the visibility of the calendar
let calendarContainer = document.getElementById('calendarContainer');

// getting new date, current year and month
let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();

function removeCalendarElements(){
    calendarContainer.innerHTML = '';
    isCalendarVisible = false; // Reset the visibility state
}

function showCalendar() {
// Adjust elements below the calendar
    const elementsBelowCalendarContainer = document.getElementById('elementsBelowCalendarContainer');

    if (elementsBelowCalendarContainer) {
        elementsBelowCalendarContainer.style.marginTop = !isCalendarVisible ? '550px' : '0';
    }

    // Check if the calendar is already visible
    if (isCalendarVisible) {
        // Calendar is visible, so remove the calendar elements
        removeCalendarElements()
    } else {
        // Create the calendar container dynamically
        calendarContainer = document.getElementById('calendarContainer');

        // Calculate the position of the calendar relative to the "Vælg dato" button
        const dropdownButton = document.getElementById('choose-date-btn');
        const dropdownRect = dropdownButton.getBoundingClientRect();
        const calendarHeight = calendarContainer.offsetHeight;

        // Set the position of the calendar to be below the "Vælg dato" button
        calendarContainer.style.position = 'absolute';
        calendarContainer.style.left = `${dropdownRect.left}px`;
        calendarContainer.style.top = `${dropdownRect.bottom}px`;

        const currentDate = document.createElement('p');
        currentDate.classList.add('current-date');
        calendarContainer.appendChild(currentDate);

        const prevNextIconsContainer = document.createElement('div');
        prevNextIconsContainer.classList.add('icons');
        calendarContainer.appendChild(prevNextIconsContainer);

        const prevIcon = document.createElement('span');
        prevIcon.id = 'prev';
        prevIcon.classList.add('material-symbols-rounded');
        prevIcon.textContent = 'chevron_left';
        prevNextIconsContainer.appendChild(prevIcon);

        const nextIcon = document.createElement('span');
        nextIcon.id = 'next';
        nextIcon.classList.add('material-symbols-rounded');
        nextIcon.textContent = 'chevron_right';
        prevNextIconsContainer.appendChild(nextIcon);

        const confirmDate = document.createElement('button');
        confirmDate.id = 'confirm-date-btn';
        confirmDate.textContent = 'Bekræft dato';
        confirmDate.addEventListener('click', removeCalendarElements)
        prevNextIconsContainer.appendChild(confirmDate);

        const calendarDiv = document.createElement('div');
        calendarDiv.classList.add('calendar');
        calendarContainer.appendChild(calendarDiv);

        const weeksList = document.createElement('ul');
        weeksList.classList.add('weeks');
        calendarDiv.appendChild(weeksList);

        const daysOfWeek = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
        daysOfWeek.forEach(day => {
            const dayItem = document.createElement('li');
            dayItem.textContent = day;
            weeksList.appendChild(dayItem);
        });

        const daysTag = document.createElement('ul');
        daysTag.classList.add('days');
        calendarDiv.appendChild(daysTag);

        const prevNextIcon = [prevIcon, nextIcon];


// storing full name of all months in array
        const months = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli",
            "August", "September", "Oktober", "November", "December"];


        //Check if the days of the week have already been inserted
        const weeksTag = document.querySelector(".weeks");
        if (!weeksTag.innerHTML.trim()) {
            // Create days of the week dynamically
            const daysOfWeek = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
            weeksTag.innerHTML = daysOfWeek.map(day => `<li>${day}</li>`).join('');
        }

        const renderCalendar = () => {
            let firstDayofMonth = new Date(currYear, currMonth, 0).getDay(), // getting first day of month /0 i stedet for 1
                lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
                lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay() - 1, // getting last day of month /tilføjede -1
                lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
            let liTag = "";

            for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
                liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
            }

            for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month
                // adding active class to li if the current day, month, and year matched
                let isToday = i === date.getDate() && currMonth === new Date().getMonth()
                && currYear === new Date().getFullYear() ? "active" : "";
                liTag += `<li class="${isToday}">${i}</li>`;
            }

            for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
                liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
            }
            currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
            daysTag.innerHTML = liTag;
        }

        renderCalendar();

        prevNextIcon.forEach(icon => { // getting prev and next icons
            icon.addEventListener("click", () => { // adding click event on both icons
                // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
                currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

                if (currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
                    // creating a new date of current year & month and pass it as date value
                    date = new Date(currYear, currMonth, new Date().getDate());
                    currYear = date.getFullYear(); // updating current year with new date year
                    currMonth = date.getMonth(); // updating current month with new date month
                } else {
                    date = new Date(); // pass the current date as date value
                }
                renderCalendar(); // calling renderCalendar function
            });
        })

        handleClickDay();

        // Update the visibility state
        isCalendarVisible = true;
    }
}


//WHEN DAY CLICKED--------------------------------------------------------------------------------------------
function handleClickDay() {
    // Assuming daysTag is a reference to the element with class 'days'
    var daysTag = document.querySelector('.days');

    daysTag.addEventListener('click', function (event) {
        if (event.target.tagName === 'LI') {
            clickedDay = event.target;

            daysTag.querySelectorAll('li').forEach(function (day) {
                day.classList.remove('active');
            });

            clickedDay.classList.add('active');

            // Set the selected date in the hidden input field
            var selectedDate =
                `${currYear}-${(currMonth + 1).toString().padStart(2, '0')}-${clickedDay.innerText.padStart(2, '0')}`;

            document.getElementById('selectedDate').value = selectedDate;
            document.getElementById('choose-date-btn').innerText = selectedDate;
        }
    });
}

//WHEN TIMESTAMP CLICKED--------------------------------------------------------------------------------------------

function handleClickTime() {
    const timeDropdown = document.getElementById('timeDropdown');

    if (timeDropdown) {
        timeDropdown.addEventListener('click', function (event) {
            if (event.target.tagName === 'A') {
                const selectedTime = event.target.textContent.trim();
                document.getElementById('selectedTime').value = selectedTime;
                document.getElementById('select-time-btn').innerText = selectedTime;

                // Toggle the "show" class to control visibility
                timeDropdown.classList.toggle('show');
            }
        });
    }
}



//POST APPOINTMENT TO DATABASE-----------------------------------------------------------------------------------------

function postAppointmentToDatabase() {
    const form = document.getElementById('appointmentForm');


    if (form) {
        form.onsubmit = async function (event) {
            event.preventDefault(); // Prevent default form submission


            const formData = {
                location: document.getElementById("location").value,
                description: document.getElementById("description").value,
                date: document.getElementById("selectedDate").value, //date
                time: document.getElementById("selectedTime").value,
                captureDevice: {
                    capture_deviceid_fk: document.getElementById("captureDeviceId").value
                }
            }

            console.log("Form Data:", formData);


            try {
                const response = await fetch('http://localhost:8085/appointment', {
                    method: 'POST',
                    body: JSON.stringify(formData),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });


                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }


                const data = await response.json();
                console.log('Success:', data);


                // Uncomment the line below if you want to redirect after successful submission
                // window.location.href = "/header.html";
            } catch (error) {
                console.error('Error:', error);
            }
        };
    } else {
        console.error('Form with ID "appointmentForm" not found');
    }


}


function submitForm() {
    //window.location.href = '/templates/customer.html';
}






