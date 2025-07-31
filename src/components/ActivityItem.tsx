export default function ActivityItem({
  text,
  date,
}: {
  text: string;
  date: string;
}) {
  return (
    <div className="border-b py-2">
      <p className="text-sm text-gray-700">{text}</p>
      <p className="text-xs text-gray-400">{date}</p>
    </div>
  );
}
