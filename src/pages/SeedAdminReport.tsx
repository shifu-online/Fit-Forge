import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

const NAMES = [
  "Alice", "Bob", "Charlie", "Dana", "Ethan", "Fiona", "George", "Hana",
  "Ivy", "Jack", "Karen", "Leo", "Maya", "Nina", "Omar", "Paul", "Quinn",
  "Ravi", "Sara", "Tom"
];

const ROLES = ["user", "trainer"];

export default function SeedAdminReport() {
  const handleSeed = async () => {
    try {
      const today = new Date();

      for (let i = 0; i < NAMES.length; i++) {
        const name = NAMES[i];
        const role = Math.random() < 0.7 ? "user" : "trainer";

        const date = new Date(today);
        date.setDate(today.getDate() - Math.floor(Math.random() * 10)); // 0–9 days ago

        await addDoc(collection(db, "users"), {
          name,
          role,
          createdAt: Timestamp.fromDate(date),
        });
      }

      alert("✅ Dummy users seeded successfully!");
    } catch (err) {
      console.error("Seeding failed", err);
      alert("❌ Failed to seed users.");
    }
  };

  return (
    <div style={{ padding: "3rem", background: "#121c2b", color: "#fff", minHeight: "100vh" }}>
      <h1>🧪 Seed Admin Reports</h1>
      <p>This will insert 20+ dummy users with different roles and dates for testing chart visuals.</p>
      <button
        onClick={handleSeed}
        style={{
          marginTop: "1rem",
          padding: "1rem 2rem",
          background: "#2db57a",
          border: "none",
          borderRadius: "8px",
          color: "#fff",
          fontSize: "1rem",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        ➕ Seed Dummy Users
      </button>
    </div>
  );
}
