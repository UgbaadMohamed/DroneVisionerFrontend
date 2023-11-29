//TIME DROPDOWN --------------------------------------------------------------------------------------------
function myFunction() {
    document.getElementById("timeDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
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

//DOM CONTENT LOADED --------------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    calender();
    handleClickDay();
    handleClickTime();
    postAppointmentToDatabase();
})

//CALENDER --------------------------------------------------------------------------------------------
var clickedDay;

function calender() {
    const daysTag = document.querySelector(".days"),
        currentDate = document.querySelector(".current-date"),
        prevNextIcon = document.querySelectorAll(".icons span");

// getting new date, current year and month
    let date = new Date(),
        currYear = date.getFullYear(),
        currMonth = date.getMonth();

// storing full name of all months in array
    const months = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli",
        "August", "September", "Oktober", "November", "December"];

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
}


//WHEN DAY CLICKED--------------------------------------------------------------------------------------------
function handleClickDay() {
        var daysContainer = document.querySelector('.days');

        daysContainer.addEventListener('click', function (event) {
            if (event.target.tagName === 'LI') {
                clickedDay = event.target;

                daysContainer.querySelectorAll('li').forEach(function (day) {
                    day.classList.remove('active');
                });

                clickedDay.classList.add('active');

                // Set the selected date in the hidden input field
                document.getElementById('selectedDate').value =
                    `${currYear}-${(currMonth + 1).toString().padStart(2, '0')}-${clickedDay.innerText.padStart(2, '0')}`;
            }
        });
    }

//TODO:TIME!!!!!!!!!!!!!! //kalde dom content en gang og så kalde de forskelle funktioner
//WHEN TIMESTAMP CLICKED--------------------------------------------------------------------------------------------
function handleClickTime() {
        const timeDropdown = document.getElementById('timeDropdown');

        if (timeDropdown) {
            const timeEntries = timeDropdown.getElementsByTagName('a');

            // Add click event listener to each time entry
            Array.from(timeEntries).forEach(function (entry) {
                entry.addEventListener('click', function () {
                    // Store the clicked time value for later use
                    const selectedTime = entry.textContent;
                    console.log('Clicked Time Entry:', selectedTime);

                    // Set the selected time in the hidden input field
                    document.getElementById('selectedTime').value = selectedTime
                    document.getElementById("timeDropdown").classList.remove("show");
                });
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
                };

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
                    // window.location.href = "/Index.html";
                } catch (error) {
                    console.error('Error:', error);
                }
            };
        } else {
            console.error('Form with ID "appointmentForm" not found');
        }
    }

