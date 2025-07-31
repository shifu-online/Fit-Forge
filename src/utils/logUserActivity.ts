import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Log user activity to Firestore
export const logUserActivity = async (activity: string) => {
  try {
    const userJSON = localStorage.getItem("currentUser");
    if (!userJSON) throw new Error("No user found");

    const user = JSON.parse(userJSON);
    const userId = user?.uid || "guest";

    const activityRef = collection(db, "userActivity"); // ✅ Correct usage: only 2 args needed
    await addDoc(activityRef, {
      userId,
      activity,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error logging user activity:", error);
  }
};
