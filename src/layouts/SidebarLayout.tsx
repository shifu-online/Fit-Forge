import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SidebarLayout() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    try {
      const currentUser = localStorage.getItem("currentUser");
      if (currentUser) {
        const parsed = JSON.parse(currentUser);
        setRole(parsed.role); // "user", "trainer", "admin"
      }
    } catch (error) {
      console.error("Invalid user in localStorage. Resetting...");
      localStorage.removeItem("currentUser");
      setRole("");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">FitForge</h1>
          <p className="tagline">Forge your fitness path</p>
        </div>

        <ul className="nav-menu">
          {/* Dashboard (User) */}
          {role === "user" && (
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Dashboard
              </NavLink>
            </li>
          )}

          {/* User-only links */}
          {role === "user" && (
            <>
              <li>
                <NavLink
                  to="/fitness-tracking"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  Fitness Tracking
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/progress"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  Progress
                </NavLink>
              </li>
              {/* 🔥 Reports removed here */}
            </>
          )}

          {/* Shared links */}
          <li>
            <NavLink
              to="/workout-plans"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Workout Plans
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/diet-plans"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Diet Plans
            </NavLink>
          </li>

          {/* Trainer-only links */}
          {role === "trainer" && (
            <>
              <li>
                <NavLink
                  to="/trainer-dashboard"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  Trainer Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/trainer-reports"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  Reports
                </NavLink>
              </li>
            </>
          )}

          {/* Admin-only links */}
          {role === "admin" && (
            <>
              <li>
                <NavLink
                  to="/admin-panel"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  Admin Panel
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin-reports"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  Reports
                </NavLink>
              </li>
            </>
          )}

          {/* Profile */}
          {role && (
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Profile
              </NavLink>
            </li>
          )}

          {/* Auth or Logout */}
          {!role ? (
            <>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  Register
                </NavLink>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={handleLogout}
                className="nav-link"
                style={{ background: "none", border: "none" }}
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
