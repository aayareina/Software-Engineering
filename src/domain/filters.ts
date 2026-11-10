import type { Room, RoomFilters } from "@/types";

/** F1: capacity >= requested attendees. No attendee value means "no filter". */
export function hasEnoughCapacity(room: Room, attendees: number | null): boolean {
  return attendees === null || room.capacity >= attendees;
}

/** F2: room must contain ALL required items. */
export function hasAllEquipment(room: Room, required: string[]): boolean {
  return required.every((item) => room.equipment.includes(item));
}

/**
 * Pure filtering. Blocked rooms are intentionally NOT removed here:
 * they stay visible (with a badge) and F3 is enforced in checkAvailability.
 */
export function filterRooms(rooms: Room[], filters: RoomFilters): Room[] {
  return rooms.filter(
    (room) =>
      hasEnoughCapacity(room, filters.attendees) &&
      hasAllEquipment(room, filters.equipment)
  );
}

/** All distinct equipment names in the catalog, sorted, for the filter UI. */
export function getEquipmentOptions(rooms: Room[]): string[] {
  return [...new Set(rooms.flatMap((r) => r.equipment))].sort();
}

/** Converts the attendees text field to a number; empty/invalid/<1 → null. */
export function parseAttendees(text: string): number | null {
  if (text.trim() === "") return null;
  const n = Number(text);
  return Number.isFinite(n) && n >= 1 ? n : null;
}
