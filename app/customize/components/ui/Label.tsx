import { ReactNode } from "react";

interface LabelProps {
  children: ReactNode;
}

export function Label({ children }: LabelProps) {
  return (
    <label className="text-xs font-semibold text-zinc-500 mb-2 block uppercase tracking-wider">
      {children}
    </label>
  );
}
