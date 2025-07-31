export default function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl shadow p-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-lg font-semibold">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
