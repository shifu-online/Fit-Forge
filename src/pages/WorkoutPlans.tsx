// src/pages/WorkoutPlans.tsx

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

interface WorkoutPlan {
  id: string;
  name: string;
  difficulty: string;
  exercises: string[];
}

export default function WorkoutPlans() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const snapshot = await getDocs(collection(db, "workoutPlans"));
        const fetchedPlans: WorkoutPlan[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          console.log("📦 Plan fetched from Firestore:", data);

          if (Array.isArray(data.exercises)) {
            fetchedPlans.push({
              id: doc.id,
              name: data.name || "Unnamed Plan",
              difficulty: data.difficulty || "Unknown",
              exercises: data.exercises,
            });
          }
        });

        setPlans(fetchedPlans);
      } catch (err) {
        console.error("🔥 Error fetching workout plans:", err);
        setError("Failed to load workout plans.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <>
      <div className="section-header">
        <div>
          <h1>🏋️ Workout Plans</h1>
          <p>Browse curated workout routines for your fitness goals</p>
        </div>
      </div>

      {loading ? (
        <p>Loading workout plans...</p>
      ) : error ? (
        <p className="message message--error">{error}</p>
      ) : plans.length === 0 ? (
        <p>No workout plans found.</p>
      ) : (
        <div className="plans-grid">
          {plans.map((plan) => (
            <div className="plan-card" key={plan.id}>
              <div className="plan-header">
                <div>
                  <h3>{plan.name}</h3>
                  <p className="plan-meta">{plan.exercises.length} Exercises</p>
                </div>
                <span className={`difficulty-badge difficulty-${plan.difficulty.toLowerCase()}`}>
                  {plan.difficulty}
                </span>
              </div>

              <ul className="plan-exercises">
                {plan.exercises.map((ex, idx) => (
                  <li key={idx}>{ex}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
