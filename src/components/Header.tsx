import React from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="section-header">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
