// src/lib/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsbCtrYxqd_twXWdxXxuk-_BjvSeutcT0",
  authDomain: "fit-forge-38656.firebaseapp.com",
  projectId: "fit-forge-38656",
  storageBucket: "fit-forge-38656.appspot.com", // 🔧 FIXED HERE
  messagingSenderId: "933840748475",
  appId: "1:933840748475:web:3b9c820d077bb4a34f4e9e",
  measurementId: "G-LRGT8RH52J"
};

// ✅ Initialize Firebase services
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// ✅ Export initialized services
export { auth, db, storage };
