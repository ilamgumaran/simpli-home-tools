# Message title

- Message ID: `thread-id/NNN`
- Date: `YYYY-MM-DD`
- From: session role
- To: receiving session role
- Status: ready for pickup / acknowledged / results ready / blocked / completed
- Repository branch: branch carrying this message
- Work or tested revision: exact Git SHA; distinguish runtime from documentation-only updates
- Related message: relative link to the previous message, if any

## Request and context

State the owner's request, what the receiver should do and the relevant product/handoff links. Separate completed work from proposals.

## Published work and verification

List the artifacts, source changes and checks actually completed. Include a build checksum when identifying an installable artifact. Say explicitly when a check has not run; do not pre-fill successful results.

## Results or blockers

For device testing, record browser/version, viewport, display scaling, relevant settings, expected versus observed behavior and reproducible failures. Include only non-private information. If replying before testing, state what remains pending.

## Next action

Name the receiving role, the requested follow-up and the reply filename. Include any existing constraints, such as preserving local profiles or requiring owner approval for merge/release.
