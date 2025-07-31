// src/pages/Login.tsx

import { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // ✅ Get role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      if (!userData || !userData.role) {
        setError("User role not found.");
        return;
      }

      // ✅ Save to localStorage
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ uid: user.uid, role: userData.role })
      );

      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError("Login failed. " + err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="logo">FitForge</h1>
          <p className="tagline">Forge your fitness path</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          {error && <p className="message message--error">{error}</p>}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button className="btn btn--primary btn--full-width" type="submit">
            Login
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
      </div>
    </div>
  );
}
