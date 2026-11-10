import type { Room } from "@/types";

export const sampleRooms: Room[] = [
  {
    id: "eng-101",
    name: "Engineering Hall 101",
    building: "Building A",
    capacity: 40,
    equipment: ["Projector", "Whiteboard"],
    blocked: false,
    bookings: [
      { start: 480, end: 540, purpose: "Calculus I" },
      { start: 600, end: 660, purpose: "Physics Lab" },
      { start: 780, end: 840, purpose: "Office Hours" },
    ],
  },
  {
    id: "sci-204",
    name: "Science Block 204",
    building: "Building B",
    capacity: 25,
    equipment: ["Whiteboard", "Computers"],
    blocked: false,
    bookings: [
      { start: 540, end: 600, purpose: "Chemistry 201" },
      { start: 720, end: 780, purpose: "Study Group" },
    ],
  },
  {
    id: "lib-3",
    name: "Library Study Room 3",
    building: "Building C",
    capacity: 8,
    equipment: ["Whiteboard"],
    blocked: false,
    bookings: [{ start: 660, end: 720, purpose: "Book Club" }],
  },
  {
    id: "aud-a",
    name: "Auditorium A",
    building: "Building D",
    capacity: 200,
    equipment: ["Projector", "Microphone", "Video conferencing"],
    blocked: true,
    blockedReason: "Scheduled maintenance — unavailable today.",
    bookings: [{ start: 900, end: 1020, purpose: "Guest Lecture" }],
  },
  {
    id: "inno-lab",
    name: "Innovation Lab",
    building: "Building E",
    capacity: 30,
    equipment: ["Projector", "Computers", "Whiteboard"],
    blocked: false,
    bookings: [
      { start: 840, end: 900, purpose: "Robotics Workshop" },
      { start: 1140, end: 1200, purpose: "Project Demo" },
    ],
  },
  {
    id: "art-12",
    name: "Arts Studio 12",
    building: "Building F",
    capacity: 15,
    equipment: ["Easels"],
    blocked: false,
    bookings: [{ start: 960, end: 1020, purpose: "Painting Class" }],
  },
];
