// src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SidebarLayout from "./layouts/SidebarLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import FitnessTracking from "./pages/FitnessTracking";
import WorkoutPlans from "./pages/WorkoutPlans";
import DietPlans from "./pages/DietPlans";
import ProgressReport from "./pages/ProgressReport"; // ✅ renamed & unified
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Role-specific pages
import TrainerDashboard from "./pages/TrainerDashboard";
import TrainerReports from "./pages/TrainerReports";
import AdminPanel from "./pages/AdminPanel";
import AdminReports from "./pages/AdminReports";



// Get user role from localStorage
function getRole(): string | null {
  try {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user).role : null;
  } catch {
    return null;
  }
}

// Role-protected route wrapper
function RequireRole({
  allowed,
  children,
}: {
  allowed: string[];
  children: JSX.Element;
}) {
  const role = getRole();
  if (!role) return <Navigate to="/login" />;
  return allowed.includes(role) ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Layout */}
        <Route element={<SidebarLayout />}>
          <Route path="/" element={<Dashboard />} />

          {/* User-Only Routes */}
          <Route
            path="/fitness-tracking"
            element={
              <RequireRole allowed={["user"]}>
                <FitnessTracking />
              </RequireRole>
            }
          />
          <Route
            path="/progress"
            element={
              <RequireRole allowed={["user"]}>
                <ProgressReport />
              </RequireRole>
            }
          />
          {/* Redirect old report path to progress */}
          <Route path="/reports" element={<Navigate to="/progress" replace />} />

          {/* Shared Routes */}
          <Route path="/workout-plans" element={<WorkoutPlans />} />
          <Route path="/diet-plans" element={<DietPlans />} />
          <Route path="/profile" element={<Profile />} />

          {/* Trainer Routes */}
          <Route
            path="/trainer-dashboard"
            element={
              <RequireRole allowed={["trainer", "admin"]}>
                <TrainerDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/trainer-reports"
            element={
              <RequireRole allowed={["trainer"]}>
                <TrainerReports />
              </RequireRole>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin-panel"
            element={
              <RequireRole allowed={["admin"]}>
                <AdminPanel />
              </RequireRole>
            }
          />
          <Route
            path="/admin-reports"
            element={
              <RequireRole allowed={["admin"]}>
                <AdminReports />
              </RequireRole>
            }
          />
        </Route>

            
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
