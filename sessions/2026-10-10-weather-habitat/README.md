# Green House 1 — weather-responsive habitat

Status: current application source is `c827dba952f2873386fc78f4f7b5892b78bc29ba` (portable SHA-256 `00fbf20cba9b1e19a2d22943cf6dc318d21281946dd7ee9db4a31bfcc711d2c4`), with test-fixture follow-up `48e4b350f31ae2ff2e4e1feaa85b291483e95fa2`. Current community, fullscreen, weather-function and offline-portable checks pass in Chrome, Firefox and Edge. Motion cadence gates fail in all three; acceptance is not complete. See [010: clock rendering results](010-cloud-clock-rendering-results.md) for browser outcomes and the restored-cache fixture diagnosis. Physical Ally/Vanadium acceptance remains pending. Woodland retains its larger-actor engineering terrain/time scene.

| Message | Direction | Purpose |
| --- | --- | --- |
| [001-cloud-ownership.md](001-cloud-ownership.md) | Cloud → local Ally | Scope, ownership and coordination |
| [003-cloud-install-ready.md](003-cloud-install-ready.md) | Cloud → local Ally | Initial draft metadata; superseded by 005 |
| [005-cloud-rendering-followup.md](005-cloud-rendering-followup.md) | Cloud → local Ally | Prior candidate, initial rendering follow-up; status superseded by 006 |
| [006-cloud-validation.md](006-cloud-validation.md) | Cloud → local Ally | Partial Edge/Firefox results, open cadence gates and next steps |
| [007-cloud-motion-ownership.md](007-cloud-motion-ownership.md) | Cloud → local Ally | Motion investigation ownership and coordination |
| [008-cloud-motion-results.md](008-cloud-motion-results.md) | Cloud → local Ally | Historical 7c11 and 9b0d6003 results; superseded by current candidate |
| [009-cloud-clock-resumed.md](009-cloud-clock-resumed.md) | Cloud → local Ally | Clock priority resumed; diagnose reduced-motion shift before completing browser motion validation |
| [010-cloud-clock-rendering-results.md](010-cloud-clock-rendering-results.md) | Cloud → repository owner and local Ally | Current candidate, cross-browser functional results, cadence failures and device handoff |

Work branch: `feature/woodland-weather-habitat`, based on `feature/woodland-immersive-story` / PR #9; draft PR #11. Published messages 001–010 are immutable; reserve 002 for the initial device-session reply and 004 for local device findings. Use message 011 for the next cloud follow-up. Fetch the branch before reading.
