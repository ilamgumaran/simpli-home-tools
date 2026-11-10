# Main consolidation and publication audit

- Message ID: `2026-10-10-weather-habitat/039`
- Date: 2026-11-10 UTC
- Direction: cloud → owner and implementation/device sessions
- Scope: owner-authorized development merge onto `main`
- Prior clock tip: `8fcdfac4180568245149f42e7986fc98a525b45e`
- Starting remote clock main: `c15284df7f4202c773458a5ed0f217414082f787`
- Integration PR: [16](https://github.com/ilamgumaran/simpli-home-tools/pull/16)

## Request and audit

The owner asked to check whether all work was pushed and on main, pull latest,
merge it, test and push. Feature publication and main inclusion were different:
all earlier work was published, but most clock work remained on stacked feature
branches. The new explicit request authorizes consolidating that development
work and the device replies onto main. It does not claim a runtime repair or
complete the outstanding performance, cache and physical acceptance work.

Fetched all remote heads. Search Simpli PR #18 was already merged on November 2
at `be795423cc52950b9873b52986d38af94cacda4a`. Every original local Search branch
tip is an ancestor of current remote main; no Search source needed publication
or another merge. Local Search main now matches remote
`41ae08e3c07526a0c044ac6c87fb9d877c1809f2` with a clean worktree.

## Clock integration

Started from latest remote main and merged the anatomy-foundation tip, which
already contains the shared character/contact work, full-screen Woodland,
Green House 1/meal routines, anatomy reference foundation, engineering plans,
efficiency changes and research evidence. Included remaining tree-empty branch
merge histories so all relevant remote tips are traceable through main.

Also merged all five published device reports unchanged:

- [Immersive review 004](../2026-10-05-immersive-woodland/004-ally-scene-results.md).
- [Initial Green House installation 004](004-ally-to-cloud.md).
- [Spacing installation 016](016-ally-spacing-install.md).
- [Meal installation 018](018-ally-meal-install.md).
- [Efficiency installation 026](026-ally-efficiency-install.md).

Conflicts affected mutable indexes, roadmap and installation guidance. Kept the
newer research status and preserved nonconflicting device additions; all reports
are linked by full filename. Published message bodies match their original
remote blobs exactly. Duplicate numeric prefixes are historical and are not
renumbered. Source and license files had no integration conflicts. One inherited
trailing-whitespace-only line in the public SVG preview was cleaned.

Runtime and portable bytes match `8fcdfac`; portable SHA-256 remains
`0accb9737b218f4e4d202b368d0277355d114c21758163ae09cb57f61e142b85`.
The cloud merge does not reinstall the Ally or change its saved settings.

## Search verification

Sol 6 verified the fetched Search main using pinned Zig 0.16.0 and Python:

- Debug engine: 418/426 tests pass; eight opt-in scale tests skipped.
- C ABI harness: 24/24 checks pass; native build succeeds.
- Filename complexity: 2/2 in Debug and 2/2 in ReleaseSmall.
- Native-backed Python: 335 tests run, result OK with 11 expected platform/Unicode skips.
- Dependency-free Python: 297 tests run, result OK with 48 expected native skips.
- Requirements, relevance mechanics, family-folder, J2 and whitespace checks pass.

The full ReleaseSmall engine/ABI suite was not repeated locally. Android/iOS
native builds need NDK/Xcode; their absence is not an assertion of device support.
No Search files changed. Logs remain in the cloud workspace, with no credentials
or local device state committed.

## Clock verification

`npm run build` and the fresh combined `npm test` both exit **0**:

- All **23 pure programs** pass.
- All **15 browser programs per engine** pass in local Chrome and Firefox.
- All **44 animation cadence cases** pass on their first complete run.
- Hosted/portable weather, layout, character, anatomy reference, minute-marker,
  motion, community and meal checks pass, as do offline checks in both engines.
- Source/portable parity, documentation links, conflict-marker and whitespace
  checks pass. Independent review verifies complete branch ancestry, unchanged
  runtime/license files and exact device-report blobs.

[Structured audit, timing summaries and log hashes](../../tools/little-orbit/design/evidence/main-consolidation-2026-11-10.json)
retain the test scope and Search results. The merge preserves every earlier
failed sample. This fresh pass does not prove an intermittent bug is repaired;
no threshold, timeout, sample duration or test policy changes.

## Continuation

Main is the consolidated development baseline. Historical candidate messages
retain their exact revisions, draft status and outcomes. This owner-requested
merge supersedes their older branch-placement instructions; it does not turn
their failed tests or incomplete physical checks into passes.

Next is WC3 native storage/navigation capture from
[the cache task split](../../tools/little-orbit/design/PORTABLE-WEATHER-CACHE.md).
The 48-case WC2 failure and earlier Edge loss remain unresolved, along with
Windows/macOS/Firefox timing and sustained Ally/Vanadium acceptance. A2 artwork
and later gait stages remain deferred as documented in the roadmap.

Use 040 for the next cloud follow-up and reserve 041 for new device feedback.
Messages 004 and 026 are already published and immutable. Fetch main before
continuing; Git does not notify another session automatically.
