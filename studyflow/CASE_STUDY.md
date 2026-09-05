# StudyFlow — UI/UX Case Study

**A student productivity app that turns a large academic workload into clear, manageable actions.**

*Role: UI/UX design & front-end build (solo project) · Tools: React, Tailwind CSS, Figma-equivalent design tokens · Platform: Responsive web (desktop, tablet, mobile)*

---

## 1. Problem

University students juggle courses, assignments, deadlines, and study time across multiple disconnected tools — a calendar app, a notes app, a to-do list, maybe a spreadsheet. Information is scattered, so it's easy to forget a deadline or sit down to study without a clear plan.

**Design assumption:** the pain points below are reasonable, commonly-cited student frustrations used to guide this project. No interviews, surveys, or usability tests were conducted for this version — these are informed assumptions, not research findings.

Assumed pain points:
- Too many deadlines across too many courses
- Forgetting assignments because information lives in different places
- Studying without a clear plan for *what* to study
- Feeling generally overwhelmed by the volume of open tasks

## 2. Goal

Design and build a simple tool that answers one question, fast:

> **"What should I focus on right now?"**

## 3. User persona

**Sara, 21 — Computer Science student**

- **Goals:** stay organized, never miss a deadline, plan study sessions, monitor academic progress, build consistent study habits
- **Pain points:** too many deadlines, scattered information, procrastination, academic stress
- **Needs:** clear priorities, simple planning, visible progress feedback

*(Design assumption — persona built from common student-productivity patterns, not a real interviewed user.)*

## 4. Solution

StudyFlow combines four things into one focused flow:

**Tasks + Courses + Study Sessions + Progress**

- **Tasks** carry the deadline pressure — due dates, priority, and a checkbox that's satisfying to tap.
- **Courses** give tasks context and show progress rolling up automatically per class.
- **Study Sessions** turn "I should study" into a 25-minute committed action with a visible timer.
- **Progress** closes the loop — a weekly chart and streak that reward the habit, not just the to-do list.

## 5. User flow

**Primary flow — from opening the app to a completed study session:**

```
Onboarding → Dashboard → Today's Tasks → Task Details
  → Start Study Session → Pomodoro Timer → Session Complete
  → Progress Updated
```

**Secondary flow — capturing a new task:**

```
Dashboard → "+" → Add Task → Select Course → Set Due Date
  → Set Priority → Save → Task Appears on Dashboard
```

Both flows are short on purpose: adding a task is one screen and one button; starting a session is one tap from the dashboard.

## 6. Wireframes → final UI

Low-fidelity structure for each core screen, and how the final UI resolved it:

**Onboarding** — Wireframe: centered icon, headline, subtitle, dot indicators, single CTA. → Final: kept exactly this structure; the only additions were a subtle icon-tint background per slide and a skip control for returning users.

**Dashboard** — Wireframe: greeting bar, one large "today" block, a task list, a smaller secondary column. → Final: two-column layout at desktop (task list + progress on the left, quick actions on the right); single column, stacked in the same priority order, on mobile.

**Courses** — Wireframe: grid of equal-weight cards, each with a name and a bar. → Final: same grid, with a colored initial-avatar per course so the list is scannable at a glance rather than reading every label.

**Course Details** — Wireframe: header, two stat blocks side by side, two stacked lists below. → Final unchanged; this screen didn't need much iteration since the content was already naturally hierarchical.

**Tasks** — Wireframe: tab row, search bar, flat list. → Final: added grouped section headers (Overdue/Today/Tomorrow/This Week/Later) once it became clear a flat list of 8+ tasks was hard to scan — grouping by time horizon did more work than color or priority alone.

**Add Task** — Wireframe: stacked form fields, single save button. → Final: replaced a plain numeric input for estimated time with a minus/value/plus stepper, since it's faster to tap than to type on mobile.

**Task Details** — Wireframe: title block, meta grid, two stacked actions. → Final unchanged, with a completed-state banner added at the top when relevant.

