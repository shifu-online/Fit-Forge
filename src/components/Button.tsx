import React from "react";
import classNames from "classnames";

export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "danger";
  size?: "sm" | "md";
  onClick?: () => void;
  className?: string;
}) {
  const base =
    "rounded px-4 py-2 font-medium transition shadow-sm hover:opacity-90";
  const variants = {
    primary: "bg-blue-600 text-white",
    outline: "border border-gray-400 text-gray-800 bg-white",
    danger: "bg-red-600 text-white",
  };
  const sizes = {
    sm: "text-sm",
    md: "text-base",
  };

  return (
    <button
      onClick={onClick}
      className={classNames(base, variants[variant], sizes[size], className)}
    >
      {children}
    </button>
  );
}
