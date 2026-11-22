# AGENTS.md

## Project Purpose & Architecture
This repository (`SMART-CAMPUS`, `vite-react-typescript-starter`) is a React, TypeScript, and Vite web application with domain logic and tests under `src/` (including `src/App.test.tsx`, `src/domain/domain.regression.test.ts`, and `src/domain/filters.test.ts`) and build output in `dist/`. Keep domain logic, UI components, and external integrations cleanly separated and strictly within assignment scope.

## Setup & Safe Commands
Install dependencies only when needed: `npm ci` or `npm install`.
Run typecheck: `npm run typecheck` (`tsc --noEmit -p tsconfig.app.json`).
Run linter: `npm run lint` (`eslint .`).
Run tests: `npx vitest run`.
Run production build: `npm run build` (`vite build`).
Run local dev or preview server: `npm run dev` or `npm run preview`.

## Coding Conventions & Test Expectations
Follow TypeScript types and existing ESLint rules. Keep edits minimal, focused, and easy to inspect in diffs. Add or update targeted tests when changing logic or fixing defects, and always re-run `npx vitest run`, `npm run typecheck`, `npm run lint`, and `npm run build` after changes, reporting actual results.

## Forbidden Actions
Do not commit, expose, print, or hardcode secrets, API keys, tokens, passwords, credentials, or real personal data.
Do not run production deployments or publish releases as part of agent tasks.
Do not run destructive commands (such as `rm -rf` on project paths, `git reset --hard`, or force-pushes) without explicit approval.
Do not add, remove, or modify dependencies in `package.json` or lockfiles unless explicitly requested and reviewed.

## Instruction Loading Note
If your AI tool or coding agent does not load `AGENTS.md` automatically, paste the relevant rules from this file explicitly into the prompt and disclose that manual loading was required.