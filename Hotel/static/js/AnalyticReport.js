async function loadRevenueData() {
    try {
        const response = await fetch("/api/monthly-profit-revenue-comparison-2025");

        if (!response.ok) {
            console.error("API Error:", response.status);
            return;
        }

        const data = await response.json();
        console.log("Loaded Data:", data);

        const labels = data.map(d => d.Month);

        const actualRevenue = data.map(d => d.Revenue_Actual);
        const predictedRevenue = data.map(d => d.Revenue_Predicted);

        const actualProfit = data.map(d => d.Profit_Actual);
        const predictedProfit = data.map(d => d.Profit_Predicted);

        const ctx = document.getElementById("revenueChart").getContext("2d");

        new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Actual Revenue",
                        data: actualRevenue,
                        borderColor: "#3498db",
                        backgroundColor: "rgba(52, 152, 219, 0.1)",
                        tension: 0.3,
                        fill: true,
                        pointRadius: 5
                    },
                    {
                        label: "AI Predicted Revenue",
                        data: predictedRevenue,
                        borderColor: "#2ecc71",
                        backgroundColor: "rgba(46, 204, 113, 0.1)",
                        tension: 0.3,
                        fill: true,
                        pointRadius: 5
                    },
                    {
                        label: "Actual Profit",
                        data: actualProfit,
                        borderColor: "#f39c12",
                        backgroundColor: "rgba(243, 156, 18, 0.1)",
                        tension: 0.3,
                        fill: true,
                        pointRadius: 5
                    },
                    {
                        label: "AI Predicted Profit",
                        data: predictedProfit,
                        borderColor: "#e74c3c",
                        backgroundColor: "rgba(231, 76, 60, 0.1)",
                        tension: 0.3,
                        fill: true,
                        pointRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                        labels: { color: "#2c3e50", font: { size: 14 } }
                    },
                    tooltip: {
                        mode: "index",
                        intersect: false
                    }
                },
                interaction: {
                    mode: "nearest",
                    axis: "x",
                    intersect: false
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: "Amount ($)", color: "#2c3e50", font: { size: 14 } },
                        ticks: { color: "#2c3e50" },
                        grid: { color: "#dcdde1" }
                    },
                    x: {
                        title: { display: true, text: "Month", color: "#2c3e50", font: { size: 14 } },
                        ticks: { color: "#2c3e50" },
                        grid: { color: "#dcdde1" }
                    }
                }
            }
        });

    } catch (error) {
        console.error("JS Error:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadRevenueData);
