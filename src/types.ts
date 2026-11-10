export interface Booking {
  start: number; // minutes from midnight (0–1440)
  end: number;
  purpose: string;
}

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  blockedReason?: string;
  bookings: Booking[];
}

export interface RoomFilters {
  attendees: number | null; // null = no capacity filter
  equipment: string[]; // room must contain ALL of these
}

export interface AvailabilityResult {
  available: boolean;
  reasons: string[];
}
