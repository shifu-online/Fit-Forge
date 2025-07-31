/*
// src/pages/Reports.tsx

import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const timeframes = ["Week", "Month", "All Time"];

export default function Reports(): JSX.Element {
  const [selectedFilter, setSelectedFilter] = useState("Week");

  // Dummy data for now (replace with dynamic data later)
  const caloriesData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Calories Burned",
        data: [400, 520, 380, 600, 710, 450, 500],
        fill: false,
        backgroundColor: "#21808d",
        borderColor: "#21808d",
        tension: 0.3,
      },
    ],
  };

  const workoutsData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Workouts",
        data: [4, 3, 5, 4],
        backgroundColor: "#2db57a",
      },
    ],
  };

  const weightData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Weight (kg)",
        data: [75, 74.5, 74, 73.8],
        fill: false,
        backgroundColor: "#645cff",
        borderColor: "#645cff",
        tension: 0.4,
      },
    ],
  };

  return (
    <>
      <div className="section-header">
        <div>
          <h1>📊 Reports</h1>
          <p>View your progress and trends over time</p>
        </div>

        <div className="report-filters">
          <label htmlFor="filter" className="form-label">
            Filter by:
          </label>
          <select
            id="filter"
            className="form-control"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            {timeframes.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>
      </div>
/* 
      <div className="reports-dashboard">
        {/* Summary Cards */}
        /*<div className="summary-stats">
          <div className="summary-stat">
            <h4>Total Workouts</h4>
            <div className="stat-value">16</div>
          </div>
          <div className="summary-stat">
            <h4>Total Calories</h4>
            <div className="stat-value">4,560</div>
          </div>
          <div className="summary-stat">
            <h4>Avg Duration</h4>
            <div className="stat-value">45 mins</div>
          </div>
          <div className="summary-stat">
            <h4>Current Weight</h4>
            <div className="stat-value">73.8 kg</div>
          </div>
        </div>

        /* {/* Charts */}
       /* <div className="chart-container">
          <h4>Calories Burned</h4>
          <Line data={caloriesData} />
        </div>

        <div className="chart-container">
          <h4>Workouts Over Time</h4>
          <Bar data={workoutsData} />
        </div>

        <div className="chart-container">
          <h4>Weight Trend</h4>
          <Line data={weightData} />
        </div>
      </div>
    </>
  );
}
