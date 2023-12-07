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

// VISER DEN GAMLE INFORMATION FØR REDIGERING PÅ HOVEDSIDEN
let currentAppointmentId;
function displayData(appointments) {
    tblRows.innerHTML = appointments.map(appointment => {
        return `<tr data-appointment-id="${appointment.appointment_ID}" onclick="selectRow(this)">
            <td>${appointment.customer.first_Name}</td>
            <td>${appointment.description}</td>
            <td>${appointment.date}</td>
            <td>${appointment.time}</td>
            <td style="cursor: pointer;" onclick="populateEditModal(${JSON.stringify(appointment)}); $('#editModal').modal('show');">
                <i class="fas fa-edit" data-bs-toggle="modal" data-bs-target="#editModal"></i>
            </td>
        </tr>`;
    }).join('');
}

function selectRow(row) {
    // Remove the 'selected' class from all rows
    const rows = document.querySelectorAll('tr');
    rows.forEach(r => r.classList.remove('selected'));


    row.classList.add('selected');
}




<!-- DETTE HOLDER DEN GAMLE INFORMATION SOM PLACEHOLDER-->
let originalData = {
    description: '',
    date: '',
    time: '',
};


function openEditModal(row) {

    var description = row.cells[1].innerText;
    var date = row.cells[2].innerText;
    var time = row.cells[3].innerText;

    // Store the original data
    originalData = {
        description: description,
        date: date,
        time: time,
    };


    document.getElementById('editBesrkivelse').value = originalData.description;
    document.getElementById('editDato').value = originalData.date;
    document.getElementById('editTid').value = originalData.time;

    // Open the modal
    $('#editModal').modal('show');
}


document.addEventListener('DOMContentLoaded', function () {
    // Get all table rows
    const tableRows = document.querySelectorAll('table tbody tr');


    tableRows.forEach(row => {
        row.addEventListener('click', function () {
            openEditModal(row);
        });
    });
});

document.getElementById('editForm').onsubmit = function (evt) {
    evt.preventDefault();
    const selectedRow = document.querySelector('tr.selected');
    const appointmentId = selectedRow ? selectedRow.dataset.appointmentId : null;

    if (!appointmentId) {
        console.error('No appointment ID found.');
        return;
    }

    const updatedData = {
        appointment_ID: appointmentId,
        description: document.getElementById('editBesrkivelse').value,
        date: document.getElementById('editDato').value,
        time: document.getElementById('editTid').value,
    };

    updateAppointment(updatedData, appointmentId);
};


// DETTE REDIGER I DATABASEN....
let editedAppointments = JSON.parse(localStorage.getItem('editedAppointments')) || [];

function updateAppointment(updatedData, appointment_ID) {
    const formdata = {
        description: updatedData.description,
        date: updatedData.date,
        time: updatedData.time
    };

    const selectedRow = document.querySelector('tr.selected');

    const endpoint = `http://localhost:8085/appointment/updateAppointment/${appointment_ID}`;

    fetch(endpoint, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdata),
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                if (response.status === 404) {
                    throw new Error('Appointment not found');
                } else {
                    throw new Error('Failed to update appointment');
                }
            }
        })
        .then(data => {
            console.log('Appointment updated successfully:', data);

            if (selectedRow) {
                // Update the content of the displayed row with the new data
                updateRow(selectedRow, data);
            }

            // Close the modal
            $('#editModal').modal('hide');

            // Manually remove the modal backdrop
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();

            // Store the edited data after successful update
            editedAppointments.push(updatedData);
            // Update localStorage with the editedAppointments array
            localStorage.setItem('editedAppointments', JSON.stringify(editedAppointments));
        })
        .catch(error => {
            console.error('Error updating appointment:', error);
        });
}



document.addEventListener('DOMContentLoaded', function () {
    if (editedAppointments.length > 0) {
        editedAppointments.forEach(editedData => {
            const row = document.querySelector(`tr[data-appointment-id="${editedData.appointment_ID}"]`);
            if (row) {
                updateRow(row, editedData);
            }
        });
    }
});

fetchData()










