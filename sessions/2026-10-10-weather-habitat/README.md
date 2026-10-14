# Green House 1 — weather-responsive habitat

Status: prior candidate passed scoped functional checks but failed motion acceptance in Chrome, Edge and Firefox. Intermediate candidate `7c11d81` passed focused Firefox immersive-motion cadence, but weather cadence failed at portable 1280×720 DPR2 low power (29.03 updates/s, p95 61 ms, max 71 ms); full Chrome/Edge suites were not run on it. Current fine-snap-plus-crop candidate `9b0d6003` (portable SHA-256 `5c7fc828…`) is frozen; its Firefox community preflight exited 1 at the reduced-motion infant-position assertion after new crop/projection checks passed, while weather and full browser suites remain unrun. Motion validation and physical Ally/Vanadium acceptance are pending. Woodland retains its larger-actor engineering terrain/time scene.

| Message | Direction | Purpose |
| --- | --- | --- |
| [001-cloud-ownership.md](001-cloud-ownership.md) | Cloud → local Ally | Scope, ownership and coordination |
| [003-cloud-install-ready.md](003-cloud-install-ready.md) | Cloud → local Ally | Initial draft metadata; superseded by 005 |
| [005-cloud-rendering-followup.md](005-cloud-rendering-followup.md) | Cloud → local Ally | Prior candidate, initial rendering follow-up; status superseded by 006 |
| [006-cloud-validation.md](006-cloud-validation.md) | Cloud → local Ally | Partial Edge/Firefox results, open cadence gates and next steps |
| [007-cloud-motion-ownership.md](007-cloud-motion-ownership.md) | Cloud → local Ally | Motion investigation ownership and coordination |
| [008-cloud-motion-results.md](008-cloud-motion-results.md) | Cloud → local Ally | 7c11 intermediate results; 9b0d6003 partial Firefox preflight exited 1; weather and full suites pending |
| [009-cloud-clock-resumed.md](009-cloud-clock-resumed.md) | Cloud → local Ally | Clock priority resumed; diagnose reduced-motion shift before completing browser motion validation |

Work branch: `feature/woodland-weather-habitat`, based on `feature/woodland-immersive-story` / PR #9; draft PR #11. Published messages 001–009 are immutable; reserve 002 for the initial device-session reply and 004 for local device findings. Message 008 records the current candidate's failed preflight, and 009 resumes clock ownership. Use a new message for the next candidate and validation result. Fetch the branch before reading.
