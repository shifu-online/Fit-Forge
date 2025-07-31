// src/pages/AdminReports.tsx

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface User {
  name: string;
  role: string;
  createdAt?: string;
}

interface LoginLog {
  uid: string;
  timestamp: Timestamp;
}

export default function AdminReports() {
  const [users, setUsers] = useState<User[]>([]);
  const [loginLogs, setLoginLogs] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const data = snapshot.docs.map((doc) => doc.data() as User);
      setUsers(data);
    };

    const fetchLogins = async () => {
      try {
        const snapshot = await getDocs(collection(db, "loginLogs"));
        const logs: Record<string, number> = {};

        snapshot.forEach((doc) => {
          const data = doc.data() as LoginLog;
          if (!data.timestamp) return;
          const dateObj = data.timestamp.toDate();
          const day = dateObj.toLocaleDateString("en-US", { weekday: "short" }); // Mon, Tue, ...
          logs[day] = (logs[day] || 0) + 1;
        });

        setLoginLogs(logs);
      } catch (err) {
        console.error("Error fetching login logs:", err);
      }
    };

    fetchUsers();
    fetchLogins();
  }, []);

  const totalUsers = users.filter((u) => u.role === "user").length;
  const totalTrainers = users.filter((u) => u.role === "trainer").length;
  const totalAccounts = users.length;

  // Grouped signups by date
  const signupCounts: Record<string, number> = {};
  users.forEach((u) => {
    const date = u.createdAt
      ? new Date(u.createdAt).toLocaleDateString()
      : "Unknown";
    signupCounts[date] = (signupCounts[date] || 0) + 1;
  });

  const signupBarData = {
    labels: Object.keys(signupCounts),
    datasets: [
      {
        label: "User Signups",
        data: Object.values(signupCounts),
        backgroundColor: "#2db57a",
      },
    ],
  };

  const rolePieData = {
    labels: ["Users", "Trainers"],
    datasets: [
      {
        data: [totalUsers, totalTrainers],
        backgroundColor: ["#21808d", "#e95f5f"],
        borderWidth: 1,
      },
    ],
  };

  const loginData = {
    labels: Object.keys(loginLogs),
    datasets: [
      {
        label: "Login Activity",
        data: Object.values(loginLogs),
        borderColor: "#ffcd56",
        backgroundColor: "#ffcd5677",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
      },
    ],
  };

  return (
    <div className="admin-report">
      <div className="section-header">
        <h1>📊 Admin Reports</h1>
        <p>Overview of user statistics and system trends</p>
      </div>

      {/* Summary Stats */}
      <div className="summary-grid">
        <div className="summary-box">
          <h3>{totalUsers}</h3>
          <p>Users</p>
        </div>
        <div className="summary-box">
          <h3>{totalTrainers}</h3>
          <p>Trainers</p>
        </div>
        <div className="summary-box">
          <h3>{totalAccounts}</h3>
          <p>Total Accounts</p>
        </div>
      </div>

      {/* Charts */}
      <div className="report-charts">
        <div className="chart-box">
          <h4>User Signups</h4>
          <Bar data={signupBarData} />
        </div>

        <div className="chart-box">
          <h4>System Roles</h4>
          <Doughnut data={rolePieData} />
        </div>

        <div className="chart-box">
          <h4>Login Activity</h4>
          <Line data={loginData} />
        </div>
      </div>

      <style>{`
        .admin-report {
          padding: 2rem;
        }

        .section-header h1 {
          margin-bottom: 0.5rem;
        }

        .summary-grid {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .summary-box {
          background: #222f3e;
          border: 1px solid var(--color-primary);
          border-radius: 12px;
          padding: 1rem 1.5rem;
          min-width: 160px;
          text-align: center;
          box-shadow: 0 0 12px rgba(0,0,0,0.3);
          flex: 1;
        }

        .summary-box h3 {
          margin: 0;
          font-size: 1.8rem;
          color: var(--color-primary);
        }

        .summary-box p {
          margin: 0.25rem 0 0;
          color: #ccc;
          font-size: 0.95rem;
        }

        .report-charts {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }

        .chart-box {
          background: #1c2734;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        }

        h4 {
          margin-bottom: 1rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
