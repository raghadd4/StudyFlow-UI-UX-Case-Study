# StudyFlow

**Study smarter. Stress less.**

StudyFlow is a student productivity web app that brings courses, assignments, deadlines, study sessions, and progress into one focused place. It's built as a UI/UX portfolio project — a real, working application, not a static mockup.

> Core UX idea: turn a large academic workload into clear, manageable actions. Every screen tries to answer one question: **what should I focus on right now?**

---

## Features

- **Dashboard** — today's progress, today's tasks, a one-tap "start a focus session" card, and upcoming deadlines
- **Courses** — progress per course, driven automatically by task completion
- **Course details** — progress, weekly study time, upcoming tasks, and recent sessions for that course
- **Tasks** — search, filter by course, sort by due date/priority/title, grouped into Overdue/Today/Tomorrow/This Week/Later/Completed
- **Add/Edit Task** — course, due date, priority, estimated study time (stepper), notes
- **Task details** — start a session for that task, edit, mark complete/incomplete, delete (with confirmation)
- **Study Session** — Pomodoro-style focus timer (15/25/45/60 min presets) with circular progress, pause/resume/reset/finish, and a completion screen that logs the session
- **Progress** — weekly study chart (Recharts), tasks-completed ratio, per-course performance bars, and a study streak
- **Profile / Settings** — stats summary, notification toggle, appearance/language rows
- **3-step onboarding** shown once, before first use
- Realistic seed data for 5 courses, 8 tasks, and 5 past study sessions
- Full **localStorage** persistence — refreshing the page keeps every change
- Responsive: sidebar navigation at desktop widths, bottom tab bar + floating add button on mobile
- Empty states, toasts, hover/focus states, and small, purposeful micro-interactions throughout

## Tech stack

- **React 18** + **Vite** — no backend, everything runs client-side
- **React Router v6** for navigation between the 10 pages
- **Tailwind CSS** for styling, using a small custom design-token layer (see `tailwind.config.js`)
- **lucide-react** for icons
- **Recharts** for the weekly study chart
- **localStorage** (via a small `useLocalStorage` hook) for persistence — no backend needed

## Install and run

Requires [Node.js](https://nodejs.org) 18+.

```bash
cd studyflow
npm install
npm run dev
```

Then open the local URL Vite prints (typically `http://localhost:5173`).

To create a production build:

```bash
npm run build
npm run preview
```

The app is fully static after building — `dist/` can be hosted anywhere (Vercel, Netlify, GitHub Pages, etc.), no server required.

### Resetting sample data

The app seeds realistic sample data the first time it runs. To reset everything back to that sample data, open your browser's dev tools → Application/Storage tab → clear localStorage keys prefixed `sf_` (or just clear site data) and refresh.

## Project structure

```
src/
  components/         # Reusable building blocks
    ui/index.jsx       # Button, IconButton, Card, Badge, ProgressBar, ProgressCircle,
                        # Input, Select, Textarea, Avatar, SegmentedTabs
    TaskCard.jsx
    CourseCard.jsx
    Modal.jsx
    ToastHost.jsx
    EmptyState.jsx
  layouts/
    AppLayout.jsx      # Sidebar (desktop) + bottom nav (mobile) shell
  pages/
    Onboarding.jsx
    Dashboard.jsx
    Courses.jsx
    CourseDetails.jsx
    Tasks.jsx
    TaskDetails.jsx
    AddEditTask.jsx
    StudySession.jsx
    Progress.jsx
    Profile.jsx
  context/
    AppContext.jsx     # All app state + actions (tasks, courses, sessions, toasts)
  data/
    seedData.js        # Realistic first-run sample data
  hooks/
    useLocalStorage.js
  utils/
    dateUtils.js        # Due-date labels, formatting
    derive.js           # Course progress, weekly totals, streaks — all computed, never stored
  App.jsx
  main.jsx
  index.css
```

**Design decision:** course progress, weekly study time, streaks, and task counts are never stored as separate fields — they're all *derived* from the raw `tasks` and `studySessions` arrays each render (see `utils/derive.js`). This keeps the data model small and guarantees the numbers can never drift out of sync with the underlying tasks.

## UX decisions

- **The dashboard leads with today, not everything.** Courses, all tasks, and full analytics live one tap away, but the first screen only shows what's due today, one quick way to start studying, and what's coming next — matching the brief's goal of "understand what matters within a few seconds."
- **Status is never color-only.** An overdue task reads "Overdue · Sep 3", not just a red dot — see `dueLabel()` in `utils/dateUtils.js`.
- **One system, reused everywhere.** Every card, badge, button and progress indicator draws from the same handful of primitives in `components/ui`, so the app reads as one product rather than a set of separately designed screens.
- **The add-task flow is a full page, not a cramped popover**, since it has six fields (name, course, date, priority, estimate, notes) — a modal that size would feel heavy on mobile.
- **The Pomodoro screen has three distinct states** (setup → running/paused → complete) rather than overloading one layout, so each moment (choosing a duration, staying focused, celebrating) gets its own clear affordance.
- **Motion is restrained and purposeful:** checkbox completion pops, toasts slide in, modals scale/slide up, progress bars animate their width — but nothing animates on page load just for show.

## What I'd still do in Figma / elsewhere

This is a fully coded, working prototype rather than a Figma file. If you want traditional design-portfolio artifacts alongside it:

1. **Static wireframe/UI screenshots** — run the app locally (or deploy it) and screenshot each of the 10 pages at desktop (1440px), tablet (~834px) and mobile (390px) widths for your case study images.
2. **A Figma file**, if your internship application specifically asks for Figma deliverables — you'd redraw the key screens (Dashboard, Tasks, Study Session, Progress) using the color/type tokens documented in `CASE_STUDY.md`.
3. **A short screen-recording / GIF** of the working prototype (add a task → complete it → start and finish a study session → watch Progress update) is the strongest single portfolio asset, since it proves the interactions actually work.
4. **Real user testing**, if you want to strengthen the case study further — this project intentionally does not claim any research was done (see the "Design assumptions" labeling in `CASE_STUDY.md`).

## Notes on scope

No backend, accounts, or real notifications are implemented — everything persists locally in the browser via `localStorage`, per the brief. This is appropriate for a portfolio piece; a production version would add an account system and server-side sync.
