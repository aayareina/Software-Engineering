import { describe, it, expect } from 'vitest';
import {
  filterRooms,
  getEquipmentOptions,
  hasAllEquipment,
  hasEnoughCapacity,
  parseAttendees,
} from './filters';
import { checkAvailability } from './availability';
import { sampleRooms } from '../data/rooms';
import type { Room, RoomFilters } from '../types';

function mk(overrides: Partial<Room> = {}): Room {
  return {
    id: 'r1',
    name: 'Room',
    building: 'A',
    capacity: 20,
    equipment: ['Projector', 'Whiteboard'],
    blocked: false,
    bookings: [],
    ...overrides,
  };
}

const noFilters: RoomFilters = { attendees: null, equipment: [] };

describe('catalog', () => {
  it('has at least four rooms with unique ids', () => {
    expect(sampleRooms.length).toBeGreaterThanOrEqual(4);
    expect(new Set(sampleRooms.map((r) => r.id)).size).toBe(sampleRooms.length);
  });

  it('gives every room an equipment list and its own bookings array', () => {
    for (const room of sampleRooms) {
      expect(Array.isArray(room.equipment)).toBe(true);
      expect(Array.isArray(room.bookings)).toBe(true);
    }
  });
});

describe('F1 capacity filter', () => {
  it('accepts exact capacity (20 attendees, capacity 20)', () => {
    expect(hasEnoughCapacity(mk({ capacity: 20 }), 20)).toBe(true);
  });

  it('rejects insufficient capacity (21 attendees, capacity 20)', () => {
    expect(hasEnoughCapacity(mk({ capacity: 20 }), 21)).toBe(false);
  });

  it('does not filter by capacity when attendees is empty', () => {
    expect(filterRooms([mk()], noFilters)).toHaveLength(1);
  });

  it('keeps only rooms that fit in the real catalog', () => {
    const ids = filterRooms(sampleRooms, { ...noFilters, attendees: 30 }).map((r) => r.id);
    expect(ids).toEqual(['eng-101', 'aud-a', 'inno-lab']);
  });
});

describe('F2 equipment filter', () => {
  it('requires ALL selected items', () => {
    const room = mk({ equipment: ['Projector'] });
    expect(hasAllEquipment(room, ['Projector', 'Whiteboard'])).toBe(false);
    expect(hasAllEquipment(room, ['Projector'])).toBe(true);
  });

  it('combines capacity and equipment filters', () => {
    const rooms = [
      mk({ id: 'a', capacity: 10, equipment: ['Projector'] }),
      mk({ id: 'b', capacity: 30, equipment: ['Projector'] }),
      mk({ id: 'c', capacity: 30, equipment: ['Whiteboard'] }),
    ];
    const ids = filterRooms(rooms, { attendees: 20, equipment: ['Projector'] }).map((r) => r.id);
    expect(ids).toEqual(['b']);
  });

  it('lists distinct sorted equipment options', () => {
    const options = getEquipmentOptions(sampleRooms);
    expect(options).toEqual([...options].sort());
    expect(new Set(options).size).toBe(options.length);
  });
});

describe('F3 blocked room', () => {
  it('is never reported available, even for a free valid interval', () => {
    const result = checkAvailability(mk({ blocked: true }), 700, 760, 540);
    expect(result.available).toBe(false);
  });

  it('stays in the filter results (it is rejected by checkAvailability, not hidden)', () => {
    expect(filterRooms([mk({ blocked: true })], noFilters)).toHaveLength(1);
  });
});

describe('F4 empty state', () => {
  it('returns an empty list when no room matches', () => {
    expect(filterRooms(sampleRooms, { ...noFilters, attendees: 500 })).toEqual([]);
  });

  it('returns an empty list for an impossible equipment combination', () => {
    const filters = { attendees: null, equipment: ['Projector', 'Easels'] };
    expect(filterRooms(sampleRooms, filters)).toEqual([]);
  });
});

describe('F5 availability uses the chosen room', () => {
  it('same interval conflicts in one room and is free in another', () => {
    const busy = mk({ id: 'busy', bookings: [{ start: 600, end: 660, purpose: 'Class' }] });
    const free = mk({ id: 'free', bookings: [] });
    expect(checkAvailability(busy, 620, 680, 540).available).toBe(false);
    expect(checkAvailability(free, 620, 680, 540).available).toBe(true);
  });

  it('does not mutate the catalog while filtering or checking', () => {
    const snapshot = structuredClone(sampleRooms);
    filterRooms(sampleRooms, { attendees: 10, equipment: ['Projector'] });
    checkAvailability(sampleRooms[0], 500, 560, 400);
    expect(sampleRooms).toEqual(snapshot);
  });
});

describe('parseAttendees', () => {
  it('parses a positive number', () => {
    expect(parseAttendees('25')).toBe(25);
  });

  it('treats empty, zero, negative and non-numeric input as no filter', () => {
    expect(parseAttendees('')).toBeNull();
    expect(parseAttendees('0')).toBeNull();
    expect(parseAttendees('-3')).toBeNull();
    expect(parseAttendees('abc')).toBeNull();
  });
});
