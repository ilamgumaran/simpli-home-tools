# Install the published Woodland build and test it on the Ally

- Message ID: `2026-10-05-woodland-ally/001`
- Date: `2026-10-05`
- From: cloud development session
- To: local Ally installation/testing session
- Status: ready for pickup; awaiting acknowledgment and results
- Sender branch: `feature/living-woodland-time`
- Pull request: [PR #3](https://github.com/ilamgumaran/simpli-home-tools/pull/3)
- Tested runtime: `5293f997b37ce17fcbe7ee39a157ebf885e4e496`
- Published installation-handoff revision: `6e2aafdb64cf5f2e76ba0f095e63c7c3708c0eb1`

## Owner request (summarized)

> Let's try to install the new version. Upload everything built, and the other session will pull and test on the Ally. Maintain what was done in the Git repository.

The owner also asked for a directory in Git where sessions can exchange messages, with an entry in the README. This is the first message in that space.

## Ready to install

Source, portable build, Windows helpers, automated tests and all four layer plans are published on the sender branch. The ready-built artifact is `tools/little-orbit/Little Orbit.html`.

Portable SHA-256: `4febc9c95e1ba5243d59626706defa9e200e47e80af05d9a634170457cbd6f9c`.

The build was regenerated and verified byte-for-byte against the published runtime. Complete Linux hosted/portable suites passed in Chrome for Testing 151, Edge 154 and Playwright Firefox 153 during implementation. Physical Ally and GrapheneOS/Vanadium checks remain unrun.

Woodland is the fifth theme: current-time terrain numerals, hourly woodland places, minute activities, central characters and daily social/reflection episodes. Full contact/rope dynamics, conserved resources, hunting mechanics, persistent generations and the five later-world renderers remain planned.

## Action for the Ally session

Pull `feature/living-woodland-time`, read `AGENTS.md` and the [installation handoff](../../tools/little-orbit/design/ALLY-TEST-HANDOFF.md), and update the established Ally display workflow. Preserve local settings, browser profiles and launchers. Select **Theme: Woodland** because existing theme preferences are retained.

Verify the artifact checksum and record the exact Git revision used. Test the actual device using the handoff's checks: current-time agreement and rollovers, readability at the real viewport/scaling, character/gear/recovery, touch/settings/fullscreen, pauses and screen care, offline portable behavior, and a longer run. Do not merge/release PRs or start future themes as part of installation/testing.

## Reply requested

Create `002-ally-to-cloud.md` in this thread and publish it in Git. Use the [message template](../MESSAGE-TEMPLATE.md), update the thread index, and report the reply branch/PR to the owner so the cloud session can fetch it.

Include installation outcome, exact revision/checksum, browser/version, viewport/scaling, checks run and not run, failures with reproduction steps, art feedback and the recommended next action. If installation is blocked, record the blocker rather than claiming completion. No physical-device results are available in this message.
