import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  DocumentData,
} from "firebase/firestore";
import WorkoutChart from "../components/WorkoutChart";

interface ExerciseLog extends DocumentData {
  id: string;
  name: string;
  sets: number;
  reps: number;
  duration: number;
  date?: any;
  uid: string;
}

export default function FitnessTracking(): JSX.Element {
  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [duration, setDuration] = useState(0);
  const [logs, setLogs] = useState<ExerciseLog[]>([]);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user) return;

      try {
        const q = query(collection(db, "activityLogs"), where("uid", "==", user.uid));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ExerciseLog[];

        setLogs(data);
      } catch (err) {
        console.error("Error loading logs:", err);
      }
    };

    fetchLogs();
  }, [user]);

  const handleAddExercise = async () => {
    if (!exercise || duration <= 0 || !user) return;

    const newLog = {
      name: exercise,
      sets,
      reps,
      duration,
      date: serverTimestamp(),
      uid: user.uid,
    };

    try {
      const docRef = await addDoc(collection(db, "activityLogs"), newLog);
      setLogs((prev) => [
        ...prev,
        {
          ...newLog,
          id: docRef.id,
        },
      ]);
      setExercise("");
      setSets(0);
      setReps(0);
      setDuration(0);
    } catch (err) {
      console.error("Failed to add log:", err);
    }
  };

  const totalDuration = logs.reduce((sum, log) => sum + log.duration, 0);
  const caloriesBurned = totalDuration * 6;

  return (
    <>
      <div className="section-header">
        <div>
          <h1>🏋️ Fitness Tracking</h1>
          <p>Track your workouts and stay on top of your goals</p>
        </div>
      </div>

      <div className="dashboard-grid mb-8">
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>{caloriesBurned} kcal</h3>
            <p>Calories Burned</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <h3>{totalDuration} min</h3>
            <p>Total Workout Time</p>
          </div>
        </div>
      </div>

      <div className="card mb-8">
        <div className="card__body">
          <div className="form-group">
            <label htmlFor="exercise" className="form-label">Exercise</label>
            <input
              type="text"
              id="exercise"
              className="form-control"
              placeholder="e.g., Bench Press"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sets" className="form-label">Sets</label>
              <input
                type="number"
                id="sets"
                className="form-control"
                value={sets}
                onChange={(e) => setSets(parseInt(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="reps" className="form-label">Reps</label>
              <input
                type="number"
                id="reps"
                className="form-control"
                value={reps}
                onChange={(e) => setReps(parseInt(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration" className="form-label">Duration (min)</label>
              <input
                type="number"
                id="duration"
                className="form-control"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
              />
            </div>
          </div>

          <button className="btn btn--primary mt-8" onClick={handleAddExercise}>
            ➕ Add Exercise
          </button>
        </div>
      </div>

      <div className="card mb-8">
        <div className="card__body">
          <h3>📋 Logged Exercises</h3>

          {logs.length === 0 ? (
            <p className="mt-8">No exercises logged yet.</p>
          ) : (
            <ul className="meal-list mt-8">
              {logs.map((log) => (
                <li key={log.id}>
                  <strong>{log.name}</strong> — {log.sets} sets x {log.reps} reps ({log.duration} mins)
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {logs.length > 0 && <WorkoutChart logs={logs} />}
    </>
  );
}
