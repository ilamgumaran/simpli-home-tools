<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Research register and reproducible reasoning

Access/review date: **2026-10-18 UTC**. This register distinguishes retrieved evidence, our calculations, design hypotheses and blocked research. It is not a completed prior-art search or physical feasibility report. Source text, vendor art, PDFs and private browser captures are not copied into the product.

## Sources actually retrieved and read

| ID | Source and pinned revision | Evidence used | Limits |
| --- | --- | --- | --- |
| R1 | CPython [calendar documentation](https://github.com/python/cpython/blob/9380527fb3e2bbd69b3868473324fa0de0e63212/Doc/library/calendar.rst), branch 3.14, commit `9380527fb3e2bbd69b3868473324fa0de0e63212` | Opening calendar convention: the module uses the proleptic Gregorian calendar. `isleap` documentation states the boolean result; the exact divisibility rule is in R2. Retrieved through the project's raw GitHub host, HTTP 200. | A software/calendar reference, not evidence for a physical calendar mechanism or UTC synchronization. |
| R2 | CPython [calendar implementation](https://github.com/python/cpython/blob/9380527fb3e2bbd69b3868473324fa0de0e63212/Lib/calendar.py), same commit, `isleap()` | Exact predicate: divisible by 4, excluding centuries unless divisible by 400. Used as an independent reference for calendar arithmetic. HTTP 200. | Does not validate cam geometry, manufacture or mechanical indexing. |
| R3 | IANA tz project's [theory and pragmatics](https://github.com/eggert/tz/blob/48e835949dac7c3d1e13408392fd41492052e095/theory.html), commit `48e835949dac7c3d1e13408392fd41492052e095`, “Accuracy of the tz database” | Future predictions become wrong when governments change rules. The document explicitly says the database is not authoritative and can contain errors. HTTP 200. | Neither a static calendar nor a permanent cam can guarantee future civil-time legislation. National standards remain relevant. |
| R4 | tz [leap-seconds.list](https://github.com/eggert/tz/blob/48e835949dac7c3d1e13408392fd41492052e095/leap-seconds.list), same commit, introductory responsibility/validity sections | The file describes external IERS decisions and an expiration/update process. HTTP 200. | A retrieved snapshot is not a current IERS bulletin or a prediction of future leap-second policy. Do not embed the list as a promise of future accuracy. |

Pinned raw downloads were also fetched successfully. Local provenance/response checksums live outside Git in `/workspace/.onboarding/engineering-research/verified-reference-manifest.json`. The Git links above let another session inspect the exact references without that private workspace. A first attempt at tz `leapseconds` returned 404; the actual reviewed source was `leap-seconds.list`.

## Target sources not yet verified

Manufacturer and institutional HTTPS requests encountered proxy CONNECT **403 Forbidden**. No page content from these targets was read, so none supports a factual citation or specification here. Some candidate URLs may need correction after access is available.

| ID | Target | Research needed |
| --- | --- | --- |
| P1 | [New Way air-bearing FAQ](https://www.newwayairbearings.com/air-bearings/air-bearing-faq/) | Confirm external supply, flow/load tradeoffs, filtration/drying, air-loss behavior and lifecycle data for a specific bearing family. |
| P2 | [HYDAC accumulator catalog candidate](https://www.hydac.com/en-us/products/accumulator-technology/accumulators/bladder-accumulators.html) | Confirm accumulator types, seal/precharge/service requirements and manufacturer-defined duty limitations. |
| P3 | [Parker accumulator service manual candidate](https://www.parker.com/content/dam/Parker-com/Literature/Accumulator-and-Cooler-Division/Service-Manuals/MSG10-4000-UK.pdf) | Verify the actual manual, product applicability, inspection conditions and replacement requirements before quoting it. |
| P4 | [Long Now Clock technology](https://longnow.org/clock/technology/) | Study long-duration clock architecture, energy, access and maintainability; compare rather than claim equivalent longevity. |
| P5 | [US Naval Observatory calendar FAQ](https://aa.usno.navy.mil/faq/calendars) | Independent institutional confirmation of calendar conventions and correction limits. |
| P6 | [NIST time/frequency glossary candidate](https://www.nist.gov/pml/time-and-frequency-division/popular-links/time-frequency-z/time-and-frequency-z-c) and [BIPM publications](https://www.bipm.org/en/publications) | Oscillator performance, accuracy/stability definitions and time-scale limits. BIPM is a queued target, not a successfully retrieved source. |

The Long Now GitHub account's repository list was retrieved, but no physical-clock design repository was found there; an unrelated watch-face repository is not mechanical evidence. Additional research on escapement/pallet geometry, remontoire prior art, air-bearing power budgets, metallurgy, lubrication, seal aging and actual long-duration testing remains open. No mechanism is certified or novel because it appears in this plan.

The reusable environment draft preserves existing network rules and adds only `www.newwayairbearings.com`, `www.hydac.com`, `www.parker.com`, `longnow.org`, `aa.usno.navy.mil`, `www.nist.gov` and `www.bipm.org`. Saving a draft does not activate it. Publish it in Environment Settings before retrying those references; an allowed domain will not itself prove an individual URL or document is valid.

## Independent calculations

These are arithmetic/first-principles checks, not measured hardware performance or application test passes.

**Gear kinematics.** A driver with `z1` teeth and driven wheel with `z2` has ideal speed ratio `−z1/z2` for external gearing. Two meshes restore the direction. Proposed compound reductions `(20/120)×(20/200)=1/60` and `(20/120)×(20/80)=1/24` yield a 1-revolution/hour minute arbor and 1-revolution/day arbor from a 1-revolution/minute seconds arbor. Overall reduction is `1/1440`. Tooth counts alone do not prove contact ratio, tooth strength, backlash, packaging or efficiency. The independent verifier also checked equivalent 10-tooth examples; the plan uses 20-tooth pinions to avoid casually treating tiny pinions as manufacturable without a tooth-form study.

**Escapement convention.** A 2-second full pendulum period gives 60 half-swing beats/minute. Our proposed 30-tooth escape wheel advances half a tooth (6°) per beat, or one tooth per two alternating releases: one revolution/minute. This is a design convention to validate in pallet geometry. If a design instead advances one full tooth per beat, it needs 60 teeth for the same speed. Never mix these assumptions.

**Gregorian cycle.** `leap(y) = y%4 == 0 and (y%100 != 0 or y%400 == 0)`. A 400-year cycle contains `100−4+1 = 97` leap years, `146097` days and `20871` weeks. Independent Python calendar/datetime arithmetic checked the 2000→2400 interval and 1900/2000/2100/2400 February behavior. A four-year cam alone is insufficient for automatic century handling.

**Energy and accuracy.** Use `W=∫τ dθ`, `P=τω`, `Eweight=mgh`, `Eflywheel=Iω²/2`, `Espring=kx²/2` for an ideal linear spring, and `Ehydraulic=∫p dV` for specified pressure/displacement. Do not count both fluid transfer and its lifted weight as two stores. With `g=9.81 m/s²`, an illustrative 1 kg mass falling 1 m releases 9.81 J ideally. At an assumed total load of 10 µW that lasts 11.354 days; at 1 mW, 2.725 hours. Neither load is measured or an achievable specification for this design. At 10 µW, 100 Gregorian mean years would require about 31.56 kJ before losses; low friction does not create an infinite reserve. A 1 ppm rate error accumulates 0.0864 seconds/day and 31.557 seconds/mean year. No accuracy or autonomy target is established by these examples.

## Research exit gates

1. Retrieve P1–P6 or clearly identify equivalent authoritative sources. Record exact version, section, access date, relevant claim and what it does not prove.
2. Draw the escapement and each indexer with collision-free, dimensioned contacts; review actual tooth/pallet/cam geometry with a horological/mechanical specialist before treating it as a physical candidate.
3. Measure or obtain defensible loss, load, air-flow and leakage inputs. Publish an energy ledger and service assumptions; use uncertainty ranges rather than invented efficiencies.
4. Search prior art for this arrangement and its parts. Describe only our composition unless novelty is established separately.
5. Physical accuracy/longevity claims require prototypes, calibration, environmental/duty testing and a documented service model. Browser animation and accelerated calendar arithmetic cannot provide centuries of wear evidence.
