let occupancyData = [];
let chartInstance = null;

// Fetch occupancy data
async function fetchOccupancyData() {
    try {
        const res = await fetch("/api/occupancy-data");
        occupancyData = await res.json();

        populateMonthDropdown();
        displayCards(occupancyData);
        renderChart(occupancyData);
    } catch (err) {
        console.error("Error fetching data:", err);
    }
}

// Populate month dropdown
function populateMonthDropdown() {
    const monthSelect = document.getElementById("monthSelect");
    const months = [...new Set(occupancyData.map(item => item.month))];

    months.forEach(m => {
        const option = document.createElement("option");
        option.value = m;
        option.textContent = m;
        monthSelect.appendChild(option);
    });
}

// Display KPI cards
function displayCards(data) {
    const container = document.getElementById("forecastContainer");
    container.innerHTML = "";

    data.forEach(item => {
        const card = document.createElement("div");
        card.className = "kpi-card";
        card.innerHTML = `
            <h4>${item.room_type}</h4>
            <h5>${item.month}</h5>
            <p>${item.occupancy}%</p>
            <small>Predicted Occupancy</small>
        `;
        container.appendChild(card);
    });
}

// Filter by month
function filterByMonth() {
    const month = document.getElementById("monthSelect").value;
    const filtered = month ? occupancyData.filter(i => i.month === month) : occupancyData;

    displayCards(filtered);
    renderChart(filtered);
}

// Render donut chart
function renderChart(data) {
    const ctx = document.getElementById('occupancyChart').getContext('2d');

    const summary = {};
    data.forEach(item => summary[item.room_type] = (summary[item.room_type] || 0) + item.occupancy);

    const labels = Object.keys(summary);
    const values = Object.values(summary);

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                label: 'Predicted Occupancy (%)',
                data: values,
                backgroundColor: ['#1e90ff','#ff7f50','#32cd32','#ffa500','#8a2be2','#ff1493']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'right', labels: { color: '#000' } }, // black legend text
                title: { display: true, text: 'Occupancy Rate by Room Type', color: '#000', font: { size: 18, weight: '600' } }
            }
        }
    });
}

// Event listeners
document.addEventListener("DOMContentLoaded", fetchOccupancyData);
document.getElementById("filterBtn").addEventListener("click", filterByMonth);

