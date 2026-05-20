# VibeCraft

Local-first single-file app builder prototype built with React, TypeScript, Vite, Gemini, and Playwright.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run test:smoke
npm run check
```

`npm run test:smoke` starts its own Vite server through Playwright, so it can be run from a clean terminal.

## Current Notes

- Without a Gemini API key, the app runs in Demo Offline Mode and loads starter templates.
- With a key saved in Settings, generation uses Gemini and returns standalone HTML.
- Generated HTML is rendered inside a sandboxed iframe and can be copied or downloaded.
- Local artifacts such as `dist/`, `test-results/`, Playwright reports, `.env` files, and verification screenshots are ignored by Git.
