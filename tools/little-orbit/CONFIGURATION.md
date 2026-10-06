# Configuration

The same HTML/CSS/JavaScript runs in modern browsers on different operating systems. Screen size is measured in **browser viewport pixels**, so a 1280×720 Ally at 150% Windows scaling is about 854×480 to the page. No OS or browser name is needed for layout detection.

## Per-device settings

Open **Settings → Display & character**. The settings are saved for this browser and origin; private sessions may discard them.

| Setting | Meaning | Range / default |
| --- | --- | --- |
| Device preset | Sets starting text sizes and spacing; layout still follows the window | Automatic, Handheld, Desktop/TV, Tablet |
| Time, weather, fact size | Independent font multipliers | 65–120%; 100% |
| Panel spacing | Space between rows in the wide display layout | 4–24 px; 8 px |
| Character visits every | Delay between visits; panel glides may postpone a visit | 30–300 seconds; 60 |
| Character visit length | Maximum visit duration; sweeping is capped at 8 seconds | 4–20 seconds; 12 |
| Character | Show the companion in Candy Quest, Time Climber, Time Climber II, or Woodland | On |
| Scene camera | Time Climber II focus and fullscreen Woodland camera/information drift; reduced motion takes priority | Gentle / Still; Gentle |
| Woodland view | Full landscape with continuous camp activity, or the earlier dashboard with visits | Full landscape / Dashboard; Full landscape |

**Reset display sizes** restores the site's display defaults without changing location, theme, or screen-care choices. Larger fonts may require reducing another size or spacing on small screens. Reduced-motion preferences always take priority and show a brief still appearance.

The Theme button cycles Orbit, Candy Quest, Time Climber, Time Climber II, and Woodland of Time. The fourth theme has a fixed full time/date readout and a separate moving mountain scene. Time/date use the device clock and timezone. Weather location and Fahrenheit/Celsius are independent of the device locale. Touch lock and fullscreen are browser features; wake lock is requested where available. Configure sleep and physical brightness in the OS.

## Site defaults

Edit `config.js`, then run `npm run build`. It sets defaults for friends opening the tool for the first time. Existing saved browser preferences override those defaults. To test new defaults without stored settings, use a fresh browser profile or clear this site's storage.

```js
window.ORBIT_CONFIG = {
  theme: 'climber2',
  unit: 'celsius',
  place: {name: 'Your city', latitude: 51.5, longitude: -0.12},
  lowPower: true,
  care: true,
  rest: true,
  night: true,
  display: {
    profile: 'handheld',
    clockScale: 1,
    weatherScale: 0.95,
    factScale: 0.95,
    gap: 8,
    companionInterval: 90,
    companionDuration: 10,
    companion: true,
    cameraMotion: 'gentle',
    woodlandView: 'immersive'
  }
};
```

Omitted values keep built-in defaults. Display numbers are constrained to the ranges above. `format24` selects 24-hour time. `care`, `rest`, `night`, and `lowPower` control shifting, hourly black breaks, night dimming, and lower-frequency updates. Keep exact theme IDs (`orbit`, `candy`, `climber`, `climber2`, or `woodland`), profile IDs (`auto`, `handheld`, `desktop`, `tablet`), camera IDs (`gentle`, `still`), and unit IDs (`celsius` or `fahrenheit`).

Configuration is executable local JavaScript; accept config changes through normal source review. Put public defaults in this file; do not put API secrets or personal browser settings in the repository.

## Extending the app

- `style.css`: responsive layout and palette; `--clock-scale`, `--weather-scale`, `--fact-scale`, and `--panel-gap` apply user sizing.
- `display-settings.js`: presets, validated display controls, and persistence.
- `app.js`: themes registry, clock/weather/facts, touch lock, screen care, and companion routes.
- `config.js`: deployment defaults; no app code edits needed for routine setup.
- `build-portable.cjs`: embeds all assets into `Little Orbit.html`.
- `windows/`: optional Edge kiosk helpers; not required on other OSes.

The local server binds only to 127.0.0.1. Set its port using environment variable `PORT` (default 4173). Use static HTTPS hosting to share the clock across devices. Fullscreen and staying awake may require interaction or browser/OS permission; missing APIs fall back gracefully.

Time Climber uses the same character controls. At the default 60-second interval it starts trips near :54, allowing a real minute rollover during the ascent; the first trip starts immediately after a short setup pause. Its tent is a miniature portaledge suspended from a digit. `time-climber.js` contains original SVG equipment, digit measurement, widget routes, and scene timing. Its animation stops during quiet pauses and screen rest.

`time-climber-ii.js` contains the fourth theme's original terrain/explorer, 0–9 route data, calendar progress, camera, and lifecycle. Minute expeditions traverse a pair in one visit; higher levels move through small sections of their calendar progress. Character interval/duration controls set the quiet cadence. `display.cameraMotion: 'still'` avoids camera animation, and reduced motion always produces a still campsite. The fourth theme caps panel spacing at 14px to reserve room on compact screens; larger fonts reduce scenery height first.

## Shared character defaults

`config.js` exposes `characters: {candy: 'candy', climber: 'moss', climber2: 'ridge'}`. Choose any registered identity for a theme; its role stays with the scene. Orbit has no mascot by default. This is a site configuration option, not a new browser setting. Run `npm run build` afterward for portable use. Identity, colors, body and gear are defined once in `characters.js`; use `DeskCharacters.create(id, {role, appearance})` for an independent appearance instance. See the [character workshop and design notes](design/CHARACTERS.md).

### Woodland of Time

Use `theme: 'woodland'` for the fifth theme. `display.woodlandView: 'immersive'` fills the browser viewport with larger characters, detailed material time and continuous camp/river activity. All four numerals immediately show the selected current local HH:MM. Hourly chapters change the scenery and rebuild authored camp progress; daily stories select the cast. Travel precedes work, including following helpers/children and a protected descent after climbing. Each ascent includes three four-second supported recovery holds. Low power targets 30 fps; normal mode follows browser frames. Companion-off hides the cast while atmosphere continues. Reduced motion selects a static composition, and `cameraMotion: 'still'` suppresses camera/information drift. See [immersive Woodland](design/IMMERSIVE-WOODLAND.md).

Set `woodlandView: 'dashboard'` for the earlier panel composition. In that view, travel takes 1–20 seconds according to body-scaled distance; `companionDuration` governs work after arrival and `companionInterval` can repeat visits within the minute. Work ends before the next visit or second 55; windows under four seconds are skipped. See [organic motion](design/ORGANIC-MOTION.md). Full landscape does not use the visit interval/duration controls.

Woodland normally selects Moss or Ridge from its daily story. An optional `characters.woodland: 'ridge'` (or another adult identity) overrides the lead; conflicting adult cast slots swap to preserve the episode’s participants and named captions follow the chosen lead. Sprout remains a grounded learner and is not accepted as a woodland lead override. Hourly screen-rest and night dimming remain controlled by their existing settings. The daily reflection chapter uses local 18:00–18:59; this is authored story time, not a computed sunset.
