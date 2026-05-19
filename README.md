# Talent IQ

Talent IQ is a full-stack collaborative coding interview platform where two users can join a live session, solve coding problems together, run code in multiple languages, and communicate through real-time video + chat.

## What This Project Does

- User authentication and user lifecycle management with Clerk.
- Real-time pair-programming sessions (host + participant).
- Session-scoped video calling and chat using Stream.
- In-browser coding editor (Monaco) with JavaScript, Python, and Java support.
- Code execution via the Piston API.
- Curated coding problem library with difficulty and constraints.
- Dashboard for active sessions and past session history.

## Tech Stack

### Frontend

- React 19 + Vite
- React Router
- TanStack Query (data fetching and cache)
- Tailwind CSS v4 + DaisyUI
- Monaco Editor
- Stream Video React SDK + Stream Chat React
- Clerk React SDK
- Axios
- Lucide icons + react-hot-toast

### Backend

- Node.js + Express 5
- MongoDB + Mongoose
- Clerk Express middleware
- Inngest (event-driven user sync)
- Stream Node SDK + Stream Chat SDK
- CORS + dotenv

## Monorepo Structure

```text
TALENT-IQ/
  backend/
    src/
      controllers/
      lib/
      middleware/
      models/
      routes/
      server.js
    package.json
  frontend/
    src/
      api/
      components/
      data/
      hooks/
      lib/
      pages/
      App.jsx
      main.jsx
    index.html
    package.json
  README.md
```

## Core Product Flows

### 1) Authentication + User Sync

1. User signs in through Clerk on the frontend.
2. Clerk sends events (`clerk/user.created`, `clerk/user.deleted`).
3. Inngest functions process these events in the backend.
4. MongoDB user records are created/deleted.
5. Stream user records are upserted/deleted in sync.

### 2) Session Creation

1. Host opens dashboard and creates a session from a selected problem.
2. Backend creates a `Session` document in MongoDB.
3. Backend creates:
   - a Stream video call (`callId`)
   - a Stream messaging channel (same `callId`)
4. Host is redirected to `/session/:id`.

### 3) Session Join

1. Participant opens the session URL.
2. Backend validates:
   - session exists
   - session is still active
   - participant slot is available
3. Participant is added to the session and Stream chat channel.
4. Frontend initializes Stream video + chat clients and joins call/channel.

### 4) End Session

1. Only host can end the session.
2. Backend deletes Stream call/channel resources.
3. Session status updates from `active` to `completed`.
4. Users are redirected back to dashboard flow.

## Frontend App Routes

- `/` -> Landing page (`HomePage`)
- `/dashboard` -> Session overview + creation (`DashboardPage`)
- `/problems` -> Problem listing (`ProblemsPage`)
- `/problem/:id` -> Solo practice IDE (`ProblemPage`)
- `/session/:id` -> Live collaborative session (`SessionPage`)

All private pages are gated by Clerk sign-in status.

## Backend API Endpoints

Base URL in development: `http://localhost:3000/api`

### Health

- `GET /health` -> API health message
- `GET /` -> basic uptime message

### Inngest

- `POST /api/inngest` (served via Inngest Express handler)

### Chat

- `GET /api/chat/token` (protected)
  - Returns Stream auth token and user metadata:
    - `token`
    - `userId`
    - `userName`
    - `userImage`

### Sessions

- `POST /api/sessions` (protected) -> create session
- `GET /api/sessions/active` (protected) -> list active sessions
- `GET /api/sessions/my-recent` (protected) -> list current user's recent completed sessions
- `GET /api/sessions/:id` (protected) -> session detail
- `POST /api/sessions/:id/join` (protected) -> join as participant
- `POST /api/sessions/:id/end` (protected) -> end session (host only)

## Data Models

### User

- `name` (required)
- `email` (required, unique)
- `profileImage` (optional/default empty)
- `clerkId` (required, unique)
- `timestamps`

### Session

