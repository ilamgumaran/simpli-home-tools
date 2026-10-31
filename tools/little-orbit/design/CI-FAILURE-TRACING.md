<!-- SPDX-License-Identifier: LicenseRef-Simpli-Noncommercial-1.0 -->
# Clock CI failure tracing

The hosted Windows/macOS failures need synchronized evidence before another
pacing or rendering change. [Ownership 029](../../../sessions/2026-10-10-weather-habitat/029-ci-trace-ownership.md)
starts this slice; [results 030](../../../sessions/2026-10-10-weather-habitat/030-ci-trace-results.md)
records actual outcomes. Application runtime `9993133` and the portable bytes
stay unchanged by these test tools. The p95/FPS/max-gap gates, 2100 ms samples,
settling periods, browser modes and navigation timeouts also stay unchanged.

## Capture

`tests/cadence-trace.cjs` installs a test-only wrapper before the real pacing
factory loads. It calls the original `create`, `shouldDraw` and `reset`; it
records original decisions rather than replaying an alternative policy. The
three measured suites are dashboard, immersive Woodland and Green House rain.

Each schema-1 JSONL record has source/helper provenance, browser/platform,
viewport/DPR, mode, hosted/portable form and exact ordered events:

| Field | Meaning |
| --- | --- |
| `native` | Independent RAF callback pairs: nominal timestamp and actual `performance.now()` entry |
| `app` | Policy ID, app RAF timestamp, actual policy-call entry, low-power flag and original acceptance decision |
| `geometryTimesMs` | Existing MutationObserver timestamps for changed geometry, before rounding |
| `geometryStartMs` / `geometryEndMs` | The original acceptance sample's actual interval |
| `metrics` | The unchanged acceptance metrics computed by the test |
| `nativeColumns` / `appColumns` | Explicit tuple definitions |

Sampling starts inside the existing measurement and stops after its elapsed
interval is computed. File writes and notices happen afterward. The extra RAF
observer and timing calls can affect a borderline run; these are instrumented
measurements, not an assertion of zero overhead. DOM observation is not compositor
presentation. The VM's fake RAF queue is used only in unit tests of the helper;
real browser acceptance keeps real RAF, `performance.now()` and timers.

`tests/navigation-trace.cjs` wraps one original `page.goto(target)` in the
Time Climber II program. It records bounded request/load events and pending
requests. On failure it attempts a <=1500 ms readiness/resource snapshot, saves
it and rethrows the original error. It does not retry, change the default load
wait or extend the navigation timeout. Counts expose capped event/resource lists.
URLs omit query strings, and file URLs retain only the basename; headers,
cookies, environment dumps, profiles and screenshots are excluded.

## Persistence and recovery

Every sample appends to `test-results/clock-diagnostics.jsonl`, including successes.
The workflow uploads that file and `ci-run.log` as seven-day artifacts with
`if: always()`. It does not upload the whole test-results directory. On an
assertion/navigation failure, complete JSON is also base64-encoded into <=2400
character notice chunks. Their titles carry the record's trace ID and part count.
This fallback works when the log blob host denies downloads.

Fetch annotations without requesting a signed log URL:

```sh
gh api repos/ilamgumaran/simpli-home-tools/check-runs/CHECK_ID/annotations \
  --paginate --jq '.[]' > annotations.jsonl
node - annotations.jsonl recovered.jsonl <<'NODE'
const fs=require('node:fs');
const rows=fs.readFileSync(process.argv[2],'utf8').trim().split(/\r?\n/).filter(Boolean).map(JSON.parse);
const groups=new Map();
for(const row of rows){
 const match=/^([0-9a-f]{64}) (\d+)\/(\d+)$/.exec(row.title||'');
 if(!match)continue;
 const [id,i,n]=[match[1],Number(match[2]),Number(match[3])];
 const group=groups.get(id)||{n,parts:new Map()};
 if(group.n!==n||i<1||i>n)throw Error('Inconsistent chunk metadata');
 if(group.parts.has(i)&&group.parts.get(i)!==row.message)throw Error('Conflicting duplicate chunk');
 group.parts.set(i,row.message);groups.set(id,group);
}
const records=[];
for(const [id,group] of groups){
 if(group.parts.size!==group.n)throw Error('Incomplete trace '+id);
 const payload=Array.from({length:group.n},(_,i)=>group.parts.get(i+1)).join('');
 const record=JSON.parse(Buffer.from(payload,'base64').toString('utf8'));
 if(record.traceID!==id)throw Error('Trace identity mismatch');
 records.push(record);
}
if(!records.length)throw Error('No complete trace notices found');
fs.writeFileSync(process.argv[3],records.map(record=>JSON.stringify(record)).join('\n')+'\n');
NODE
```

Require all chunks; a truncated record must not become evidence. GitHub's
`push` and `pull_request` runs are separate experiments. Record their actual API
`event`, head revision and captured checkout revision; PR runs can use merge
commits. Do not infer the event from run-ID order.

## Analysis

```sh
node tools/little-orbit/tests/analyze-cadence-trace.cjs recovered.jsonl > analysis.json
```

The analyzer recomputes FPS, p95 at `floor(0.95 * gapCount)` and maximum from
unrounded geometry timestamps. It checks the recorded metrics, keeps native
and app sampling distinct, reports native timestamps missing from the app loop,
and shows surrounding events for each long geometry gap. It preserves malformed
input warnings and returns a failing exit for parse errors. Unknown modes do
not acquire invented normal-mode thresholds.

For the current policy, after an accepted low-power callback the next callback
at least `1000/30 - 4` ms later must be accepted; the 24 ms floor is also satisfied
then. The analyzer checks late rejections against this bound. It does not yet
flag accepted pairs below the 24 ms floor; inspect that separately. A raw trace
is needed to distinguish callback-delivery delay from nominal RAF gaps and
geometry-observer lag. No automatic root-cause claim follows from the summary.

Keep the original failed samples when later samples pass. If an interval's
available callbacks are too early for the current minimum and the next arrives
late, a render rewrite or tolerance adjustment is not established by that fact
alone. Compare native delivery with blank/hidden/full-art controls on the same
runner before choosing another production change. Required checks and physical
Ally/Vanadium acceptance remain separate.

The next [policy replay study](CADENCE-POLICY-REPLAY.md) uses these records
without predicting geometry or changing application pacing. It retains four
additional failures from the final tracing revision, including normal mode.
