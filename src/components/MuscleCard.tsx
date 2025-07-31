import { useState } from "react";

type SubMuscle = {
  name: string;
  desc: string;
};

type MuscleGroup = {
  name: string;
  location: string;
  function: string;
  exercise: string;
  sub: SubMuscle[];
};

interface MuscleCardProps {
  group: MuscleGroup;
}

export default function MuscleCard({ group }: MuscleCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg shadow-sm p-4 bg-white dark:bg-gray-800 transition-all duration-200">
      <h2
        onClick={() => setExpanded(!expanded)}
        className="text-lg font-semibold cursor-pointer text-primary hover:underline"
      >
        {group.name}
      </h2>

      {expanded && (
        <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
          <p><strong>📍 Location:</strong> {group.location}</p>
          <p><strong>💪 Function:</strong> {group.function}</p>
          <p><strong>🏋️ Targeted by:</strong> {group.exercise}</p>

          <div className="mt-4 space-y-2">
            {group.sub.map((s, i) => (
              <details key={i} className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                <summary className="cursor-pointer font-medium text-primary">
                  🔸 {s.name}
                </summary>
                <p className="mt-1 text-sm">{s.desc}</p>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
