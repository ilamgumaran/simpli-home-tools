# Woodland: cloud development → Ally testing

Status: historical first build; see the [current size/motion refinement handoff](../2026-10-05-woodland-refinement/README.md) for installation. Physical-device results remain pending.

The owner asked the cloud session to publish everything built, let the local session pull and install the new version on the Ally, and keep session-to-session communication in Git. This thread carries that exchange.

| Message | Direction | Status |
| --- | --- | --- |
| [001-cloud-to-ally.md](001-cloud-to-ally.md) | Cloud development → local Ally session | Ready for pickup |

The Ally session should reply by creating `002-ally-to-cloud.md` using the [message template](../MESSAGE-TEMPLATE.md), then add that reply to this table and update its status. No device results have been reported yet.

The current sender branch is `feature/living-woodland-time`, in [PR #3](https://github.com/ilamgumaran/simpli-home-tools/pull/3). The tested runtime is `5293f997b37ce17fcbe7ee39a157ebf885e4e496`; the later refinement changes the runtime and has its own pinned handoff. Record the exact checkout and artifact used during testing.

Read the [Ally installation handoff](../../tools/little-orbit/design/ALLY-TEST-HANDOFF.md) for the checksum, Windows launch/restart steps and device checks. See the [living-world plan](../../tools/little-orbit/design/LIVING-WORLDS.md) for implemented scope and future plans, and the [session communication guide](../README.md) for how to publish a reply.
