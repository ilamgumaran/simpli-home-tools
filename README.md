# Simpli Home Tools

Small, configurable tools for everyday home devices. Contributions and new ideas are welcome.

## Tools

| Tool | What it does | Run it |
| --- | --- | --- |
| [Our Desk Clock](tools/little-orbit/) | Retro display clock with weather, date, daily facts, touch lock, and cartoon screensaver themes, including Woodland and Green House 1 | Download the repo ZIP and open `tools/little-orbit/Little Orbit.html` in a browser |

Little Orbit runs entirely in the browser. Its [configuration guide](tools/little-orbit/CONFIGURATION.md) covers device presets, font sizes, weather location, screen care, and character timing. Node is optional for local serving or rebuilding the portable file.

Use **Code → Download ZIP**, extract it, and open the portable HTML file. Alternatively, clone the repository and follow the tool's README. A GitHub file preview is source code; download the HTML to run it.

## Session communication

Start with [sessions/README.md](sessions/README.md) when continuing work in another session. The directory keeps numbered messages, handoffs, replies and testing results in Git. The latest [Green House 1 thread](sessions/2026-10-10-weather-habitat/README.md) identifies runtime `f02092b12a45d72cefe73ba68d5acd2f68932358` and portable SHA-256 `046f02a9772a5060ac422b6acceee763fb29726a230df1ce1932a38611899ec6`. Sage's lunch and evening-care windows now sample a seven-stage meal each minute, with hand-carried food, a serving stand and a return route. Both `npm test` runs exit 0 (combined Chrome/Firefox and native Edge; runner `7bfe736`): all 9 pure programs, 13 browser programs per engine, offline portable, and all 66 cadence cases (54 existing + 12 meal cases). Final focused meal (4 functional + 4 cadence per engine) and community (14 groups per engine) checks pass. Caption clearance passes all seven stages and quiet mode across four views at DPR 1/2. Painted-group gaps meet >=30 CSS px and viewport margins meet >=16 CSS px. No full-run failures or retries. Physical Ally/Vanadium and sustained acceptance remain pending; earlier intermittent stalls remain unexplained. See [session 017](sessions/2026-10-10-weather-habitat/017-cloud-meal-choreography-results.md) for detailed evidence. The [full-screen Woodland thread](sessions/2026-10-05-immersive-woodland/README.md) records Woodland's larger-actor engineering scene handoff; the local session should fetch its branch and return device findings in Git. Earlier motion results remain in the [organic-motion thread](sessions/2026-10-05-organic-motion/README.md).

The next planned character work is [shared anatomy and organic movement](tools/little-orbit/design/ANATOMY-AND-ORGANIC-MOVEMENT.md), with staged palm/grip, heel/toe, joint-limit and whole-cast migration tasks. [Session 018](sessions/2026-10-10-weather-habitat/018-cloud-anatomy-movement-plan.md) is the planning handoff; the tested runtime remains session 017’s candidate.

The [engineering complication planning thread](sessions/2026-10-18-engineering-complication/README.md) on `plan/engineering-complication` records the new people-powered mechanical-calendar proposal and research checkpoints.

Fetch `feature/living-woodland-time` to read that handoff while PR #3 remains unmerged. Git does not notify sessions automatically; fetch and read the relevant thread before acting.

## Contribute

Open an issue or send a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md). Each tool has its own folder so the collection can grow.

Our Desk Clock's [product guide](tools/little-orbit/PRODUCT.md), [roadmap](tools/little-orbit/ROADMAP.md), and [design archive](tools/little-orbit/design/) track how it will evolve. Time Climber II is implemented on the development branch alongside its original design and acceptance checks.

## License

Project source, documentation, and original artwork use the **Simpli Home Tools Noncommercial License 1.0**; see [LICENSE](LICENSE) and [LICENSING.md](LICENSING.md). Noncommercial use, modification, and sharing are allowed under those terms. **Commercial use or monetization requires separate written permission from ilamgumaran.** This is source-available software, not OSI open source. Earlier GPL-licensed versions retain their existing rights. External services/data and dependencies keep their own terms.
