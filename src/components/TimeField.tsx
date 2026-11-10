import type { ReactNode } from "react";

interface TimeFieldProps {
  id: string;
  label: string;
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
}

export function TimeField({ id, label, icon, value, onChange }: TimeFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600"
      >
        {icon}
        {label}
      </label>
      <input
        id={id}
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}
