# Simpli Home Tools

Small, configurable tools for everyday home devices. Contributions and new ideas are welcome.

## Tools

| Tool | What it does | Run it |
| --- | --- | --- |
| [Our Desk Clock](tools/little-orbit/) | Retro display clock with weather, date, daily facts, touch lock, and cartoon screensaver themes, including Time Climber I and II | Download the repo ZIP and open `tools/little-orbit/Little Orbit.html` in a browser |

Little Orbit runs entirely in the browser. Its [configuration guide](tools/little-orbit/CONFIGURATION.md) covers device presets, font sizes, weather location, screen care, and character timing. Node is optional for local serving or rebuilding the portable file.

Use **Code → Download ZIP**, extract it, and open the portable HTML file. Alternatively, clone the repository and follow the tool's README. A GitHub file preview is source code; download the HTML to run it.

## Session communication

Start with [sessions/README.md](sessions/README.md) when continuing work in another session. The directory keeps numbered messages, handoffs, replies and testing results in Git. The current [cloud-to-Ally message](sessions/2026-10-05-woodland-refinement/001-cloud-to-ally.md) identifies the published Woodland build and asks the local session to install/test it and return its findings here.

Fetch `feature/living-woodland-time` to read that handoff while PR #3 remains unmerged. Git does not notify sessions automatically; fetch and read the relevant thread before acting.

## Contribute

Open an issue or send a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md). Each tool has its own folder so the collection can grow.

Our Desk Clock's [product guide](tools/little-orbit/PRODUCT.md), [roadmap](tools/little-orbit/ROADMAP.md), and [design archive](tools/little-orbit/design/) track how it will evolve. Time Climber II is implemented on the development branch alongside its original design and acceptance checks.

## License

Project source, documentation, and original artwork use the **Simpli Home Tools Noncommercial License 1.0**; see [LICENSE](LICENSE) and [LICENSING.md](LICENSING.md). Noncommercial use, modification, and sharing are allowed under those terms. **Commercial use or monetization requires separate written permission from ilamgumaran.** This is source-available software, not OSI open source. Earlier GPL-licensed versions retain their existing rights. External services/data and dependencies keep their own terms.
