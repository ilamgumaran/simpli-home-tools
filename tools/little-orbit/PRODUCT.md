# Our Desk Clock — product guide

Our Desk Clock is a configurable browser display for desks, families, spare screens, and handhelds. It combines readable time, date, local weather, daily learning, and quiet character scenes. The source directory remains `tools/little-orbit/` for compatibility.

This is the product's planning hub. Designs are proposals until explicitly marked implemented. The latest five-theme implementation is on `feature/living-woodland-time` in [PR #3](https://github.com/ilamgumaran/simpli-home-tools/pull/3), stacked on the shared-character and original-clock PRs. No versioned release has been published yet. [Local installation and verification results](../../sessions/2026-10-05-woodland-ally/002-ally-to-cloud.md) distinguish passed browser checks from pending physical-device checks.

## Product principles

The next character branch, `feature/woodland-walking-grips`, adds [planted survey walking and grounded tool grips](design/WALKING-AND-GRIPS.md). [Session outcome](../../sessions/2026-10-05-woodland-ally/004-walking-grips.md) records verification, deployment and remaining physical acceptance.

The character follow-up on `feature/woodland-character-contacts` adds [planted rock contacts](design/CHARACTER-CONTACTS.md) to the Woodland slice. [Progress and outcomes](../../sessions/2026-10-05-woodland-ally/003-character-contacts.md) distinguish implementation/browser checks from pending live-device acceptance.

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
| [Immersive Woodland](design/IMMERSIVE-WOODLAND.md) | Fullscreen camp scene, material/time choreography, movement and acceptance targets |
| [Owner prompts and session handoff](design/OWNER-PROMPTS.md) | Original product direction and where a new session should resume |
| [Ally installation handoff](design/ALLY-TEST-HANDOFF.md) | Published build revision, checksum, installation and physical-device checks |
| [Session communication](../../sessions/README.md) | Numbered handoffs and replies between development and device-testing sessions |
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

## Shared character foundation

The first character layer centralizes Pip, Moss, Ridge and Sprout in `characters.js`, independent of themes. Appearance, anatomical poses and role kits can evolve separately. The climbing themes use a shared harness/rope attachment and a stylized effort/recovery model; safety equipment is continuous and optional ascender assistance is reserved for a late deadline. The [character workshop](design/character-study.html) demonstrates appearance and role selection, with a catalog for climbing, trail, backpacking, food, bushcraft, farming and hunting equipment. See [scope and deferred physics](design/CHARACTERS.md); Woodland now illustrates cooking and foraging; farming, hunting, resource conservation and world-space contact simulation remain future layers.

Woodland of Time is implemented as the fifth theme on the living-world branch. Reusable landscape, action, story, philosophy and recipe definitions compose centrally defined characters into one woodland scene. All current time digits stay readable while hourly places, minute vignettes and six daily social episodes vary. The [living-world plan](design/LIVING-WORLDS.md) records the larger direction and specialist plans; five later worlds remain proposed. Complete contact physics, conserved resources and persistent family generations remain future work.

Woodland now fills the available scene panel, with proportion-preserving trees, time digits and larger characters, smoother shared anatomical poses, detailed timber and curved mountain layers. [Organic motion](design/ORGANIC-MOTION.md) adds body-paced travel, planted steps, supported weight shifts and continuous contact-rig transitions. Low-power motion renders at 30 fps and normal motion follows browser frames. Work starts after arrival; repeated visits include a protected return for climbing. Bouts end before the next visit or second 55, preserving recovery and a quiet minute ending. Companion-off, reduced motion, hidden tabs, open settings and screen rest suppress those moving frames. This visual pass does not complete terrain-contact or rope-force simulation; browser and device review remain separate evidence.

Woodland refinement preserves shelter/crossing grips and reciprocal teaching from the other session; see [implemented scope and next milestones](design/REFINEMENT-AND-WORK.md). Physical acceptance remains pending.

The [immersive Woodland scene](design/IMMERSIVE-WOODLAND.md) is implemented with fullscreen SVG art and a larger shared cast. Woodland defaults to Immersive, with Dashboard available through `display.woodlandView`; new profiles still default to Time Climber II. Complete current HH:MM paths use timber/stone hours and flowing minute material, alongside a DD day plaque. Twelve camp activities, supervised family shallows and construction sampled from the advancing chapter connect work to time. Slow wind, clouds, water, lighting and camera/HUD movement respect reduced motion; climbing begins after arrival and includes supported recovery and protected descent. Current compact Chrome measurements near 30/60 fps support retaining browser SVG. Full browser suites and physical acceptance remain pending; persistent construction/resources and full dynamics remain deferred.
