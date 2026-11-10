<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Model orchestration and delivery gates

Copyright (C) 2026 ilamgumaran and contributors. Licensed under Simpli Home Tools Noncommercial License 1.0; see [LICENSE](../LICENSE).

Updated 2026-10-10. This workflow implements the owner's requested model split for the current Woodland delivery and later world work. The current fullscreen Woodland scene is implemented; finalize its evidence and delivery before starting future layers.

## Roles

| Role | Scope |
| --- | --- |
| Sol 6.1 | Plan work, own final integration and review; resolve scope and merge conflicts. |
| Sol 6 | Validate source and portable behavior; report concise evidence and failures. |
| GPT-6 Luna | Execute bounded documentation or other explicitly assigned small-scope work. |

Assign one file or clearly bounded set per task. Name ownership, allowed edits, constraints, required references and expected report. Keep concurrent edits disjoint. The final integrator checks the combined diff and owns claims about completion.

## Current delivery gates

1. **Validate** source and portable forms for viewport fit; live time, minute/hour/day transitions; activities, tools and body contacts; cadence; and lifecycle/accessibility behavior. Record actual outcomes in [IMMERSIVE-WOODLAND.md](IMMERSIVE-WOODLAND.md), marking unrun or failed cases plainly.
2. **Fix narrowly** only evidence-backed failures. Delegate small, disjoint file scopes; rerun the affected checks and update evidence.
3. **Review and publish** the integrated source, generated portable build, tests and documentation together on the feature branch and PR. No merge or release is implied.
4. **Collect physical evidence** separately on Ally and Vanadium. Desktop browser results do not satisfy device acceptance.

Do not claim a gate passed until its evidence is recorded. Keep revision and portable checksum synchronized in the [Ally handoff](ALLY-TEST-HANDOFF.md) after final validation/build.

## Future proposed tickets

After the current delivery, consider these as separately reviewed tickets:

- Improve activity clarity where observation shows tool, material or action ambiguity.
- Add a one-minute material variation while preserving immediate, complete current digits.
- Refine one-hour continuity across authored locations and chapter changes.
- Design deeper world history and persistence, including state, reset, storage and resource rules before implementation.
- Plan industrial, farming, railway and ant worlds independently, with separate acceptance criteria and estimates.

These proposals authorize no implementation by themselves. Preserve browser independence, readable current time, accessible lifecycle controls, and the project license as shared constraints.
