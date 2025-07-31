export default function FlashCard({
  title,
  description,
  icon,
  onClick,
}: {
  title: string;
  description: string;
  icon: JSX.Element;
  onClick?: () => void;
}) {
  return (
    <div
      className="rounded-2xl p-6 shadow bg-white cursor-pointer hover:shadow-md transition"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="text-2xl">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}
