# Engineering complication — research and mechanism checkpoint

- Message ID: `2026-10-18-engineering-complication/002`
- Date: `2026-10-18 UTC`
- From: cloud planning/review session
- To: repository owner and future engineering sessions
- Branch: `plan/engineering-complication`
- Status: conceptual architecture and arithmetic reviewed; physical mechanism unproven; no implementation

Scope checkpoint [001](001-planning-scope.md) was pushed as `690901b`. The [design hub](../../tools/little-orbit/design/engineering/README.md) now links the mechanism, energy/reliability comparison and source register.

## Defined and independently checked

- Proposed weight-powered timing core with a small gravity remontoire; people recharge reserves while display/calendar bursts have a separate power branch. The pendulum regulates release and does not supply motor power to heavy displays.
- Explicit 2-second full pendulum period and half-tooth-per-beat escapement convention; 30 teeth gives one revolution/minute. Compound 20:120 then 20:200 gives 1:60 to minutes; 20:120 then 20:80 gives 1:24 to the daily reference. Actual pallet, tooth and indexer geometry still needs design/proof.
- Gregorian month/date logic, a proposed 400-position annual program, correct century cases and `32−L` D31 end-of-month advance. Independent checks confirm 97 leap years and 146097 days/400 years. Annual cam geometry at 0.9° sectors and torque isolation remain unresolved.
- Direct-weight, spring, flywheel, hydraulic and air alternatives have explicit storage locations, losses and service questions. A separate weighted hydraulic load is the first hydraulic study; externally supplied air support is an optional isolated experiment. No free energy, zero friction or maintenance-free longevity is claimed.
- A complete device-time reading stays authoritative while finite-duration mechanical register indexing is masked. Browser reconstruction is distinguished from physical energy-conserving operation and oscillator accuracy.

Sol 6 independently recomputed gear, calendar, ideal pendulum, reserve and drift arithmetic and reviewed the architecture. One source-description error was corrected: CPython's documentation describes `isleap`'s result, while the exact rule is in its implementation. This was a document/arithmetic review, not an application or hardware test.

## Evidence and remaining research

Four pinned GitHub-hosted CPython/tz sources were retrieved HTTP 200 and read, supporting Gregorian arithmetic, timezone-rule limits and external leap-second information. The [research register](../../tools/little-orbit/design/engineering/RESEARCH.md) gives exact revisions, claim scope and access status. Manufacturer/horology/USNO/NIST targets hit the restricted-network CONNECT 403 and are not verified citations. Additional exact domains were saved to the reusable environment draft; publication is required before retrying. No source access is implied by that save.

Next checkpoint will complete character marks/story, the visible/hidden functional-object catalog, decisions, staged implementation and next-session tasks. These documents do not establish novelty, actual accuracy, component ratings, lifetime or centuries without maintenance. Runtime/portable output remains unchanged. Published 001–002 are immutable; use 003 for the final planning handoff, and 004 for its next follow-up.
