// SPDX-License-Identifier: GPL-3.0-only
// Site defaults. Settings saved in a browser override these values.
// After editing, run `npm run build` to update the single-file clock.
window.ORBIT_CONFIG = {
  theme: 'candy',
  unit: 'fahrenheit',
  format24: false,
  lowPower: true,
  care: true,
  night: true,
  rest: true,
  place: {name: 'Marietta, GA · 30064', latitude: 33.9276, longitude: -84.6202},
  display: {
    profile: 'auto',
    clockScale: 1,
    weatherScale: 1,
    factScale: 1,
    gap: 8,
    companionInterval: 60,
    companionDuration: 12,
    companion: true
  }
};
