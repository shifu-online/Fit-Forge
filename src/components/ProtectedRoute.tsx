// src/components/ProtectedRoute.tsx

import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps): JSX.Element {
  const userData = localStorage.getItem("currentUser");
  const user = userData ? JSON.parse(userData) : null;
  const userRole = user?.role;

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Role not allowed
    return <Navigate to="/" replace />;
  }

  return children;
}
