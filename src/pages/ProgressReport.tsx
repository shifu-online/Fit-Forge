import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { useEffect, useState } from "react";

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

interface Activity {
  id: string;
  date: string; // ISO date string
  minutes: number;
  calories: number;
}

export default function ProgressReport() {
  const [activity, setActivity] = useState<Activity[]>([]);
  const [minutesByDay, setMinutesByDay] = useState<{ [day: string]: number }>({});
  const [caloriesByWeek, setCaloriesByWeek] = useState<{ [week: string]: number }>({});

  useEffect(() => {
    // Dummy Data for testing
    const dummy: Activity[] = [
      { id: "1", date: "2025-07-07", minutes: 30, calories: 180 },
      { id: "2", date: "2025-07-08", minutes: 45, calories: 270 },
      { id: "3", date: "2025-07-08", minutes: 20, calories: 120 },
      { id: "4", date: "2025-07-09", minutes: 60, calories: 360 },
      { id: "5", date: "2025-07-10", minutes: 25, calories: 150 },
      { id: "6", date: "2025-07-12", minutes: 40, calories: 240 },
      { id: "7", date: "2025-07-13", minutes: 15, calories: 90 },
    ];
    setActivity(dummy);

    const dayMap: Record<string, number> = {};
    const weekMap: Record<string, number> = {};

    dummy.forEach((entry) => {
      const dateObj = new Date(entry.date);
      const day = dateObj.toLocaleDateString("en-US", { weekday: "short" }); // e.g., Mon
      const week = `Week ${Math.ceil(dateObj.getDate() / 7)}`; // e.g., Week 2

      dayMap[day] = (dayMap[day] || 0) + entry.minutes;
      weekMap[week] = (weekMap[week] || 0) + entry.calories;
    });

    setMinutesByDay(dayMap);
    setCaloriesByWeek(weekMap);
  }, []);

  const barData = {
    labels: Object.keys(minutesByDay),
    datasets: [
      {
        label: "Minutes per Day",
        data: Object.values(minutesByDay),
        backgroundColor: "#2db57a",
        borderRadius: 5,
      },
    ],
  };

  const lineData = {
    labels: Object.keys(caloriesByWeek),
    datasets: [
      {
        label: "Calories Burned",
        data: Object.values(caloriesByWeek),
        borderColor: "#ff6b6b",
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) return "rgba(255,107,107,0.2)";

          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(255,107,107,0.5)");
          gradient.addColorStop(1, "rgba(255,107,107,0)");
          return gradient;
        },
        fill: true,
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#ff6b6b",
        pointBorderColor: "#fff",
      },
    ],
  };

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "2rem",
        color: "#e6e6e6",
      }}
    >
      {/* Section Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.4rem" }}>📊 Progress Report</h1>
        <p style={{ color: "#aaa" }}>Overview of your weekly workouts and calories burned</p>
      </div>

      {/* Bar Chart - Workout Minutes */}
      <div
        style={{
          background: "#1d2939",
          padding: "1.5rem",
          borderRadius: "14px",
          boxShadow: "0 4px 18px rgba(0,0,0,0.3)",
          marginBottom: "2.5rem",
        }}
      >
        <h3 style={{ color: "#ffffff", marginBottom: "1rem" }}>⏱️ Minutes Trained Per Day</h3>
        <Bar
          data={barData}
          options={{
            plugins: {
              legend: {
                labels: { color: "#fff" },
              },
            },
            scales: {
              x: {
                ticks: { color: "#ccc" },
                grid: { color: "#333" },
              },
              y: {
                ticks: { color: "#ccc" },
                grid: { color: "#333" },
              },
            },
          }}
        />
      </div>

      {/* Line Chart - Calories Burned */}
      <div
        style={{
          background: "#1d2939",
          padding: "1.5rem",
          borderRadius: "14px",
          boxShadow: "0 4px 18px rgba(0,0,0,0.3)",
        }}
      >
        <h3 style={{ color: "#ffffff", marginBottom: "1rem" }}>🔥 Calories Burned Per Week</h3>
        <Line
          data={lineData}
          options={{
            plugins: {
              legend: {
                labels: {
                  color: "#fff",
                },
              },
            },
            scales: {
              x: {
                ticks: { color: "#ccc" },
                grid: { color: "#333" },
              },
              y: {
                ticks: { color: "#ccc" },
                grid: { color: "#333" },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