**Study Session** — Wireframe: big timer, four controls in a row. → Final: split into three distinct states (setup, running, complete) instead of cramming a duration-picker onto the same screen as the running timer — that felt cluttered in early passes.

**Progress** — Wireframe: one hero stat, one chart, two supporting cards. → Final unchanged; this maps closely to how analytics dashboards are typically read (headline number first, then supporting detail).

## 7. Design system

**Color**

| Token | Hex | Use |
|---|---|---|
| Primary | `#635BFF` | Primary buttons, active nav, progress, selected states |
| Background | `#F7F7FB` | App background |
| White | `#FFFFFF` | Cards, surfaces |
| Ink (primary text) | `#171725` | Headings, body text |
| Ink soft (secondary text) | `#73738A` | Metadata, captions |
| Success | `#22C55E` | Completed states |
| Warning | `#F59E0B` | Medium priority, caution |
| Error | `#EF4444` | Overdue, destructive actions |
| Border | `#E8E8F0` | Card borders, dividers |

Status colors are used sparingly and always paired with a text label (see Accessibility) so the app never depends on color alone.

**Typography**

Inter for all UI text; Fraunces (a serif) reserved for a small number of "hero" numbers — the onboarding headline and the big weekly-hours figure on Progress — as the one deliberate typographic accent in an otherwise clean sans-serif interface.

| Role | Size / weight |
|---|---|
| Page heading | 26–28px, bold |
| Section heading | 18–20px, semibold |
| Card title | 15–16px, semibold |
| Body | 14–15px, regular |
| Metadata | 12–13px, regular |

**Spacing scale:** 4 · 8 · 12 · 16 · 24 · 32 · 48 (px)

**Components:** Button, IconButton, Card, Badge, PriorityBadge, ProgressBar, ProgressCircle, Input, Select, Textarea, Avatar, SegmentedTabs, Modal, Toast, EmptyState, TaskCard, CourseCard — all built once in a shared `components/ui` layer and reused across every screen (see README for file structure).

**Navigation:** left sidebar at desktop widths (≥768px); bottom tab bar with a raised center "+" action at mobile widths.

## 8. Accessibility

- Semantic HTML (`<button>` for actions, `<label>` for every form field, ordered lists for the deadline timeline)
- Visible focus rings on every interactive element (`:focus-visible`, not just `:focus`, to avoid a ring on mouse clicks)
- Status is always paired with text, never color alone ("Overdue · Sep 3", not just a red dot)
- Minimum 44×44px touch targets on all buttons, checkboxes, and nav items
- `aria-label`s on icon-only buttons; `role="progressbar"` with `aria-valuenow` on progress bars
- Color pairs (ink on background, white on primary, etc.) meet WCAG AA contrast at body-text sizes
- Respects `prefers-reduced-motion` — animations collapse to near-instant for users who've requested reduced motion

## 9. Responsive design

| Breakpoint | Layout |
|---|---|
| Desktop (~1440px) | Persistent left sidebar, two-column dashboard, multi-column course/task grids |
| Tablet (~768–1024px) | Sidebar remains, grids collapse to 1–2 columns |
| Mobile (~390px) | Sidebar replaced by a bottom tab bar with a raised center "+", single-column layouts throughout, no horizontal scrolling |

Layouts *restructure* rather than just shrink: for example, the dashboard's "quick study" and "upcoming deadlines" cards sit in a right-hand column at desktop but move below the task list — in the same priority order — on mobile, instead of being squeezed sideways.

## 10. Conclusion

StudyFlow's core bet is that most academic stress isn't a planning problem, it's a *visibility* problem — students usually know what they need to do, they just can't see it clearly in one place at the right moment. Every screen in this project is built around surfacing the next right action (today's tasks, the next deadline, a 25-minute session) rather than trying to be a comprehensive academic management system. That restraint — showing less, but showing it clearly — is the main design decision this project is built to demonstrate.
