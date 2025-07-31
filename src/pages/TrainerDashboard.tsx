import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

import styles from "./TrainerDashboard.module.css";

interface WorkoutPlan {
  id: string;
  name: string;
  difficulty: string;
  exercises: string[];
}

interface DietPlan {
  id: string;
  name: string;
  goal: string;
  meals: string[];
}

export default function TrainerDashboard() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [diets, setDiets] = useState<DietPlan[]>([]);

  const [newPlan, setNewPlan] = useState({
    name: "",
    difficulty: "",
    exercises: "",
  });

  const [newDiet, setNewDiet] = useState({
    name: "",
    goal: "",
    meals: "",
  });

  useEffect(() => {
    const fetchPlans = async () => {
      const querySnapshot = await getDocs(collection(db, "workoutPlans"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as WorkoutPlan[];
      setPlans(data);
    };

    const fetchDiets = async () => {
      const querySnapshot = await getDocs(collection(db, "dietPlans"));
      const data = querySnapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          name: docData.name || "",
          goal: docData.goal || "",
          meals: Array.isArray(docData.meals) ? docData.meals : [],
        };
      }) as DietPlan[];
      setDiets(data);
    };

    fetchPlans();
    fetchDiets();
  }, []);

  const handleAddPlan = async () => {
    if (!newPlan.name || !newPlan.difficulty || !newPlan.exercises) return;

    const newDoc = await addDoc(collection(db, "workoutPlans"), {
      name: newPlan.name,
      difficulty: newPlan.difficulty,
      exercises: newPlan.exercises.split(",").map((ex) => ex.trim()),
    });

    setPlans([
      ...plans,
      {
        id: newDoc.id,
        name: newPlan.name,
        difficulty: newPlan.difficulty,
        exercises: newPlan.exercises.split(",").map((ex) => ex.trim()),
      },
    ]);

    setNewPlan({ name: "", difficulty: "", exercises: "" });
  };

  const handleAddDiet = async () => {
    if (!newDiet.name || !newDiet.goal || !newDiet.meals) return;

    const newDoc = await addDoc(collection(db, "dietPlans"), {
      name: newDiet.name,
      goal: newDiet.goal,
      meals: newDiet.meals.split(",").map((m) => m.trim()),
    });

    setDiets([
      ...diets,
      {
        id: newDoc.id,
        name: newDiet.name,
        goal: newDiet.goal,
        meals: newDiet.meals.split(",").map((m) => m.trim()),
      },
    ]);

    setNewDiet({ name: "", goal: "", meals: "" });
  };

  const handleDeleteWorkout = async (id: string) => {
    await deleteDoc(doc(db, "workoutPlans", id));
    setPlans(plans.filter((plan) => plan.id !== id));
  };

  const handleDeleteDiet = async (id: string) => {
    await deleteDoc(doc(db, "dietPlans", id));
    setDiets(diets.filter((diet) => diet.id !== id));
  };

  return (
    <div className={styles.cardGrid}>
      {/* Workout Plan Form */}
      <div className={styles.card}>
        <h3 className={styles.cardHeader}>Add New Workout Plan</h3>
        <input
          type="text"
          placeholder="Plan Name"
          value={newPlan.name}
          onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Difficulty"
          value={newPlan.difficulty}
          onChange={(e) =>
            setNewPlan({ ...newPlan, difficulty: e.target.value })
          }
          className={styles.input}
        />
        <textarea
          placeholder="Exercises (comma separated)"
          value={newPlan.exercises}
          onChange={(e) =>
            setNewPlan({ ...newPlan, exercises: e.target.value })
          }
          className={styles.textarea}
        />
        <button onClick={handleAddPlan} className={styles.addBtn}>
          Add Workout
        </button>
      </div>

      {/* Diet Plan Form */}
      <div className={styles.card}>
        <h3 className={styles.cardHeader}>Add New Diet Plan</h3>
        <input
          type="text"
          placeholder="Diet Name"
          value={newDiet.name}
          onChange={(e) => setNewDiet({ ...newDiet, name: e.target.value })}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Goal"
          value={newDiet.goal}
          onChange={(e) => setNewDiet({ ...newDiet, goal: e.target.value })}
          className={styles.input}
        />
        <textarea
          placeholder="Meals (comma separated)"
          value={newDiet.meals}
          onChange={(e) => setNewDiet({ ...newDiet, meals: e.target.value })}
          className={styles.textarea}
        />
        <button onClick={handleAddDiet} className={styles.addBtn}>
          Add Diet
        </button>
      </div>

      {/* Workout Cards */}
      {plans.map((plan) => (
        <div key={plan.id} className={styles.card}>
          <h3 className={styles.cardHeader}>{plan.name}</h3>
          <p className={styles.cardContent}>
            <strong>Difficulty:</strong> {plan.difficulty}
          </p>
          <p className={styles.cardContent}>
            <strong>Exercises:</strong> {Array.isArray(plan.exercises) ? plan.exercises.join(", ") : "None"}
          </p>
          <button
            onClick={() => handleDeleteWorkout(plan.id)}
            className={styles.deleteBtn}
          >
            Delete
          </button>
        </div>
      ))}

      {/* Diet Cards */}
      {diets.map((diet) => (
        <div key={diet.id} className={styles.card}>
          <h3 className={styles.cardHeader}>{diet.name}</h3>
          <p className={styles.cardContent}>
            <strong>Goal:</strong> {diet.goal}
          </p>
          <p className={styles.cardContent}>
            <strong>Meals:</strong> {Array.isArray(diet.meals) ? diet.meals.join(", ") : "None"}
          </p>
          <button
            onClick={() => handleDeleteDiet(diet.id)}
            className={styles.deleteBtn}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
