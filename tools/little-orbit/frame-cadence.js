// SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0
// Copyright (C) 2026 ilamgumaran and contributors
((root, factory) => {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.DeskFrameCadence = api;
})(typeof globalThis === 'object' ? globalThis : this, () => {
  const PERIOD = 1000 / 30;
  const EARLY_TOLERANCE = 4;
  const MINIMUM_GAP = 24;

  function create() {
    let last = null;
    let due = null;
    let previous = null;

    function reset() {
      last = null;
      due = null;
      previous = null;
    }

    function shouldDraw(at, lowPower) {
      if (typeof at !== 'number' || !Number.isFinite(at) || at < 0) {
        throw new RangeError('RAF timestamp must be a finite nonnegative number');
      }
      if (typeof lowPower !== 'boolean') {
        throw new TypeError('lowPower must be a boolean');
      }

      const backwards = previous !== null && at < previous;
      previous = at;
      if (last === null || backwards) {
        last = at;
        due = at + PERIOD;
        return true;
      }
      if (!lowPower) {
        last = at;
        due = at + PERIOD;
        return true;
      }

      // A 4ms phase allowance absorbs callback jitter while the 24ms floor
      // prevents a second draw near 16ms; reset after a long pause instead of
      // carrying missed periods forward or trying to catch up in a draw loop.
      if (at < due - EARLY_TOLERANCE || at - last < MINIMUM_GAP) return false;

      last = at;
      due += PERIOD;
      if (due < at - PERIOD) due = at + PERIOD;
      return true;
    }

    return Object.freeze({ reset, shouldDraw });
  }

  return Object.freeze({ create: Object.freeze(create) });
});
