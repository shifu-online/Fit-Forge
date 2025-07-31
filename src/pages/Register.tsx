import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
    name: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Save full user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        createdAt: serverTimestamp(),
      });

      localStorage.setItem("currentUser", JSON.stringify({ uid: user.uid, role: formData.role }));
      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError("Failed to create account. " + err.message);
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
          <h2>Create Account</h2>
          {error && <p className="message message--error">{error}</p>}

          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              name="name"
              type="text"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
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
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              name="role"
              className="form-control"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="trainer">Trainer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button className="btn btn--primary btn--full-width" type="submit">
            Register
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
  );
}
