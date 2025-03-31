import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-pageBg shadow-md rounded-lg p-4 max-w-[500px] ${className}`}
    >
      {children}
    </div>
  );
}
