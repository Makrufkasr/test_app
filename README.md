# English Writing Lab 3.2 — Writing Library Edition

## What's included
- 321 curated vocabulary cards across 9 everyday and workplace contexts.
- 105 authored Normal → Natural → Professional sentence ladders across 7 themes.
- Writing-first lesson flow, AI coach backend configuration (backend not included/deployed), offline basic checks.
- Saved vocabulary and sentence examples, search, categories, listening, and Writing Studio handoff.
- All content bundled locally in library.js for offline reading; pronunciation depends on installed Android voice engine.

## Web
Serve this directory using `python -m http.server 8000` and open http://localhost:8000.

## Android
The Android project contains the same updated web assets and launcher icon. Build with GitHub Actions or Android Studio. **No APK is included.**

## AI
AI correction needs your separately deployed HTTPS backend and API provider; the browser/APK must never contain provider secrets. Offline review is heuristic and not a replacement for AI correction.

## Quality
Library entries authored for real situations; Normal → Pro examples are **contextual alternatives**, not automatically interchangeable claims. Some examples add facts intentionally to show specificity: do not repeat those claims unless true.

Android project root: place this folder contents at your GitHub repository root and commit/push.
