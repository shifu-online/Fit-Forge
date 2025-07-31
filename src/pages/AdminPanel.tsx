import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

type Role = "user" | "trainer";

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: Role;
  uid?: string;
  photoURL?: string;
}

export default function AdminPanel(): JSX.Element {
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [form, setForm] = useState<{
    name: string;
    email: string;
    password: string;
    role: Role;
  }>({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const fetched = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
          } as UserAccount;
        });
        setAccounts(fetched);
      } catch (err) {
        console.error("Error fetching accounts:", err);
      }
    };

    fetchAccounts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this account?")) {
      await deleteDoc(doc(db, "users", id));
      setAccounts((prev) => prev.filter((acc) => acc.id !== id));
    }
  };

  const handleAdd = async () => {
    const { name, email, password, role } = form;
    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await addDoc(collection(db, "users"), {
        uid: cred.user.uid,
        name,
        email,
        role,
      });

      setAccounts((prev) => [
        ...prev,
        {
          id: cred.user.uid,
          name,
          email,
          role,
          uid: cred.user.uid,
        },
      ]);

      setForm({ name: "", email: "", password: "", role: "user" });
    } catch (err) {
      console.error("Error creating user:", err);
      alert("Failed to add account. Email might already be in use.");
    }
    setIsLoading(false);
  };

  const renderCard = (user: UserAccount) => (
    <div key={user.id} className="trainer-flashcard">
      <div className="trainer-pfp">
        {user.photoURL ? (
          <img src={user.photoURL} alt="pfp" />
        ) : (
          <div className="pfp-placeholder">
            {user.name?.charAt(0).toUpperCase() || "?"}
          </div>
        )}
      </div>

      <div className="trainer-info">
        <h4>{user.name}</h4>
        <p>{user.email}</p>
        <span className="role-tag">{user.role}</span>
      </div>

      <div className="trainer-actions">
        <button
          className="btn btn--sm btn--danger"
          onClick={() => handleDelete(user.id)}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-panel">
      <div className="section-header">
        <h1>👑 Admin Panel</h1>
        <p>Manage trainers and users</p>
      </div>

      <div className="form-card-container">
        <div className="form-card">
          <h3>Add New Account</h3>
          <div className="form-row">
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="form-control"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="form-control"
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="form-control"
            />
            <select
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value as Role,
                })
              }
              className="form-control"
            >
              <option value="user">User</option>
              <option value="trainer">Trainer</option>
            </select>
            <button
              className="btn btn--primary"
              onClick={handleAdd}
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "➕ Add Account"}
            </button>
          </div>
        </div>
      </div>

      <h3>🧑‍🏫 Trainers</h3>
      <div className="flashcard-grid">
        {accounts.filter((u) => u.role === "trainer").map(renderCard)}
      </div>

      <h3 className="mt-4">🙋‍♂️ Users</h3>
      <div className="flashcard-grid">
        {accounts.filter((u) => u.role === "user").map(renderCard)}
      </div>

      <style>{`
        .form-card-container {
          margin-bottom: 2rem;
          padding: 1.5rem;
          border-radius: 12px;
          background: linear-gradient(145deg, #1a222d, #1e293b);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
        }

        .form-card h3 {
          margin-bottom: 1rem;
          color: var(--color-text-primary);
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }

        .form-row .form-control,
        .form-row select {
          padding: 0.75rem;
          background: #181a1f;
          color: #fff;
          border: 1px solid #333;
          border-radius: 8px;
        }

        .form-row button {
          grid-column: span 2;
          justify-self: start;
          margin-top: 0.5rem;
        }

        .flashcard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .trainer-flashcard {
          background: linear-gradient(145deg, #1c2734, #222f3e);
          border: 2px solid var(--color-primary);
          border-radius: 14px;
          padding: 1.5rem;
          box-shadow: 0 10px 24px rgba(0,0,0,0.35);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .trainer-pfp img {
          width: 80px;
          height: 80px;
          border-radius: 100%;
          object-fit: cover;
          border: 3px solid var(--color-primary);
        }

        .pfp-placeholder {
          width: 80px;
          height: 80px;
          background: var(--color-secondary);
          color: var(--color-primary);
          border-radius: 100%;
          font-weight: bold;
          font-size: 1.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid var(--color-primary);
        }

        .trainer-info {
          margin: 1rem 0;
        }

        .trainer-info h4 {
          margin: 0.4rem 0;
          color: #ffffff;
        }

        .trainer-info p {
          margin: 0.25rem 0;
          font-size: 0.95rem;
          color: var(--color-text-secondary);
        }

        .trainer-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .role-tag {
          display: inline-block;
          margin-top: 0.4rem;
          background: var(--color-primary);
          color: var(--color-btn-primary-text);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .mt-4 {
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
}
