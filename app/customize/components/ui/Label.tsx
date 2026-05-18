import { ReactNode } from "react";

interface LabelProps {
  children: ReactNode;
  className?: string;
}

export function Label({ children, className = "" }: LabelProps) {
  return (
    <label className={`text-xs font-semibold text-text-secondary mb-2 block uppercase tracking-wider ${className}`}>
      {children}
    </label>
  );
}
