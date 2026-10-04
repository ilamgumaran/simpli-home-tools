# Repository work

Tools live in independent directories under `tools/`. Little Orbit's canonical source is `tools/little-orbit/`; maintain its configuration, documentation, and tests together.

Preserve GPLv3 licensing and attribution. Keep the browser app independent of operating-system helpers. Never commit local browser profiles, power-plan state, credentials, screenshots from private sessions, or installed dependencies.

For clock changes, run `npm run build` and `npm test` in `tools/little-orbit/`. Commit the regenerated `Little Orbit.html` with source changes. Tests use Playwright's Chromium and Firefox, mock weather, and must work without real weather access. New themes go in the theme registry in `app.js`; retain Orbit and Candy Quest and their readable layout.

Use feature detection instead of OS/browser user-agent checks. Use browser viewport pixels (which already include OS scaling). Keep site defaults in `config.js` and browser-specific overrides in Settings. Document added settings and test both the hosted and single-file forms.

Publish updates as a branch and pull request unless the human explicitly requests another workflow. Do not merge or change repository policy without authorization. Future work on the clock should update this directory and its portable build, rather than creating a separate competing copy.

The owner asks that plans, designs, and product work stay saved in Git as this becomes a full product. Maintain `tools/little-orbit/PRODUCT.md`, `ROADMAP.md`, `CHANGELOG.md`, and the `design/` archive with meaningful changes. Mark proposals and deferred implementation clearly. Keep original shareable previews with their license; exclude private device data. Documentation-only changes require link/preview checks, not a runtime rebuild or device restart. Do not start a deferred implementation merely because its plan is committed.
