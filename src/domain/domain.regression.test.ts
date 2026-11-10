
import { describe, it, expect } from 'vitest';
import { minutesToTime, timeToMinutes, formatDuration } from './time';
import { checkAvailability } from './availability';
import type { Room } from '../types';

function makeRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: '101',
    name: 'Room 101',
    building: 'A',
    capacity: 20,
    equipment: [],
    blocked: false,
    bookings: [{ start: 600, end: 660, purpose: 'Class' }],
    ...overrides,
  };
}

describe('time utilities', () => {
  it('formats midnight', () => {
    expect(minutesToTime(0)).toBe('00:00');
  });

  it('formats 9:00', () => {
    expect(minutesToTime(540)).toBe('09:00');
  });

  it('formats the end of day', () => {
    expect(minutesToTime(1440)).toBe('24:00');
  });

  it('converts a valid time to minutes', () => {
    expect(timeToMinutes('09:30')).toBe(570);
  });

  it('rejects an invalid hour', () => {
    expect(timeToMinutes('24:00')).toBeNull();
  });

  it('rejects an invalid minute', () => {
    expect(timeToMinutes('12:60')).toBeNull();
  });

  it('rejects malformed time text', () => {
    expect(timeToMinutes('9:30')).toBeNull();
  });

  it('formats minutes only', () => {
    expect(formatDuration(45)).toBe('45 min');
  });

  it('formats whole hours', () => {
    expect(formatDuration(120)).toBe('2 hr');
  });

  it('formats hours and minutes', () => {
    expect(formatDuration(90)).toBe('1 hr 30 min');
  });
});

describe('checkAvailability', () => {
  it('allows a valid free interval', () => {
    expect(checkAvailability(makeRoom(), 700, 760, 540).available).toBe(true);
  });

  it('rejects a start time equal to current time', () => {
  expect(
    checkAvailability(makeRoom(), 540, 600, 540).available
  ).toBe(false);
});

  it('rejects a start time before current time', () => {
    expect(checkAvailability(makeRoom(), 530, 550, 540).available).toBe(false);
  });

  it('rejects when start equals end', () => {
    expect(checkAvailability(makeRoom(), 700, 700, 540).available).toBe(false);
  });

  it('rejects when start is after end', () => {
    expect(checkAvailability(makeRoom(), 750, 700, 540).available).toBe(false);
  });

  it('rejects a start before midnight', () => {
    expect(checkAvailability(makeRoom(), -1, 30, -10).available).toBe(false);
  });

  it('rejects an end after 24:00', () => {
    expect(checkAvailability(makeRoom(), 1380, 1441, 500).available).toBe(false);
  });

  it('allows exactly 120 minutes', () => {
    expect(checkAvailability(makeRoom(), 700, 820, 540).available).toBe(true);
  });

  it('rejects more than 120 minutes', () => {
    expect(checkAvailability(makeRoom(), 700, 821, 540).available).toBe(false);
  });

  it('rejects a blocked room', () => {
    const room = makeRoom({ blocked: true });
    expect(checkAvailability(room, 700, 760, 540).available).toBe(false);
  });

  it('uses the custom blocked reason', () => {
    const room = makeRoom({
      blocked: true,
      blockedReason: 'Maintenance',
    });
    expect(checkAvailability(room, 700, 760, 540).reasons).toContain('Maintenance');
  });

  it('rejects an overlapping booking', () => {
    expect(checkAvailability(makeRoom(), 650, 700, 540).available).toBe(false);
  });

  it('allows an interval ending when an existing booking starts', () => {
    expect(
      checkAvailability(makeRoom(), 540, 600, 500).available
    ).toBe(true);
  });

  it('allows an interval starting when an existing booking ends', () => {
    expect(
      checkAvailability(makeRoom(), 660, 720, 540).available
    ).toBe(true);
  });

  it('does not modify the original bookings', () => {
    const room = makeRoom();
    const original = structuredClone(room.bookings);

    checkAvailability(room, 650, 700, 540);

    expect(room.bookings).toEqual(original);
  });

  it('returns no reasons for an available interval', () => {
    const result = checkAvailability(makeRoom(), 700, 760, 540);
    expect(result.reasons).toEqual([]);
  });

  it('reports multiple overlapping bookings', () => {
    const room = makeRoom({
      bookings: [
        { start: 600, end: 660, purpose: 'Class A' },
        { start: 680, end: 740, purpose: 'Class B' },
      ],
    });

    const result = checkAvailability(room, 650, 700, 540);
    expect(result.available).toBe(false);
    expect(result.reasons.some((reason) => reason.includes('bookings'))).toBe(true);
  });
});
