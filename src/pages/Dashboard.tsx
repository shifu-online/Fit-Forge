// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserData {
  name: string;
  email: string;
  role: string;
  uid: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("currentUser");
      if (!stored) {
        navigate("/login");
        return;
      }

      const parsed: UserData = JSON.parse(stored);
      if (!parsed?.role) {
        navigate("/login");
        return;
      }

      setUser(parsed);
    } catch {
      localStorage.removeItem("currentUser");
      navigate("/login");
    }
  }, [navigate]);

  if (!user) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  const { name, role } = user;

  const userLinks = [
    { title: "Fitness Tracking", path: "/fitness-tracking" },
    { title: "Progress Report", path: "/progress" },
  ];

  const trainerLinks = [
    { title: "Trainer Dashboard", path: "/trainer-dashboard" },
    { title: "Reports", path: "/trainer-reports" },
  ];

  const adminLinks = [
    { title: "Admin Panel", path: "/admin-panel" },
    { title: "Reports", path: "/admin-reports" },
  ];

  const sharedLinks = [
    { title: "Workout Plans", path: "/workout-plans" },
    { title: "Diet Plans", path: "/diet-plans" },
  ];

  const links = [
    ...sharedLinks,
    ...(role === "user" ? userLinks : []),
    ...(role === "trainer" ? trainerLinks : []),
    ...(role === "admin" ? adminLinks : []),
  ];

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Welcome, {name} 👋</h1>

      <div style={styles.grid}>
        {links.map(({ title, path }) => (
          <button key={title} onClick={() => navigate(path)} style={styles.btn}>
            {title}
          </button>
        ))}
      </div>
    </div>
  );
}

// 🔧 Dark-clean theme styles
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    padding: "2rem",
    backgroundColor: "#121212",
    minHeight: "100vh",
    color: "#f0f0f0",
  },
  title: {
    fontSize: "2.2rem",
    marginBottom: "1.5rem",
    color: "#ffffff",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "1rem",
    maxWidth: "800px",
    margin: "0 auto",
  },
  btn: {
    background: "#1e1e1e",
    border: "1px solid #333",
    padding: "1.2rem",
    borderRadius: "10px",
    fontSize: "1rem",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  },
  loading: {
    color: "#ccc",
    textAlign: "center",
    padding: "2rem",
    fontSize: "1.2rem",
  },
};
