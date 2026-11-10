import type { AvailabilityResult, Booking, Room } from "@/types";
import { MAX_BOOKING_MINUTES, MINUTES_IN_DAY } from "./constants";
import { formatDuration, minutesToTime } from "./time";


export function isValidInterval(start: number, end: number): boolean {
  return start >= 0 && end <= MINUTES_IN_DAY && start < end;
}


export function exceedsMaxDuration(start: number, end: number): boolean {
  return end - start > MAX_BOOKING_MINUTES;
}


export function findConflicts(room: Room, start: number, end: number): Booking[] {
  return room.bookings.filter((b) => start < b.end && b.start < end);
}

function boundsReasons(start: number, end: number): string[] {
  const reasons: string[] = [];
  if (start < 0) reasons.push("Start time cannot be before 00:00.");
  if (end > MINUTES_IN_DAY) reasons.push("End time cannot exceed 24:00.");
  if (start >= end) reasons.push("Start time must be earlier than end time.");
  return reasons;
}

function conflictReasons(conflicts: Booking[]): string[] {
  if (conflicts.length === 0) return [];
  const labels = conflicts
    .map((b) => `${minutesToTime(b.start)}–${minutesToTime(b.end)}`)
    .join(", ");
  return [`Conflicts with existing booking${conflicts.length > 1 ? "s" : ""}: ${labels}.`];
}


export function checkAvailability(
  room: Room,
  start: number,
  end: number,
  currentTime: number
): AvailabilityResult {
  const valid = isValidInterval(start, end);

  const reasons: string[] = [
    ...boundsReasons(start, end),
    ...(valid && start <= currentTime
      ? [`Start time must be after the current time (${minutesToTime(currentTime)}).`]
      : []),
    ...(valid && exceedsMaxDuration(start, end)
      ? [
          `Booking duration is ${formatDuration(end - start)} — maximum allowed is ${MAX_BOOKING_MINUTES} minutes.`,
        ]
      : []),
    ...(room.blocked ? [room.blockedReason ?? "This room is currently blocked."] : []),
    ...(valid ? conflictReasons(findConflicts(room, start, end)) : []),
  ];

  return { available: reasons.length === 0, reasons };
}
export function isOverlapping(
  start1: Date | string,
  end1: Date | string,
  start2: Date | string,
  end2: Date | string
): boolean {
  const s1 = new Date(start1).getTime();
  const e1 = new Date(end1).getTime();
  const s2 = new Date(start2).getTime();
  const e2 = new Date(end2).getTime();
  return s1 < e2 && s2 < e1;
}

export function isPastTime(dateTime: Date | string, referenceTime?: Date | string): boolean {
  const target = new Date(dateTime).getTime();
  const now = referenceTime ? new Date(referenceTime).getTime() : Date.now();
  return target < now;
}