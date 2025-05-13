interface BadgeProps {
  name: string;
  color?: string;
  className?: string;
}

export function Badge({ name, color = "blue", className = "" }: BadgeProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    red: "bg-red-100 text-red-800",
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    gray: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${
        colorClasses[color as keyof typeof colorClasses] || colorClasses.gray
      } ${className}`}
    >
      {name}
    </span>
  );
}
