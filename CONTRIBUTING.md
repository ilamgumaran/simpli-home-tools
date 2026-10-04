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

Contributions are accepted under **GPL-3.0-only**, the project's license. Retain copyright and attribution notices. No separate contributor agreement is required by this repository.
