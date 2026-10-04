# Desk clock architecture

## Current source map

| File | Responsibility |
| --- | --- |
| `index.html` / `style.css` | Clock content, controls, layouts and theme styling |
| `app.js` | Real time/date, facts, weather, storage, core controls, theme registry and Candy Quest |
| `config.js` | Shared defaults, overridden by browser-saved settings |
| `display-settings.js` | Device/display settings and live layout changes |
| `time-climber.js` | Time Climber scene, digit geometry, routes and animation lifecycle |
| `build-portable.cjs` | Embeds runtime assets into `Little Orbit.html` |
| `server.cjs` | Optional loopback static server with explicit served-file list |
| `tests/` | Hosted and portable browser verification |
| `windows/` | Optional OS-specific launching; independent of browser runtime |

There are no runtime library dependencies. Playwright is contributor tooling. Weather/location requests are external; time and bundled facts remain available offline. Keep that separation explicit.

## Direction as themes grow

The following is an intended boundary, not a completed refactor:

- **Clock model:** wall time, calendar fields and locale formatting. It never depends on frame rate or scene completion.
- **Display shell:** readable time/date/weather/fact areas, responsive sizing, settings and safe zones.
- **Theme scenes:** original art and route/camera state with shared activation, pause, resize and teardown hooks. Reuse the current lifecycle and only extract common code when another theme needs it.
- **Screen-care lifecycle:** pauses, night dimming, quiet intervals, visibility and reduced motion consistently affect all scenes.
- **Portable packaging:** every runtime module must be explicitly embedded and served. Avoid an accidental module/CDN dependency that breaks `file://` use.

For Time Climber II, keep calendar progress calculations and digit route data pure/testable. Store route progress rather than long-lived animation timelines. On wake/resize/time jumps, recompute from current time and enter a safe scene state. Keep the fixed readout outside camera transforms.

Use feature detection and browser viewport sizes, not OS or browser-name branches. Keep mutable user configuration out of shared source defaults. Never couple clock functionality to Windows power or kiosk tools.
