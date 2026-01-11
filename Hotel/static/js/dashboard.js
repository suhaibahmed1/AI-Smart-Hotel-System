const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleBtn");

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
});
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("/api/dashboard-kpi");
        const data = await res.json();

        document.getElementById("actualOccupancy").textContent =
            data.actual_occupancy + "%";

        document.getElementById("aiOccupancy").textContent =
            data.ai_predicted_occupancy + "%";

    } catch (err) {
        console.error("Dashboard KPI load failed", err);
    }
});
document.addEventListener("DOMContentLoaded", function () {

    const canvas = document.getElementById("roomDonutChart");

    if (!canvas) {
        console.error("roomDonutChart canvas not found");
        return;
    }

    new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: ["Standard", "Deluxe", "Simple"],
            datasets: [{
                data: [10, 8, 7],   // total = 25
                backgroundColor: ["#6C63FF", "#4CAF50", "#FF9800"],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "70%",
            plugins: {
                legend: { display: false }
            }
        }
    });

});
document.addEventListener("DOMContentLoaded", () => {
    const ticker = document.getElementById("eventsTicker");
    const tbody = document.getElementById("eventsBody");

    if (!ticker || !tbody) return;

    // Clone rows to create continuous scroll
    const rows = Array.from(tbody.children);
    rows.forEach(row => {
        tbody.appendChild(row.cloneNode(true));
    });

});
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("/api/average-room-prices");
        const data = await res.json();

        // 2024
        document.getElementById("lastStandard").textContent = data.last_year.Standard;
        document.getElementById("lastDeluxe").textContent = data.last_year.Deluxe;
        document.getElementById("lastSimple").textContent = data.last_year.Simple;

        // 2025 Actual
        document.getElementById("actualStandard").textContent = data.actual.Standard;
        document.getElementById("actualDeluxe").textContent = data.actual.Deluxe;
        document.getElementById("actualSimple").textContent = data.actual.Simple;

        // 2025 AI
        document.getElementById("aiStandard").textContent = data.predicted.Standard;
        document.getElementById("aiDeluxe").textContent = data.predicted.Deluxe;
        document.getElementById("aiSimple").textContent = data.predicted.Simple;

    } catch (err) {
        console.error("Failed to load average prices", err);
    }
});
async function loadRevenueKPI() {
    const container = document.getElementById("revenue-kpi");
    const res = await fetch("/api/revenue-kpi");
    const data = await res.json();

    container.innerHTML = `
        <div class="compare-row">
            <span>Actual Revenue (2025)</span>
            <strong>$${data.total_revenue_actual}</strong>
        </div>
        <div class="compare-row">
            <span>AI Predicted Revenue (2025)</span>
            <strong class="positive">$${data.total_revenue_predicted}</strong>
        </div>
        <hr>
        <div class="compare-row loss">
            <span>Revenue Lost (Without AI)</span>
            <strong>− $${data.revenue_loss}</strong>
        </div>
        <div class="compare-row gain">
            <span>Extra Profit (With AI)</span>
            <strong>+ $${data.profit_gain}</strong>
        </div>
    `;
}

// Load on page ready
document.addEventListener("DOMContentLoaded", loadRevenueKPI);
