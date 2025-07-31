import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

interface DietPlan {
  id: string;
  name: string;
  calories: number;
  meals: string[];
}

export default function DietPlans(): JSX.Element {
  const [plans, setPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const snapshot = await getDocs(collection(db, "dietPlans"));
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<DietPlan, "id">),
        }));
        setPlans(fetched);
      } catch (err) {
        console.error("Error fetching diet plans:", err);
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
          <h1>🥗 Diet Plans</h1>
          <p>Explore personalized meal plans to support your goals</p>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : plans.length === 0 ? (
        <p>No diet plans available.</p>
      ) : (
        <div className="plans-grid">
          {plans.map((plan) => (
            <div key={plan.id} className="plan-card">
              <div className="plan-header">
                <div>
                  <h3>{plan.name}</h3>
                  <p className="plan-meta">{plan.calories} kcal/day</p>
                </div>
                <div className="calorie-badge">{plan.calories} kcal</div>
              </div>

              {Array.isArray(plan.meals) ? (
                <ul className="meal-list">
                  {plan.meals.map((meal, idx) => (
                    <li key={idx}>{meal}</li>
                  ))}
                </ul>
              ) : (
                <p>No meals listed.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
