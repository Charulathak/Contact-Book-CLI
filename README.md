# Contact Book (React)

A CRUD contact manager built with React, as a hands-on project for learning core React patterns — component state, controlled forms, derived/computed data, and conditional rendering — without a backend or database.

**[Live Demo](https://contact-book-cli-git-main-charu21.vercel.app/)**

## Features

- **Create** new contacts with name, phone, email, and notes
- **Read** — browse contacts grouped alphabetically, with a jump-to-letter sidebar (like a rolodex)
- **Update** existing contacts in place
- **Delete** contacts, with a confirmation step before removal
- **Search** contacts live by name
- Empty and no-results states handled explicitly

## What I learned

This was a practice project for solidifying React fundamentals. Along the way I worked through:

- Managing multiple pieces of related state (`contacts`, `selectedId`, `mode`, `draft`) and keeping them in sync
- Deriving computed values with `useMemo` (filtering + grouping contacts by letter) instead of storing redundant state
- Controlled form inputs and a shared edit/create form driven by a single `mode` state
- Debugging real errors as they came up — including a `DOMException` caused by rendering an invalid `<body>` element inside JSX, and CSS specificity issues where inline styles were overriding hover states
- Setting up a local dev environment from scratch: Vite, npm, and troubleshooting Windows-specific issues (PowerShell execution policy blocking `npm.ps1`)

## Tech stack

- React (Vite)
- [lucide-react](https://lucide.dev/) for icons
- Plain CSS (no framework)

## Running locally

```bash
git clone https://github.com/your-username/contact-book-react.git
cd contact-book-react
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Possible next steps

- Persist contacts to `localStorage` so data survives a refresh
- Connect to a backend API (Flask/Express) for real persistence across devices
- Add form validation feedback for phone/email fields
- Add sorting/filtering options beyond alphabetical

## Notes

Built as a learning exercise to practice CRUD patterns and React state management from the ground up.
