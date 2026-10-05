# Session communication

This directory keeps messages, handoffs and replies between development and device-testing sessions in Git. Read it when starting or resuming work, then open the relevant thread. Product plans stay in the tool's documentation; messages link to them rather than creating another source of truth.

Git records communication but does not automatically notify another running session. Fetch the sender's branch and read its latest messages before acting. Record results and the next handoff here so the owner can direct the next session to them.

## Current threads

| Thread | Branch carrying the handoff | Latest message | State |
| --- | --- | --- | --- |
| [Organic character motion — cloud ownership](2026-10-05-organic-motion/README.md) | Notice: `feature/living-woodland-time`; work: `feature/woodland-organic-motion` | [002: integration reply](2026-10-05-organic-motion/002-other-session-to-cloud.md) | Cloud owns fluid/organic motion; other session continues its separate next task |
| [Woodland size and motion refinement](2026-10-05-woodland-refinement/README.md) | `feature/woodland-refinement-contacts` | [002: integration reply](2026-10-05-woodland-refinement/002-ally-to-cloud.md) | Enlarged artwork + contacts/work integrated; physical review pending |
| [Woodland installation and Ally testing](2026-10-05-woodland-ally/README.md) | Latest character step/reply: `feature/woodland-walking-grips`; preceding contacts: `feature/woodland-character-contacts` | [004: walking and grips](2026-10-05-woodland-ally/004-walking-grips.md) | Planted walking and work grips implemented, verified and deployed; physical acceptance pending |

## Read and reply

1. Inspect your local Git status and preserve existing work. Fetch the sender's branch; confirm the branch/commit and read the thread index plus unread numbered messages. The current Woodland handoff is on `feature/living-woodland-time`, not necessarily on `main`.
2. Follow the message's linked product instructions. A proposal or message is not permission to merge, release or automatically implement a deferred feature.
3. Write the reply as the next numbered Markdown file in the same thread, using [MESSAGE-TEMPLATE.md](MESSAGE-TEMPLATE.md). In the current refinement thread, the Ally session should create `002-ally-to-cloud.md`. State what was actually done, the exact revision tested, results, remaining issues and the next action.
4. Update the thread index and this thread table when publishing a reply. Keep published message bodies as history; write a new message for a correction or follow-up.
5. Commit and push the reply. Prefer a separate session branch and a PR targeting the branch carrying this handoff when another session may still be editing it. Share the reply branch/PR with the owner; the receiving session must fetch it to read it before merge. Avoid simultaneous edits to the same numbered message.

To read the current message without switching branches or replacing local files:

```sh
git fetch origin feature/living-woodland-time
git show FETCH_HEAD:sessions/2026-10-05-woodland-refinement/README.md
git show FETCH_HEAD:sessions/2026-10-05-woodland-refinement/001-cloud-to-ally.md
```

Create a new dated thread directory for a different task, for example `YYYY-MM-DD-topic/`, with an index and `001-sender-to-recipient.md`. Dates use the owner's session date; include a timezone if scheduling matters. Give each message a stable ID, sender/recipient role and status. Keep credentials, private device paths, browser profiles, OS power state and private screenshots out of Git, consistent with the repository instructions.

Related reading: [repository guide](../README.md), [owner prompts](../tools/little-orbit/design/OWNER-PROMPTS.md), and [Ally installation handoff](../tools/little-orbit/design/ALLY-TEST-HANDOFF.md).
