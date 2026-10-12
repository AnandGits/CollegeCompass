# CollegeInfo — React Design Playbook

This is the design system for the React frontend (`/frontend`). Every new page should
be built from these tokens and components, not one-off styles. It replaces the ad-hoc
CSS in the old `theme.py` (Streamlit) with a proper token system in `src/index.css`
(Tailwind v4 `@theme`) and reusable components in `src/components/`.

## Concept

The subject is the college application journey — deadlines, decisions, and the moment
an acceptance letter arrives. The system leans into that instead of reading as a
generic SaaS dashboard:

- **Serif display type (Fraunces)** for headlines — gives pages the weight of a formal
  letter, not a web app.
- **Mono type (IBM Plex Mono)** for dates, percentages, and countdowns — a
  ticket-stub / boarding-pass numeral treatment for anything time- or number-based.
- **The Seal** — a circular progress ring (`src/components/Seal.tsx`) instead of a flat
  progress bar. It's the one signature element; reuse it anywhere progress is shown
  (profile completion, application completion, essay progress). Don't invent a second
  progress visual — the Seal is the app's one recognizable mark.
- **Marigold accent** used *only* for the primary action on a page — it should always
  mean "the one thing to do here." Don't use it for decoration or multiple buttons at once.

## Tokens (`src/index.css`)

Defined via Tailwind v4 `@theme`, so every token below is also a Tailwind utility
(e.g. `--color-brand` → `bg-brand`, `text-brand`, `border-brand`).

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-paper` | `#FAF8F4` | `#12161F` | page background |
| `--color-surface` | `#FFFFFF` | `#1A2030` | cards, inputs |
| `--color-border` | `#E7E2D8` | `#2A3143` | hairlines |
| `--color-ink` | `#16213E` | `#EDEEF4` | primary text |
| `--color-ink-soft` | `#4B5773` | `#9AA3BD` | secondary text |
| `--color-brand` | `#2B4C8C` | same | nav active state, links, secondary emphasis |
| `--color-brand-tint` | `#E9EEFA` | `#1D2740` | hover backgrounds, subtle fills |
| `--color-accent` | `#E8863C` | same | **primary CTA only** |
| `--color-accent-tint` | `#FDF0E2` | `#33251A` | highlight backgrounds (e.g. "due this week") |
| `--color-success` / `-tint` | `#2F7A4F` | — | completed / on-track states |
| `--color-danger` / `-tint` | `#B4432D` | — | overdue / errors |

Dark mode responds to `prefers-color-scheme` automatically, or can be forced with
`data-theme="dark"` / `"light"` on `<html>`.

**Type scale:** `font-display` (Fraunces) for all `h1`/`h2`-level headings only.
Everything else — labels, body copy, buttons, nav — is `font-sans` (Inter). Numbers
that represent dates, counts, or percentages use `font-mono`.

## Components (`src/components/`)

- **`Card` / `CardLabel`** — the standard bordered container. `CardLabel` is the small
  uppercase eyebrow inside a card (e.g. "UPCOMING DEADLINES"). Always use `Card` instead
  of raw `div`s with borders — keeps radius/shadow/padding consistent.
- **`Seal`** — circular progress. Takes `pct` and a `label`. This is the only progress
  indicator in the system.
- **`Badge`** — urgency/status pill (Overdue, Due today, Due this week, Upcoming, No
  date). Extend `URGENCY_STYLE` in `Badge.tsx` if a page needs a new status vocabulary
  (e.g. application stages) rather than inventing a new badge component.
- **`Button`** — `variant="primary"` (marigold) for the one primary action per view;
  default/`secondary` (outlined) for everything else.
- **`ChecklistRow`** — onboarding/task rows with a filled-dot done state.
- **`AppShell`** — the persistent sidebar + nav. Add new pages to `src/lib/nav.ts` and
  they automatically appear in the right nav group.
- **`RequireIdentity`** — the email-gate wrapper. Wrap any page that needs
  `email` (mirrors `nav.require_identity()` in the old Streamlit app) — see
  `Dashboard.tsx` for the pattern.

## Adding a new page (migration checklist)

1. Add a route + nav entry in `src/lib/nav.ts` (it auto-renders in the sidebar).
2. Add the FastAPI endpoint in `backend/main.py`, reusing the existing `db_profile.py` /
   `db_apptrack.py` functions — don't reimplement Mongo queries in Python or JS.
3. Add a typed fetch function + response type in `src/lib/api.ts`.
4. Build the page in `src/pages/`, wrapping in `RequireIdentity` if it's
   per-student data.
5. Compose from `Card`, `Seal`, `Badge`, `Button`, `ChecklistRow` — only add a new
   component if none of these fit, and add it to this playbook when you do.
6. Replace its `ComingSoon` route in `App.tsx` with the real page.

## What's migrated so far

All pages are migrated: Home, Dashboard, My Profile, Applications, My Colleges,
Essay Tracker, Deadlines, Tasks, AI Advisor, College Recommendations, Majors &
Careers, College Wiki, Holland Code Assessment, FAQ, College Search, Admissions
Blog, About. The Streamlit app (`app.py` and `*_page.py` at the repo root) is
no longer wired into the React frontend but is left in place as a reference
and fallback until it's decommissioned.

Known simplifications vs. the original Streamlit pages (intentional, to keep
scope reasonable — revisit if the product needs them):

- **My Profile** is a single scrollable form instead of the original 6-step
  wizard. All the same fields are covered.
- **Applications** and **Essay Tracker** use a flat list with an expandable
  checklist instead of the Streamlit kanban board. Stage/status still change
  via a dropdown.
- **AI Advisor** sends one request per turn and shows the full reply at once,
  rather than streaming tokens.
