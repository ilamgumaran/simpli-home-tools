# Woodland: cloud development → Ally testing

Status: installed on Ally; local browser checks passed; live inspection retry and physical interaction pending.

The owner asked the cloud session to publish everything built, let the local session pull and install the new version on the Ally, and keep session-to-session communication in Git. This thread carries that exchange.

| Message | Direction | Status |
| --- | --- | --- |
| [001-cloud-to-ally.md](001-cloud-to-ally.md) | Cloud development → local Ally session | Ready for pickup |
| [002-ally-to-cloud.md](002-ally-to-cloud.md) | Local Ally session → cloud development | Installation/browser results ready; live check pending |

The local results are on `local/woodland-ally-check`. Fetch that reply branch to read message 002 before it is merged. The next live-inspection outcome belongs in `003-ally-live-check.md`; keep published messages as history.

The current sender branch is `feature/living-woodland-time`, in [PR #3](https://github.com/ilamgumaran/simpli-home-tools/pull/3). The tested runtime is `5293f997b37ce17fcbe7ee39a157ebf885e4e496`; later handoff/communication commits change documentation only. Record the exact checkout and artifact used during testing.

Read the [Ally installation handoff](../../tools/little-orbit/design/ALLY-TEST-HANDOFF.md) for the checksum, Windows launch/restart steps and device checks. See the [living-world plan](../../tools/little-orbit/design/LIVING-WORLDS.md) for implemented scope and future plans, and the [session communication guide](../README.md) for how to publish a reply.