- `problem` (required)
- `difficulty` (`easy | medium | hard`)
- `host` (required ref -> `User`)
- `participant` (optional ref -> `User`)
- `status` (`active | completed`, default `active`)
- `callId` (Stream call/channel key)
- `timestamps`

## Environment Variables

Create env files manually (none are committed).

### Backend (`backend/.env`)

```env
PORT=3000
DB_URL=<mongodb-connection-string>
NODE_ENV=development
CLIENT_URL=http://localhost:5173

INNGEST_EVENT_KEY=<inngest-event-key>
INNGEST_SIGNING_KEY=<inngest-signing-key>

STREAM_API_KEY=<stream-api-key>
STREAM_API_SECRET=<stream-api-secret>
```

### Frontend (`frontend/.env`)

```env
VITE_CLERK_PUBLISHABLE_KEY=<clerk-publishable-key>
VITE_STREAM_API_KEY=<stream-api-key>
```

## Local Development Setup

### Prerequisites

- Node.js (LTS recommended)
- npm
- MongoDB database (local or cloud)
- Clerk application + keys
- Stream account + API credentials
- Inngest credentials

### Install Dependencies

From project root:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### Run the App

Use two terminals:

```bash
# Terminal 1
cd backend
npm run dev
```

```bash
# Terminal 2
cd frontend
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## Frontend Module Guide

- `src/pages/` -> route-level pages.
- `src/components/` -> reusable UI blocks:
  - session listing and cards
  - coding IDE pieces (`CodeEditorPanel`, `OutputPanel`)
  - video/chat container (`VideoCallUI`)
- `src/hooks/` -> data and stream initialization hooks.
- `src/api/sessions.js` -> session API client wrappers.
- `src/lib/piston.js` -> code execution service integration.
- `src/data/problems.js` -> built-in problems, starter code, expected outputs.

## Backend Module Guide

- `src/server.js` -> app bootstrap, middleware, route registration.
- `src/lib/env.js` -> environment variable loading.
- `src/lib/db.js` -> MongoDB connection helper.
- `src/lib/stream.js` -> Stream client initialization and helpers.
- `src/lib/inngest.js` -> Inngest client and Clerk event functions.
- `src/middleware/protectRoute.js` -> Clerk auth + DB user attachment.
- `src/controllers/` -> endpoint business logic.
- `src/routes/` -> route definitions.
- `src/models/` -> Mongoose schemas.

## Problem Engine Notes

- Current built-in problem set includes 5 interview problems.
- Supported coding languages:
  - JavaScript
  - Python
  - Java
- Execution happens through `https://emkc.org/api/v2/piston`.
- Output is normalized in solo practice mode for test verification.

## UI/UX Highlights

- Resizable split-pane layout for problem/editor/output.
- Session page includes:
  - problem details
  - code editor + output
  - video call
  - real-time chat side panel
- Toast feedback for session and execution actions.
- Confetti celebration when tests pass in practice mode.

## NPM Scripts

### Backend

- `npm run dev` -> run backend with nodemon

### Frontend

- `npm run dev` -> start Vite dev server
- `npm run build` -> production build
- `npm run lint` -> ESLint check
- `npm run preview` -> preview production build locally

## Known Gaps / Improvement Opportunities

- No backend test suite yet.
- No frontend automated tests yet.
- Axios base URL is currently hardcoded for localhost.
- No Docker/devcontainer setup in repository.
- No committed env example files (`.env.example`) yet.

## Production Readiness Checklist (Recommended)

- Add `.env.example` for frontend and backend.
- Move API base URL to `VITE_API_URL`.
- Add request validation (e.g., Zod/Joi) on backend inputs.
- Add error monitoring and structured logs.
- Add unit/integration tests for controllers and hooks.
- Add CI pipeline (lint, test, build).
- Add deploy guides (frontend + backend + DB + webhook/event configuration).


No license file is currently present. Add a `LICENSE` file if you plan to open source or distribute this project.

