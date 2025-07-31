// src/components/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", label: "Dashboard" },
  { path: "/fitness-tracking", label: "Fitness Tracking" },
  { path: "/workout-plans", label: "Workout Plans" },
  { path: "/diet-plans", label: "Diet Plans" },
  { path: "/progress", label: "Progress" }
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">FitForge</h1>
        <p className="text-sm text-zinc-500">Your Fitness Dashboard</p>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-4 py-2 rounded-md transition-all ${
              location.pathname === item.path
                ? "bg-primary text-white"
                : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
