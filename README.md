# Smart Campus Room Checker

React + TypeScript + Vite + Tailwind. Checks whether a room is available for a time
interval. Fictional data only; nothing is saved.

## Setup
```bash
npm install
npm install -D jsdom @testing-library/react   # needed once for the UI test
```

## Run
```bash
npm run dev
```

## Test
```bash
npm test                                  # vitest run
npx vitest run --reporter=verbose         # per-test results
npm run typecheck
```

## Structure
```
src/
  domain/
    constants.ts     MAX_BOOKING_MINUTES, MINUTES_IN_DAY
    time.ts          minutesToTime, timeToMinutes, formatDuration
    availability.ts  checkAvailability (AC1-AC5, F3) + small helpers
    filters.ts       filterRooms (F1, F2), getEquipmentOptions, parseAttendees
    *.test.ts        regression (AC1-AC5) + filter tests (F1-F5)
  data/rooms.ts      fictional catalog (6 rooms)
  components/        RoomFilterPanel, RoomSelector, TimeField, Timeline, ResultPanel
  App.tsx            state + composition
  App.test.tsx       UI integration tests (jsdom)
```

## Versions
`git tag v0-initial` = original, `git tag v1-final` = final.
