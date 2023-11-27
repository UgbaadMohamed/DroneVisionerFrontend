var clickedDay;

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

        if(currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
            // creating a new date of current year & month and pass it as date value
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear(); // updating current year with new date year
            currMonth = date.getMonth(); // updating current month with new date month
        } else {
            date = new Date(); // pass the current date as date value
        }
        renderCalendar(); // calling renderCalendar function
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Get the parent container
    var daysContainer = document.querySelector('.days');

    // Add click event listener to the parent container
    daysContainer.addEventListener('click', function (event) {
        // Check if the clicked element is an 'li' element
        if (event.target.tagName === 'LI') {
            clickedDay = event.target;

            // Remove 'active' class from all days
            daysContainer.querySelectorAll('li').forEach(function (day) {
                day.classList.remove('active');
            });

            // Add 'active' class to the clicked day
            clickedDay.classList.add('active');
        }
    });
});

/*document.addEventListener('DOMContentLoaded', function (){
    const chooseDate = document.querySelector('#date');

    chooseDate.addEventListener('click', function ()
    {
        window.location.href = '/Index.html';
    })
})*/










document.getElementById('appointmentForm').addEventListener('submit', function(event) {
    const date = clickedDay ? clickedDay.textContent : '';

    const formData = {
        location: document.getElementById("location").value,
        description: document.getElementById("description").value,
        date: date,
        time: document.getElementById("time").value,
    };


    fetch('http://localhost:8085/appointment', {
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
});