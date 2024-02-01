async function fetchData() {
    try {
        const response = await fetch('http://localhost:3000/fetchData');
        const data = await response.json();

        if (data.success) {
            // Clear existing table rows
            const tableBody = document.querySelector('#cryptoTable tbody');
            tableBody.innerHTML = '';

            // Append new rows based on the fetched data
            data.info.forEach(item => {
                const row = tableBody.insertRow();
                Object.values(item).forEach(value => {
                    const cell = row.insertCell();
                    cell.textContent = value;
                });
            });
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Fetch data on page load
fetchData();