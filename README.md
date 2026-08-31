# My Learning Hub

An offline-first practice app for school classes 6–10. Questions live in a Google Sheet, are served by a Google Apps Script Web App, and are cached in the browser so practice works without a live connection.

## Features

- **Classes 6–10** across English, Mathematics, Science, GK and Sports
- **Practice modes**: random practice, topic practice, and mock tests
- **Offline-first**: questions and topics are cached in IndexedDB on first load; later visits read from cache
- **Manual sync**: a Sync Data button refreshes the cache from the server on demand
- **Session tracking**: every session is stored locally with per-question answers
- **Review**: revisit any past session and see each question colour-coded correct/incorrect
- **Configurable**: set the number of questions per practice mode from the Settings page
- **Math rendering**: KaTeX support for mathematical notation

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Routing | React Router v6 (hash-based) |
| Local storage | IndexedDB |
| Backend | Google Apps Script Web App |
| Database | Google Sheets |
| Hosting | GitHub Pages |

## Getting started

Requires Node.js 18 or newer.

```powershell
npm install
Copy-Item src/config.example.ts src/config.ts
```

Edit `src/config.ts` and set `API_BASE_URL` to your deployed Apps Script Web App URL. See [apps-script/README.md](apps-script/README.md) to deploy the backend, or skip this step to run against the bundled mock data.

```powershell
npm run dev
```

The app runs at http://localhost:3000.

### Other commands

```powershell
npm run build     # type-check and build to dist/
npm run preview   # serve the production build locally
npm run lint      # run ESLint
```

## Project structure

```
src/
├── components/     Header, SyncButton, MathText, DataSourceBanner
├── pages/          ClassSelection, Dashboard, Practice, Results, History, Settings
├── services/       api.ts (HTTP), localStorage.ts (IndexedDB), dataService.ts (cache layer)
├── config/         appConfig.ts (defaults and subject list)
├── data/           mockData.ts (offline fallback)
├── types/          shared TypeScript types
└── utils/          option shuffling
apps-script/        Google Apps Script backend
docs/               schema, authoring and troubleshooting guides
```

Data access flows through `dataService.ts`, which reads from IndexedDB first and falls back to the API, then to mock data.

## Configuration

`src/config.ts` holds the backend URL and is intentionally gitignored, since it differs per deployment. `src/config.example.ts` is the template.

Practice defaults (question counts, subject list, cache duration) live in [src/config/appConfig.ts](src/config/appConfig.ts). Question counts can also be changed at runtime from the in-app Settings page, which persists to `localStorage`.

## Deployment

The app deploys to GitHub Pages via [.github/workflows/deploy.yml](.github/workflows/deploy.yml) on every push to `main`.

One-time setup:

1. **Settings → Secrets and variables → Actions** → add a secret named `API_BASE_URL` containing your Apps Script Web App URL. The workflow generates `src/config.ts` from it at build time.
2. **Settings → Pages → Source** → select **GitHub Actions**.

The site is published at `https://<username>.github.io/<repo>/`.

> The backend URL is compiled into the public JavaScript bundle, so it is visible to anyone using the site. The `API_BASE_URL` secret keeps it out of git history but is not a security boundary — make sure the Apps Script endpoint is safe to expose publicly.

Routing uses `HashRouter` because GitHub Pages serves static files only and cannot rewrite deep links to `index.html`.

## Documentation

- [Backend deployment](apps-script/README.md)
- [Google Sheets schema](docs/sheets-schema.md)
- [Sample data](docs/sample-data.md)
- [Writing questions](docs/authoring-questions.md)
- [Troubleshooting](docs/troubleshooting.md)
