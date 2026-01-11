let mode = "actual";
let allData = [];
let appliedOverrides = {};

// Fetch room data
async function loadData() {
    try {
        const res = await fetch(`/api/room-prices?mode=ai`);
        allData = await res.json();
        populateFilters(allData);
        render();
    } catch (err) {
        console.error("Error fetching room data:", err);
    }
}

function populateFilters(data) {
    const monthSelect = document.getElementById("monthFilter");
    const roomSelect = document.getElementById("roomFilter");

    const months = [...new Set(data.map(d => d.month))];
    const rooms = [...new Set(data.map(d => d.room_type))];

    months.forEach(m => monthSelect.innerHTML += `<option>${m}</option>`);
    rooms.forEach(r => roomSelect.innerHTML += `<option>${r}</option>`);
}

function render() {
    const grid = document.getElementById("roomGrid");
    grid.innerHTML = "";

    const month = document.getElementById("monthFilter").value;
    const room = document.getElementById("roomFilter").value;

    allData
        .filter(d => (!month || d.month === month) && (!room || d.room_type === room))
        .forEach(d => {
            const key = `${d.month}_${d.room_type}`;
            const displayPrice = appliedOverrides[key] ?? d.actual_price;
            const diff = (((d.ai_price - d.actual_price) / d.actual_price) * 100).toFixed(1);
            const diffClass = diff >= 0 ? "diff-positive" : "diff-negative";

            grid.innerHTML += `
                <div class="room-card">
                    <h4>${d.room_type}</h4>
                    <h5>${d.month}</h5>
                    <p>Actual: <b>$${d.actual_price}</b></p>

                    ${mode === "ai" ? `
                        <p>AI Price: <b>$${d.ai_price}</b></p>
                        <p class="${diffClass}">${diff}% difference</p>
                    ` : `
                        <p>Current: <b>$${displayPrice}</b></p>
                    `}
                </div>
            `;
        });
}

function applyAI(key, price) {
    appliedOverrides[key] = price;
    mode = "actual";
    render();
}

// Event listeners
document.getElementById("actualBtn").onclick = () => { mode = "actual"; render(); };
document.getElementById("aiBtn").onclick = () => { mode = "ai"; render(); };
document.getElementById("monthFilter").onchange = render;
document.getElementById("roomFilter").onchange = render;

document.addEventListener("DOMContentLoaded", loadData);
