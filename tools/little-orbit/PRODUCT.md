# Our Desk Clock — product guide

Our Desk Clock is a configurable browser display for desks, families, spare screens, and handhelds. It combines readable time, date, local weather, daily learning, and quiet character scenes. The source directory remains `tools/little-orbit/` for compatibility.

This is the product's planning hub. Designs are proposals until explicitly marked implemented; the portable clock and its tests describe shipped behavior. Current code is on the `add-little-orbit-clock` branch in [PR #1](https://github.com/ilamgumaran/simpli-home-tools/pull/1), pending merge. No versioned release has been published yet.

## Product principles

1. Read the clock at a glance. Time, date, weather, and facts must stay visible across device sizes and motion states.
2. Browser first. Keep the runtime independent of OS helpers, accounts, installed packages, and external fonts. Preserve the single-file offline path.
3. Quiet companionship. Characters entertain without dominating the display; motion respects reduced motion, hidden tabs, and low-power settings.
4. Care for long-running displays. Use dark backgrounds, configurable movement and breaks, with honest limits on what browsers can control.
5. Configurable defaults. Use viewport-based presets and feature detection. Shared configuration and browser overrides must be understandable and documented.
6. Open collaboration. Keep source, original artwork, decisions, tests, and useful design studies in Git under the Simpli Home Tools Noncommercial License 1.0, with commercial permission controlled by the project licensor. Avoid proprietary game assets and device-private data.

## Documentation map

| Document | Purpose |
| --- | --- |
| [README](README.md) | Run the clock and develop it |
| [Configuration](CONFIGURATION.md) | Defaults, device presets, display and character controls |
| [Roadmap](ROADMAP.md) | Prioritized milestones and completion criteria |
| [Changelog](CHANGELOG.md) | Implemented changes and release history |
| [Design index](design/README.md) | Proposals, design studies, and their status |
| [Architecture](design/ARCHITECTURE.md) | Current source map and intended separation as the product grows |
| [Decision log](design/DECISIONS.md) | Why lasting product choices were made |
| [Repository contribution guide](../../CONTRIBUTING.md) | Reporting issues and submitting work |

## Working rhythm

- Capture each new idea in `design/` with a status, constraints, intended behavior, and acceptance checks. Add it to the roadmap; do not present it as shipped.
- Commit useful plans and original previews as well as implementation. Use small commits with clear purpose and publish through a branch/PR. Keep the product documents current with the work.
- For implementation, include appropriate tests, configuration guidance, and a rebuilt portable file. For documentation-only work, check links and design-preview behavior; no device restart or generated runtime update is required.
- Record decisions when they affect future contributors. Update the changelog only for implemented product behavior or released artifacts; document planning changes separately.
- Use repository issues for bugs and scoped features. The roadmap is the shared priority source; an issue is not permission to deploy to someone else's device.
- The repository owner approves merges and releases. This documentation does not authorize implementing a deferred proposal or scheduling an automatic deployment.

## Release direction

Start with a clearly labeled preview release after PR #1 is reviewed and merged. Follow semantic versioning once releases begin. Tag source and attach a portable HTML/ZIP with its license, notices, configuration guide, and checksum. Preserve existing launch filenames or document a migration before changing them.

Time Climber II is implemented as the fourth theme on the development branch, with its original plan/preview retained in the design archive. It is authorized current work, not a deferred automatic task. New profiles select it by default; existing preferences are preserved.

For a stable release, verify hosted and portable forms on Chromium and Firefox across Windows, macOS, and Linux; smoke-test the Ally and document device/browser gaps. Accessibility, offline failure states, and long-running operation are release criteria, not optional polish. Physical Android/Vanadium testing remains a separate check.

Do not add a backend, accounts, analytics, paid assets, automatic updating, or hosting dependencies by default. Any such change needs an explicit product decision, a documented user benefit, and review.
