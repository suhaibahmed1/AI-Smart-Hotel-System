let allData = [];
let isAI = false;

// Load page
document.addEventListener("DOMContentLoaded", () => {
    loadActualData();
    document.getElementById("aiPredictBtn").addEventListener("click", loadAIData);
    document.getElementById("searchBtn").addEventListener("click", applyFilters);
});

// Load actual data
function loadActualData() {
    fetch("/api/rooms/actual")
        .then(res => res.json())
        .then(data => {
            isAI = false;
            allData = data;
            populateMonths(data);
            renderTable(data);
        })
        .catch(err => alert("Failed to load actual prices: " + err));
}

// Load AI predicted data
function loadAIData() {
    fetch("/api/rooms/predicted")
        .then(res => res.json())
        .then(data => {
            isAI = true;
            allData = data;
            populateMonths(data);
            renderTable(data);
        })
        .catch(err => alert("Failed to load AI prices: " + err));
}

// Render table
function renderTable(data) {
    const tbody = document.querySelector("#roomsTable tbody");
    tbody.innerHTML = "";

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3">No data found</td></tr>`;
        return;
    }

    data.forEach(row => {
        const price = row.Room_per_night_price !== undefined ? row.Room_per_night_price : row.price;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.month}</td>
            <td>${row.room_type}</td>
            <td>${price} ${isAI ? "<span style='color:green;'>AI</span>" : ""}</td>
        `;
        tbody.appendChild(tr);
    });

    // Ensure scroll top after re-render
    const tableContainer = document.querySelector(".table-container");
    tableContainer.scrollTop = 0;
}

// Apply filters
function applyFilters() {
    const month = document.getElementById("monthFilter").value;
    const type = document.getElementById("typeFilter").value;

    const filtered = allData.filter(r =>
        (month === "" || r.month === month) &&
        (type === "" || r.room_type === type)
    );

    renderTable(filtered);
}

// Populate month dropdown
function populateMonths(data) {
    const select = document.getElementById("monthFilter");
    select.innerHTML = `<option value="">All Months</option>`;

    const months = [...new Set(data.map(d => d.month))].sort((a, b) => {
        const monthOrder = {
            January:1, February:2, March:3, April:4, May:5, June:6,
            July:7, August:8, September:9, October:10, November:11, December:12
        };
        return monthOrder[a] - monthOrder[b];
    });

    months.forEach(month => {
        const opt = document.createElement("option");
        opt.value = month;
        opt.textContent = month;
        select.appendChild(opt);
    });
}
