import React from "react";

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white p-6 rounded-2xl shadow">{children}</div>;
}

export function CardHeader({ title }: { title: string }) {
  return <h3 className="text-xl font-bold mb-4">{title}</h3>;
}
