const API_ENDPOINT = 'http://localhost:8085/appointment/getAllAppointments';
const PAGE_SIZE = 10;
let sortColumn = 'date';
const tblRows = document.getElementById('tbl-rows');
let sortDirection = 'asc';
let currentPage = 0;
const url = 'http://localhost:8085/';



document.getElementById('header-row').onclick = function (evt) {
    const id = evt.target.id;
    if (id.startsWith('sort-')) {
        sortColumn = id.replace('sort-', '');
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        fetchData();
    }
};
async function fetchData(page = currentPage, size = PAGE_SIZE, sort = `${sortColumn},${sortDirection}`) {
    try {
        const response = await fetch(`${API_ENDPOINT}?page=${page}&size=${size}&sort=${sort}`);
        const data = await response.json();

        currentPage = page;

        if (Array.isArray(data)) {
            // If the data is an array, assume it is the content array
            displayData(data);
            displayPagination(1, 0); // Since there is only one page
        } else if (data && data.content) {
            // If the data is an object with a content property
            displayData(data.content);
            displayPagination(data.totalPages, currentPage);
        } else {
            console.error('Invalid data format:', data);
        }

        // Check if there is at least one appointment to delete
        if (Array.isArray(data) && data.length > 0) {
            // Delete the first appointment immediately
            const appointmentToDelete = data[0];
            deleteAppointment(appointmentToDelete.appointment_ID);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}




function displayPagination(totalPages, currentPage) {
    let paginationHtml = '';
    if (currentPage > 0) {
        paginationHtml += `<li class="page-item"><a class="page-link" data-page="${currentPage - 1}" href="#">Previous</a></li>`;
    }

    for (let i = 0; i < totalPages; i++) {
        if (i === currentPage) {
            paginationHtml += `<li class="page-item active"><a class="page-link" href="#">${i + 1}</a></li>`;
        } else {
            paginationHtml += `<li class="page-item"><a class="page-link" data-page="${i}" href="#">${i + 1}</a></li>`;
        }
    }

    if (currentPage < totalPages - 1) {
        paginationHtml += `<li class="page-item"><a class="page-link" data-page="${currentPage + 1}" href="#">Next</a></li>`;
    }

    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = paginationHtml;

    paginationElement.onclick = function (evt) {
        evt.preventDefault();
        if (evt.target.tagName === 'A' && evt.target.hasAttribute('data-page')) {
            const page = parseInt(evt.target.getAttribute('data-page'));
            fetchData(page);
        }
    };
}


function displayData(appointments) {
    tblRows.innerHTML = appointments.map(appointment => {
        return `<tr data-appointment-id="${appointment.appointment_ID}" onclick="selectRow(this)">
            <td>${appointment.customer.first_Name}</td>
            <td>${appointment.description}</td>
            <td>${appointment.date}</td>
            <td>${appointment.time}</td>
            <td style="cursor: pointer;" onclick="deleteAppointment(${appointment.appointment_ID});">
                <i class="fas fa-trash-alt"></i> 
            </td>
        </tr>`;
    }).join('');
}

function deleteAppointment(appointment_ID) {
    const endpoint = `http://localhost:8085/appointment/delete/${appointment_ID}`;

    fetch(endpoint, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            console.log('DELETE Response Status:', response.status);

            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.indexOf('application/json') !== -1) {
                    return response.json();
                } else {
                    // If the response is not JSON, handle it as plain text
                    return response.text().then(data => Promise.resolve({ message: data }));
                }
            } else {
                const contentType = response.headers.get('content-type');
                console.log('DELETE Response Content-Type:', contentType);

                if (contentType && contentType.indexOf('application/json') !== -1) {
                    return response.json().then(data => Promise.reject(data));
                } else {
                    return response.text().then(content => Promise.reject(content));
                }
            }
        })
        .then(data => {
            console.log('Appointment deleted successfully:', data);

            const selectedRow = document.querySelector('tr.selected');
            if (selectedRow) {
                selectedRow.remove();
            }

            $('#editModal').modal('hide');
        })
        .catch(error => {
            console.error('Error deleting appointment:', error);
        });
}




// Add a click event listener to the "Delete" button
document.getElementById('deleteButton').onclick = function () {
    // Get the appointment ID from the selected row
    const selectedRow = document.querySelector('tr.selected');
    const appointmentId = selectedRow ? selectedRow.dataset.appointmentId : null;

    if (!appointmentId) {
        console.error('No appointment ID found.');
        return;
    }

    // Confirm deletion with the user (you can customize this part)
    const isConfirmed = confirm('Are you sure you want to delete this appointment?');

    if (isConfirmed) {
        // Call the deleteAppointment function with the appointmentId
        deleteAppointment(appointmentId);
    }
};

// Function to select a row
function selectRow(row) {
    // Remove the 'selected' class from all rows
    const rows = document.querySelectorAll('tr');
    rows.forEach(r => r.classList.remove('selected'));

    // Add the 'selected' class to the clicked row
    row.classList.add('selected');
}


fetchData(); // Initial call to the backend