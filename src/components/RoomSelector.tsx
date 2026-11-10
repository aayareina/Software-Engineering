import { Building2, Users, Ban, CalendarClock } from "lucide-react";
import type { Room } from "@/types";

interface RoomSelectorProps {
  rooms: Room[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function RoomSelector({
  rooms,
  selectedId,
  onSelect,
}: RoomSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => {
        const isSelected = room.id === selectedId;
        return (
          <button
            key={room.id}
            type="button"
            onClick={() => onSelect(room.id)}
            aria-pressed={isSelected}
            className={[
              "group relative rounded-xl border p-4 text-left transition-all duration-200",
              "hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              isSelected
                ? "border-blue-500 bg-blue-50/60 ring-1 ring-blue-400 shadow-sm"
                : "border-slate-200 bg-white hover:border-slate-300",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span
                  className={[
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200",
                  ].join(" ")}
                >
                  <Building2 className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold leading-tight text-slate-800">
                    {room.name}
                  </p>
                  <p className="text-xs text-slate-400">{room.building}</p>
                </div>
              </div>
              {room.blocked && (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-600">
                  <Ban className="h-3 w-3" /> Blocked
                </span>
              )}
            </div>

            <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                {room.capacity} seats
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarClock className="h-3.5 w-3.5 text-slate-400" />
                {room.bookings.length} booking{room.bookings.length !== 1 ? "s" : ""}
              </span>
            </div>

            {room.equipment.length > 0 && (
              <p className="mt-2 text-[11px] leading-snug text-slate-400">
                {room.equipment.join(" · ")}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
