const url = 'http://localhost:8085/appointment';

//LOOP TIL TIME --------------------------------------------------------------------------------------------
let isTimeDropdownVisible = false

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

function createDropdown() {
    var timeOptions = generateTimeOptions();
    var dropdownContainer = document.getElementById("timeDropdown");

    // Clear existing options
    dropdownContainer.innerHTML = "";

    timeOptions.forEach(function (time) {
        var option = document.createElement("a");
        option.textContent = time;
        option.addEventListener("click", function () {
            handleClickTime();
            console.log("Selected time:", time);
            // Optionally, close the dropdown after selection
            dropdownContainer.classList.remove('show'); //??
        });
        dropdownContainer.appendChild(option);
    });
}

function showTimeDropdown() {
    var dropdownContainer = document.getElementById("timeDropdown");

    // Explicitly add the 'show' class to display the dropdown
    dropdownContainer.classList.add("show");

    // Generate options only when the dropdown is shown
    createDropdown();

    // Adjust the position of elements below the dropdown
    var elementsToMove = document.querySelectorAll('.elements-to-move');
    elementsToMove.forEach(function (element) {
        element.style.marginTop = '30px'; // Adjust the margin to match the dropdown height
    });
}

//den klikker også når tid er valgt 2. gang
    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function (event) {
    var dropdownButton = document.getElementById("select-time-btn");
    var dropdownContainer = document.getElementById("timeDropdown");


    // Check if the click is outside of both the button and the dropdown content
    if (
        !event.target.matches('.combined-btn-time') &&
        !event.target.closest('.dropdown') &&
        !event.target.matches('.dropdown-content a')
    ) {
        // Hide the dropdown if it is shown
        if (dropdownContainer && dropdownContainer.classList.contains("show")) {
            dropdownContainer.classList.remove('show');

            // Reset the position of elements below the dropdown
            var elementsToMove = document.querySelectorAll('.elements-to-move');
            elementsToMove.forEach(function (element) {
                element.style.marginTop = '0';
            });
        }
    }
};


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


async function showCalendar() {
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

        const response = await fetch(`${url}/booked-dates`);
        const bookedDates = await response.json();

        const renderCalendar = () => {
            let firstDayofMonth = new Date(currYear, currMonth, 0).getDay(),
                lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
                lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay() - 1,
                lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
            let liTag = "";

            for (let i = firstDayofMonth; i > 0; i--) {
                liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
            }

            for (let i = 1; i <= lastDateofMonth; i++) {
                const isBooked = bookedDates.includes(
                    new Date(currYear, currMonth, i).toISOString().split('T')[0]);

                let isToday = i === date.getDate() && currMonth === new Date().getMonth()
                && currYear === new Date().getFullYear() ? "chosen" : "";
                let bookedClass = isBooked ? "booked" : "";
                liTag += `<li class="${isToday} ${bookedClass}"><span class="date-number">${i}</span></li>`;
            }


            for (let i = lastDayofMonth; i < 6; i++) {
                liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
            }

            currentDate.innerText = `${months[currMonth]} ${currYear}`;
            daysTag.innerHTML = liTag;
        };


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

        handleClickDay(); //?

        // Update the visibility state
        isCalendarVisible = true;

        // Add a click event listener to the document
        document.addEventListener('click', handleDocumentClick);

        function handleDocumentClick(event) {
            const calendarContainer = document.getElementById('calendarContainer');
            const dropdownDiv = document.getElementById('dropdown-div');

            // Check if the clicked element is outside the calendar - Spørg pigerne!!!!!
            if (!calendarContainer.contains(event.target) && !dropdownDiv.contains(event.target)) {
                // Remove the calendar elements
                removeCalendarElements();

                // Reset styles of elementsBelowCalendarContainer
                if (elementsBelowCalendarContainer) {
                    elementsBelowCalendarContainer.style.marginTop = '0';
                }

                // Remove the click event listener
                document.removeEventListener('click', handleDocumentClick);

                isCalendarVisible = false;
            }
        }
    }
}


//WHEN DAY CLICKED--------------------------------------------------------------------------------------------
function handleClickDay() {
    // Assuming daysTag is a reference to the element with class 'days'
    var daysTag = document.querySelector('.days');

    daysTag.addEventListener('click', function (event) {
        if (event.target.tagName === 'LI'|| event.target.closest('li')) {
            var clickedListItem = event.target.closest('li');

            if (clickedListItem) {
                clickedDay = clickedListItem;
            }

            console.log(clickedDay)

            daysTag.querySelectorAll('li').forEach(function (day) {
                day.classList.remove('chosen');
            });

            clickedDay.classList.add('chosen');

            // Set the selected date in the hidden input field
            var selectedDate =
                `${currYear}-${(currMonth + 1).toString().padStart(2, '0')}-${clickedDay.innerText.padStart(2, '0')}`;

            console.log(selectedDate)

            document.getElementById('selectedDate').value = selectedDate;
            document.getElementById('choose-date-btn').innerText = selectedDate;
        }
    });
}


//GET CAPTURE DEVICE ID--------------------------------------------------------------------------------------------

/*async function getCaptureDeviceById(captureDeviceId) {
    const response = await fetch(`http://localhost:8085/captureDevice/${captureDeviceId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        const captureDeviceData = await response.json();
        return captureDeviceData;
    } else {
        console.error('Error fetching CaptureDevice');
        return null;
    }
}*/


//POST APPOINTMENT TO DATABASE-----------------------------------------------------------------------------------------

async function postAppointmentToDatabase() {
    const form = document.getElementById('appointmentForm');

    if (form) {
        form.onsubmit = async function (event) {
            event.preventDefault(); // Prevent default form submission

            // Validate each field before proceeding
            const location = document.getElementById("location").value;
            const description = document.getElementById("description").value;
            const selectedDate = document.getElementById("selectedDate").value;
            const selectedTime = document.getElementById("selectedTime").value;
            //const captureDeviceId = document.getElementById("captureDeviceId").value;

            // Fetch the complete CaptureDevice object
            //const captureDevice = await getCaptureDeviceById(captureDeviceId);

            const formData = {
                location: location,
                description: description,
                date: selectedDate,
                time: selectedTime
                //captureDevice: captureDevice,
            };

            console.log("Form Data:", formData);

            try {
                const response = await fetch(url, {
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

                window.location.href = `/templates/customer.html?appointmentId=${data.appointmentId}`;

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


//DOM CONTENT LOADED --------------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', async function () {
    // Retrieve the captureDeviceId from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const captureDeviceId = urlParams.get('captureDeviceId');
    document.getElementById('captureDeviceId').value = captureDeviceId;

    /*const captureDeviceData = await getCaptureDeviceById(captureDeviceId);

    if (captureDeviceData) {*/
        // Include other properties from captureDeviceData if needed
        //populateDropdown();

        postAppointmentToDatabase();
    /*} else {
        console.error('CaptureDevice data not found');
    }*/
});

//----
async function getBookedDates() {
    try {
        const response = await fetch(`${url}/booked-dates`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const bookedDates = await response.json();

        // Handle the bookedDates as needed
        console.log('Booked Dates:', bookedDates);

        return bookedDates;
    } catch (error) {
        console.error('Error fetching booked dates:', error.message);
        // Handle the error as needed
    }
}


