# Woodland: cloud development → Ally testing

Status: installed on Ally; local browser checks passed; live inspection retry and physical interaction pending.

The owner asked the cloud session to publish everything built, let the local session pull and install the new version on the Ally, and keep session-to-session communication in Git. This thread carries that exchange.

| Message | Direction | Status |
| --- | --- | --- |
| [001-cloud-to-ally.md](001-cloud-to-ally.md) | Cloud development → local Ally session | Ready for pickup |
| [002-ally-to-cloud.md](002-ally-to-cloud.md) | Local Ally session → cloud development | Installation/browser results ready; live check pending |
| [003-character-contacts.md](003-character-contacts.md) | Local character work → cloud and device sessions | Planted rock contacts implemented, browser-verified and deployed |

Installation results are on `local/woodland-ally-check`. The next authorized character step is on `feature/woodland-character-contacts`, including message 003 and the previous notes. Fetch the relevant reply branch before it is merged. The earlier live-inspection retry remained blocked; the owner then requested character work. Future replies should use 004 or later and preserve published messages as history.

The current sender branch is `feature/living-woodland-time`, in [PR #3](https://github.com/ilamgumaran/simpli-home-tools/pull/3). The tested runtime is `5293f997b37ce17fcbe7ee39a157ebf885e4e496`; later handoff/communication commits change documentation only. Record the exact checkout and artifact used during testing.

Read the [Ally installation handoff](../../tools/little-orbit/design/ALLY-TEST-HANDOFF.md) for the checksum, Windows launch/restart steps and device checks. See the [living-world plan](../../tools/little-orbit/design/LIVING-WORLDS.md) for implemented scope and future plans, and the [session communication guide](../README.md) for how to publish a reply.
