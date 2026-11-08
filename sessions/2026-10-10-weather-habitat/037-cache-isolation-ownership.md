# Portable weather-cache isolation ownership

- Message ID: `2026-10-10-weather-habitat/037`
- Date: 2026-11-08 UTC
- Direction: cloud → owner and implementation/device sessions
- Branch: `feature/anatomy-foundation`, draft PR #16
- Starting checkpoint: `d7f8de29ed7b47e5549e6f1219188550f5ba235c`
- Status: research ownership; results follow in 038

The owner resumed the next clock task. [036](036-portable-weather-cache-evidence.md)
retains the exact Edge failure: usable snow cache before reload, absent afterward
at the same key/unit. That identifies an observation boundary, not its cause.
Production cache behavior, scene art, timing thresholds and portable bytes remain
unchanged during this investigation.

Sol 6.1 owns the method, integration and final claims; Luna owns a narrow
standalone isolation runner and pure transformation checks; Sol 6 reviews the
causal interpretation and final changes. Browser runs stay serial so animation
timing measurements do not compete with other browser tests.

The WC2 comparison uses four conditions: hosted/portable, each with/without the
separate DPR2 layout context. Four balanced rounds retain every case, including
failures. The experiment derives the canonical fixture through the first cached
restoration assertion, and the absent-sibling arm removes only its DPR2 context
block. The original snow precondition, offline reload and 30-second cached wait
remain. There is no diagnostic reseeding, additional measured-path delay or retry.
Canonical and derived source digests distinguish the transformed research code
from the full application regression program.

Each case uses a fresh browser, which differs from the canonical full program's
shared browser for hosted then portable forms. An unmodified canonical Edge
control therefore runs separately and keeps its own outcome. An empty-page
storage sentinel probe is a separate, simpler control; it cannot replace the
application fixture or prove storage behavior in it.

Quality gates: reject canonical-source marker drift, verify balanced case orders
and complete records, preserve original error identity and sanitized failure
links, review every outcome, and run required build/full regression checks before
publication. Passing samples cannot erase earlier failures. Add storage-operation
or partition-identity instrumentation only if the WC2 evidence warrants it;
do not make a speculative production repair.

Existing Windows/macOS timing and physical Ally/Vanadium gates remain open.
A2 artwork and later gait changes remain deferred. Use 038 for results and 026
for device feedback; do not modify published numbered messages.
