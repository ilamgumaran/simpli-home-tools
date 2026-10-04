# Sources and external services

- **Weather and city search:** [Open-Meteo](https://open-meteo.com/). Data comes directly from the service at runtime; preserve the on-screen attribution. The project GPL license does not relicense provider data or override its service terms. Review their terms for the intended deployment, especially commercial use.
- **Educational references:** [NASA Science](https://science.nasa.gov/). The bundled facts are short original summaries linked to source pages. No NASA logo, third-party photo, or remote article text is bundled. A fact link opens the source only when tapped.
- **Artwork and fonts:** The candy character is original inline SVG under this project's GPLv3 license. Fonts use local device fallbacks; no font files are downloaded or redistributed.
- **Contributor test dependency:** [Playwright](https://github.com/microsoft/playwright), Apache-2.0. It and its browser downloads are development tools installed separately, not bundled into the display runtime or portable HTML. Their respective license files remain in their packages.

No tokens, weather API key, browser extension, or external JavaScript library are needed by the display itself.
