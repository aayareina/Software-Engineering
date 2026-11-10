import type { Room } from "@/types";
import { minutesToTime } from "@/domain/time";

interface TimelineProps {
  room: Room;
  candidateStart: number | null;
  candidateEnd: number | null;
  available: boolean | null;
  currentTime: number;
}

const HOUR_MARKS = [0, 3, 6, 9, 12, 15, 18, 21, 24];

export function Timeline({
  room,
  candidateStart,
  candidateEnd,
  available,
  currentTime,
}: TimelineProps) {
  const toPct = (min: number) => (min / 1440) * 100;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">
          Today's Schedule
        </h3>
        <span className="text-xs text-slate-400">{room.name}</span>
      </div>

      {/* Track */}
      <div className="relative mt-3 h-12 overflow-hidden rounded-lg bg-slate-100">
        {/* Hour gridlines */}
        {HOUR_MARKS.map((h) => (
          <div
            key={h}
            className="absolute top-0 bottom-0 border-l border-slate-200"
            style={{ left: `${toPct(h * 60)}%` }}
          />
        ))}

        {/* Existing bookings */}
        {room.bookings.map((b, i) => (
          <div
            key={i}
            className="absolute top-1 bottom-1 flex items-center justify-center overflow-hidden rounded-md bg-teal-500/80 px-1 text-[10px] font-medium text-white"
            style={{
              left: `${toPct(b.start)}%`,
              width: `${toPct(b.end - b.start)}%`,
            }}
            title={`${b.purpose} · ${minutesToTime(b.start)}–${minutesToTime(b.end)}`}
          >
            <span className="truncate">{b.purpose}</span>
          </div>
        ))}

        {/* Candidate interval */}
        {candidateStart !== null &&
          candidateEnd !== null &&
          candidateStart < candidateEnd && (
            <div
              className={[
                "absolute top-0 bottom-0 rounded-md border-2 transition-colors",
                available === true
                  ? "border-emerald-500 bg-emerald-400/30"
                  : available === false
                    ? "border-rose-500 bg-rose-400/30"
                    : "border-blue-400 bg-blue-300/20",
              ].join(" ")}
              style={{
                left: `${toPct(candidateStart)}%`,
                width: `${toPct(candidateEnd - candidateStart)}%`,
              }}
            />
          )}

        {/* Current time marker */}
        <div
          className="absolute top-0 bottom-0 z-10 w-0.5 bg-amber-500"
          style={{ left: `${toPct(currentTime)}%` }}
          title={`Current time: ${minutesToTime(currentTime)}`}
        >
          <span className="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-full text-[9px] font-semibold text-amber-600">
            now
          </span>
        </div>
      </div>

      {/* Hour labels */}
      <div className="relative mt-1.5 h-4">
        {HOUR_MARKS.map((h) => (
          <span
            key={h}
            className="absolute -translate-x-1/2 text-[10px] text-slate-400"
            style={{ left: `${toPct(h * 60)}%` }}
          >
            {String(h).padStart(2, "0")}:00
          </span>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-teal-500/80" /> Existing
          booking
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm border-2 border-emerald-500 bg-emerald-400/30" />
          Your request
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-3 bg-amber-500" /> Current time
        </span>
      </div>
    </div>
  );
}
