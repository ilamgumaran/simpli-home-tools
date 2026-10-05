# Contributing

Ideas, bug reports, new themes, and accessibility improvements are welcome. Open an issue or fork the repository and send a pull request. Describe the change, why it helps, and how you checked it.

For display bugs, include browser and OS versions, the **browser viewport** reported in clock Settings, OS scaling, theme, and device preset. You can leave out your location and other personal details.

Each tool lives under `tools/<tool-name>`. Keep tools independently usable. For Little Orbit, follow [the tool guide](tools/little-orbit/README.md) and its [configuration guide](tools/little-orbit/CONFIGURATION.md).

```sh
cd tools/little-orbit
npm ci
npx playwright install chromium firefox
npm run build
npm test
```

On Linux, Playwright may require `npx playwright install --with-deps chromium firefox`. Runtime use of the clock requires only a browser; Node and Playwright are contributor tooling.

Check handheld (854×480), HD (1280×720), full HD (1920×1080), and portrait (390×844) views; screen care, reduced motion, touch lock, offline operation, and single-file use. Keep any new artwork original or supply its license and attribution. Include generated `Little Orbit.html` when changing app sources. Do not commit dependencies, browser profiles, private settings, or local power state.

New themes should fit the existing content, avoid covering the time/weather/facts, pause when hidden, respect reduced motion, and offer quiet intervals. Add themes to the registry instead of replacing current ones.

For Our Desk Clock, consult the [product guide](tools/little-orbit/PRODUCT.md) and [roadmap](tools/little-orbit/ROADMAP.md). Save useful proposals and original previews in `tools/little-orbit/design/` with a clear status and acceptance checks. Keep plans distinct from implemented behavior, update the decision log for lasting choices, and update the changelog when behavior changes. Documentation-only PRs should validate links/previews without altering the device runtime.

New intentional contributions are accepted under the **Simpli Home Tools Noncommercial License 1.0** in [LICENSE](LICENSE). Read its contribution authorization before submitting: you retain copyright and grant the project licensor the right to offer your contribution under separate commercial terms. Confirm that you have this authority and identify third-party material and its license. Retain attribution notices. Prior contributions and GPL versions are not retroactively relicensed by this policy. See [LICENSING.md](LICENSING.md) for commercial-permission requests.
