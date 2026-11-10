import { useMemo, useState } from "react";
import { GraduationCap, Clock, ArrowRight, ArrowLeftRight } from "lucide-react";
import { sampleRooms } from "@/data/rooms";
import { MAX_BOOKING_MINUTES } from "@/domain/constants";
import { checkAvailability, exceedsMaxDuration } from "@/domain/availability";
import {
  filterRooms,
  getEquipmentOptions,
  parseAttendees,
} from "@/domain/filters";
import { formatDuration, minutesToTime, timeToMinutes } from "@/domain/time";
import type { AvailabilityResult } from "@/types";
import { RoomSelector } from "@/components/RoomSelector";
import { RoomFilterPanel } from "@/components/RoomFilterPanel";
import { TimeField } from "@/components/TimeField";
import { Timeline } from "@/components/Timeline";
import { ResultPanel } from "@/components/ResultPanel";

const EQUIPMENT_OPTIONS = getEquipmentOptions(sampleRooms);

function defaultCurrentTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export default function App() {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [currentTimeStr, setCurrentTimeStr] = useState(defaultCurrentTime());
  const [startTimeStr, setStartTimeStr] = useState("");
  const [endTimeStr, setEndTimeStr] = useState("");
  const [result, setResult] = useState<AvailabilityResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [attendeesStr, setAttendeesStr] = useState("");
  const [requiredEquipment, setRequiredEquipment] = useState<string[]>([]);

  const visibleRooms = useMemo(
    () =>
      filterRooms(sampleRooms, {
        attendees: parseAttendees(attendeesStr),
        equipment: requiredEquipment,
      }),
    [attendeesStr, requiredEquipment]
  );

  // The selected room is always looked up among the visible rooms,
  // so a room hidden by the filters can never be checked by mistake.
  const selectedRoom = useMemo(
    () => visibleRooms.find((r) => r.id === selectedRoomId) ?? null,
    [visibleRooms, selectedRoomId]
  );

  const currentTime = timeToMinutes(currentTimeStr) ?? 0;
  const candidateStart = startTimeStr ? timeToMinutes(startTimeStr) : null;
  const candidateEnd = endTimeStr ? timeToMinutes(endTimeStr) : null;

  const duration =
    candidateStart !== null && candidateEnd !== null && candidateEnd > candidateStart
      ? candidateEnd - candidateStart
      : null;

  /** Applies new filters; drops selection + result if the room is filtered out. */
  function updateFilters(nextAttendeesStr: string, nextEquipment: string[]) {
    setAttendeesStr(nextAttendeesStr);
    setRequiredEquipment(nextEquipment);
    const stillVisible = filterRooms(sampleRooms, {
      attendees: parseAttendees(nextAttendeesStr),
      equipment: nextEquipment,
    }).some((r) => r.id === selectedRoomId);
    if (!stillVisible) {
      setSelectedRoomId(null);
      setResult(null);
      setFormError(null);
    }
  }

  function toggleEquipment(item: string) {
    updateFilters(
      attendeesStr,
      requiredEquipment.includes(item)
        ? requiredEquipment.filter((e) => e !== item)
        : [...requiredEquipment, item]
    );
  }

  // F5: changing the room re-evaluates the already entered interval
  // against the NEW room's bookings (or clears the result if times are incomplete).
  function handleSelectRoom(id: string) {
    setSelectedRoomId(id);
    setFormError(null);
    const room = visibleRooms.find((r) => r.id === id);
    const start = timeToMinutes(startTimeStr);
    const end = timeToMinutes(endTimeStr);
    const current = timeToMinutes(currentTimeStr);
    setResult(
      room && start !== null && end !== null && current !== null
        ? checkAvailability(room, start, end, current)
        : null
    );
  }

  function handleCheck() {
    setFormError(null);

    if (!selectedRoom) {
      setFormError("Please select a room first.");
      setResult(null);
      return;
    }

    const start = timeToMinutes(startTimeStr);
    const end = timeToMinutes(endTimeStr);

    if (start === null || end === null) {
      setFormError("Please enter valid start and end times (HH:MM).");
      setResult(null);
      return;
    }

    const currentMin = timeToMinutes(currentTimeStr);
    if (currentMin === null) {
      setFormError("Please enter a valid current time.");
      setResult(null);
      return;
    }

    setResult(checkAvailability(selectedRoom, start, end, currentMin));
  }

  function handleReset() {
    setResult(null);
    setFormError(null);
    setStartTimeStr("");
    setEndTimeStr("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/40">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <GraduationCap className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl">
              Smart Campus Room Checker
            </h1>
            <p className="text-xs text-slate-400 sm:text-sm">
              Check room availability before booking — no changes saved.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Left column: form */}
          <div className="space-y-6">
            {/* Filters */}
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                1. Filter rooms
              </h2>
              <RoomFilterPanel
                attendeesStr={attendeesStr}
                onAttendeesChange={(v) => updateFilters(v, requiredEquipment)}
                options={EQUIPMENT_OPTIONS}
                selected={requiredEquipment}
                onToggle={toggleEquipment}
                onClear={() => updateFilters("", [])}
              />
            </section>

            {/* Room selection */}
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                2. Select a room{" "}
                <span className="font-normal normal-case text-slate-400">
                  ({visibleRooms.length} of {sampleRooms.length} shown)
                </span>
              </h2>
              {visibleRooms.length === 0 ? (
                <div
                  role="status"
                  className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-6 text-center text-sm text-slate-500"
                >
                  No rooms match your requirements. Try fewer attendees or less
                  equipment.
                </div>
              ) : (
                <RoomSelector
                  rooms={visibleRooms}
                  selectedId={selectedRoomId}
                  onSelect={handleSelectRoom}
                />
              )}
            </section>

            {/* Time inputs */}
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                3. Enter time interval
              </h2>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <TimeField
                    id="current-time"
                    label="Current time"
                    icon={<Clock className="h-3.5 w-3.5 text-amber-500" />}
                    value={currentTimeStr}
                    onChange={(v) => {
                      setCurrentTimeStr(v);
                      setResult(null);
                    }}
                  />
                  <TimeField
                    id="start-time"
                    label="Start time"
                    icon={<ArrowRight className="h-3.5 w-3.5 text-emerald-500" />}
                    value={startTimeStr}
                    onChange={(v) => {
                      setStartTimeStr(v);
                      setResult(null);
                      setFormError(null);
                    }}
                  />
                  <TimeField
                    id="end-time"
                    label="End time"
                    icon={<ArrowRight className="h-3.5 w-3.5 text-rose-500" />}
                    value={endTimeStr}
                    onChange={(v) => {
                      setEndTimeStr(v);
                      setResult(null);
                      setFormError(null);
                    }}
                  />
                </div>

                {/* Duration hint */}
                {duration !== null && (
                  <p
                    className={[
                      "mt-3 inline-flex items-center gap-1.5 text-xs font-medium",
                      exceedsMaxDuration(candidateStart!, candidateEnd!)
                        ? "text-rose-600"
                        : "text-slate-500",
                    ].join(" ")}
                  >
                    <ArrowLeftRight className="h-3.5 w-3.5" />
                    Duration: {formatDuration(duration)}
                    {exceedsMaxDuration(candidateStart!, candidateEnd!) &&
                      ` (exceeds ${MAX_BOOKING_MINUTES} min limit)`}
                  </p>
                )}

                {/* Form error */}
                {formError && (
                  <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
                    {formError}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCheck}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow active:scale-[0.98]"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                    Check Availability
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </section>

            {/* Timeline */}
            {selectedRoom && (
              <section>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  4. Visual schedule
                </h2>
                <Timeline
                  room={selectedRoom}
                  candidateStart={candidateStart}
                  candidateEnd={candidateEnd}
                  available={result?.available ?? null}
                  currentTime={currentTime}
                />
              </section>
            )}
          </div>

          {/* Right column: result */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Result
            </h2>
            {selectedRoom ? (
              <ResultPanel
                result={result}
                start={candidateStart}
                end={candidateEnd}
                roomName={selectedRoom.name}
              />
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                <GraduationCap className="h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm text-slate-400">
                  Pick a room to begin checking availability.
                </p>
              </div>
            )}

            {/* Existing bookings list */}
            {selectedRoom && selectedRoom.bookings.length > 0 && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="mb-2 text-sm font-semibold text-slate-700">
                  Existing bookings
                </h3>
                <ul className="space-y-1.5">
                  {selectedRoom.bookings.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-600">{b.purpose}</span>
                      <span className="font-mono text-slate-400">
                        {minutesToTime(b.start)}–{minutesToTime(b.end)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-5xl px-4 pb-8 sm:px-6">
        <p className="text-center text-xs text-slate-400">
          Fictional sample data for demonstration · No bookings are saved or
          modified.
        </p>
      </footer>
    </div>
  );
}
