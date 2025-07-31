// src/pages/Profile.tsx

import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface UserProfile {
  name: string;
  email: string;
  role: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    const fetchUser = async () => {
      if (!uid) return;
      const docRef = doc(db, "users", uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        setUser(data);
        setEditedName(data.name);
        setEditedEmail(data.email);
      }
    };
    fetchUser();
  }, [uid]);

  const handleSaveProfile = async () => {
    if (!uid) return;
    await updateDoc(doc(db, "users", uid), {
      name: editedName,
      email: editedEmail,
    });
    setUser((prev) =>
      prev ? { ...prev, name: editedName, email: editedEmail } : prev
    );
    setEditing(false);
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-header">
        <h1>👤 Profile</h1>
        <p>Manage your personal information</p>
      </div>

      <div className="profile-box">
        {editing ? (
          <div className="profile-info edit-mode">
            <input
              className="form-control"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Full Name"
            />
            <input
              className="form-control"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              placeholder="Email Address"
            />
            <div className="btn-group mt-8">
              <button className="btn btn--primary" onClick={handleSaveProfile}>
                💾 Save
              </button>
              <button
                className="btn btn--outline"
                onClick={() => setEditing(false)}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-info">
            <p><strong>Name:</strong> {user?.name || "N/A"}</p>
            <p><strong>Email:</strong> {user?.email || "N/A"}</p>
            <p><strong>Role:</strong> {user?.role || "N/A"}</p>
            <button className="btn btn--sm btn--outline mt-4" onClick={() => setEditing(true)}>
              ✏️ Edit Info
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
