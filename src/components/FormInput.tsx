export function FormInput({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-2 border border-gray-300 rounded-md ${className}`}
    />
  );
}
