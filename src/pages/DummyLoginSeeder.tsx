// src/pages/DummyLoginSeeder.tsx

import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function DummyLoginSeeder() {
  const loginLogs = [
    { uid: "user1", timestamp: new Date("2025-07-06T08:00:00Z") },
    { uid: "user2", timestamp: new Date("2025-07-07T09:15:00Z") },
    { uid: "user3", timestamp: new Date("2025-07-08T11:30:00Z") },
    { uid: "user4", timestamp: new Date("2025-07-09T13:45:00Z") },
    { uid: "user1", timestamp: new Date("2025-07-10T17:20:00Z") },
    { uid: "user2", timestamp: new Date("2025-07-11T19:00:00Z") },
    { uid: "user3", timestamp: new Date("2025-07-12T20:30:00Z") },
  ];

  const seedLogins = async () => {
    try {
      for (const log of loginLogs) {
        await addDoc(collection(db, "loginLogs"), {
          uid: log.uid,
          timestamp: Timestamp.fromDate(log.timestamp),
        });
      }
      alert("✅ Dummy login data seeded successfully!");
    } catch (err) {
      console.error("Error seeding login logs:", err);
      alert("❌ Failed to seed login data. Check console.");
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>🧪 Dummy Login Log Seeder</h1>
      <p>This will add several dummy login records to Firestore.</p>
      <button
        onClick={seedLogins}
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1.1rem",
          backgroundColor: "#21808d",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginTop: "1rem",
        }}
      >
        ➕ Seed Login Logs
      </button>
    </div>
  );
}
