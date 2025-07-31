import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface User {
  id: string;
  name: string;
  role: string;
  createdAt: Timestamp;
}

export default function TrainerReports() {
  const [users, setUsers] = useState<User[]>([]);
  const [signupStats, setSignupStats] = useState<{ [date: string]: number }>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList: User[] = [];
        const counts: { [key: string]: number } = {};

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (!data.name || !data.role || !data.createdAt) return;

          const isTimestamp =
            data.createdAt && typeof data.createdAt.toDate === "function";
          if (!isTimestamp) return;

          const date = data.createdAt.toDate().toISOString().split("T")[0];
          counts[date] = (counts[date] || 0) + 1;

          usersList.push({
            id: docSnap.id,
            name: data.name,
            role: data.role,
            createdAt: data.createdAt,
          });
        });

        setUsers(usersList);
        setSignupStats(counts);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const barData = {
    labels: Object.keys(signupStats),
    datasets: [
      {
        label: "Daily Signups",
        data: Object.values(signupStats),
        backgroundColor: "#2db57a",
        borderRadius: 5,
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
      <div
        style={{
          marginBottom: "2.5rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "0.4rem" }}>📊 Trainer Reports</h1>
        <p style={{ color: "#999" }}>Live user insights and signup trends</p>
      </div>

      {/* Top Users Pill List */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          marginBottom: "2.5rem",
        }}
      >
        {users.slice(0, 5).map((user) => (
          <span
            key={user.id}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#2b3647",
              color: "#fff",
              borderRadius: "999px",
              fontWeight: 500,
              fontSize: "0.9rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {user.name}
          </span>
        ))}
      </div>

      {/* Chart Container */}
      <div
        style={{
          background: "#1d2939",
          padding: "1.5rem",
          borderRadius: "14px",
          boxShadow: "0 4px 18px rgba(0,0,0,0.3)",
          marginBottom: "2.5rem",
        }}
      >
        <h3 style={{ color: "#ffffff", marginBottom: "1rem" }}>
          📅 Signups Over Time
        </h3>
        <Bar data={barData} />
      </div>

      {/* Flashcard-Style User List */}
      <div>
        <h3 style={{ marginBottom: "1rem" }}>👥 All Users</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {users.map((user) => (
            <div
              key={user.id}
              style={{
                backgroundColor: "#2c3e50",
                color: "#fff",
                padding: "1rem",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            >
              <h4 style={{ marginBottom: "0.25rem", fontSize: "1.1rem" }}>
                {user.name}
              </h4>
              <p style={{ fontSize: "0.85rem", marginBottom: "0.2rem", color: "#ccc" }}>
                Joined: {user.createdAt.toDate().toLocaleDateString()}
              </p>
              <p style={{ fontSize: "0.85rem", color: "#ccc" }}>
                Role: <span style={{ color: "#2db57a" }}>{user.role}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
