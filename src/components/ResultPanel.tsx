import { CheckCircle2, XCircle, Info } from "lucide-react";
import type { AvailabilityResult } from "@/types";
import { minutesToTime } from "@/domain/time";

interface ResultPanelProps {
  result: AvailabilityResult | null;
  start: number | null;
  end: number | null;
  roomName: string;
}

export function ResultPanel({
  result,
  start,
  end,
  roomName,
}: ResultPanelProps) {
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
        <Info className="h-8 w-8 text-slate-300" />
        <p className="mt-2 text-sm text-slate-400">
          Select a room, enter your times, and check availability to see the
          result here.
        </p>
      </div>
    );
  }

  if (result.available) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <div>
            <p className="text-base font-bold text-emerald-800">Available</p>
            <p className="text-sm text-emerald-600">
              {roomName} · {minutesToTime(start!)}–{minutesToTime(end!)}
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm text-emerald-700">
          This time slot is open and meets all booking rules. Existing bookings
          were not modified.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white">
          <XCircle className="h-6 w-6" />
        </span>
        <div>
          <p className="text-base font-bold text-rose-800">Unavailable</p>
          <p className="text-sm text-rose-600">
            {roomName}
            {start !== null && end !== null && (
              <> · {minutesToTime(start)}–{minutesToTime(end)}</>
            )}
          </p>
        </div>
      </div>
      <ul className="mt-3 space-y-1.5">
        {result.reasons.map((reason, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm text-rose-700"
          >
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
            {reason}
          </li>
        ))}
      </ul>
    </div>
  );
}
