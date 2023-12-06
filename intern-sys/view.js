const API_ENDPOINT = 'http://localhost:8085/appointment/getAllAppointments';
const PAGE_SIZE = 5;
let sortColumn = 'date';
const tblRows = document.getElementById('tbl-rows');
let sortDirection = 'asc';
let currentPage = 0;

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

function displayData(appointments) {
    tblRows.innerHTML = appointments.map(appointment => `<tr><td>${appointment.customer.first_Name}</td><td>${appointment.description}</td><td>${appointment.date}</td><td>${appointment.time}</td><td>${appointment.payment}</td></tr>`).join('');
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

fetchData(); // Initial call to the backend