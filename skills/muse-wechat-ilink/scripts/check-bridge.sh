#!/usr/bin/env bash
# check-bridge.sh: read-only health check for a muse-wechat-ilink deployment.
# Usage:
#   ILINK_DATA_DIR=/path/to/data ILINK_CLIENT=/path/to/ilink.py \
#   ILINK_HOOK_STATE_DIR=/path/to/hook-state ./check-bridge.sh
# Prints health, heartbeat age and recent proactive send results.
# Never prints message text, tokens, session contents or recipient ids:
# the audit log recipient field is stripped before printing.
set -euo pipefail

: "${ILINK_DATA_DIR:?set ILINK_DATA_DIR to the bridge data directory}"
: "${ILINK_CLIENT:?set ILINK_CLIENT to the ilink.py path}"
: "${ILINK_HOOK_STATE_DIR:?set ILINK_HOOK_STATE_DIR to the hook state directory}"

echo "== health =="
ILINK_DATA_DIR="$ILINK_DATA_DIR" python3 "$ILINK_CLIENT" health || true

echo "== heartbeat =="
if [ -f "$ILINK_HOOK_STATE_DIR/ilink-heartbeat" ]; then
  ls -l --time-style=full-iso "$ILINK_HOOK_STATE_DIR/ilink-heartbeat"
else
  echo "MISSING: no ilink-heartbeat file (hook never ran or state dir is wrong)"
fi

echo "== recent proactive sends (last 5 audit lines, results only, recipient redacted) =="
AUDIT="$ILINK_DATA_DIR/send_audit.jsonl"
if [ -f "$AUDIT" ]; then
  tail -n 5 "$AUDIT" | python3 -c "import sys, json
for line in sys.stdin:
    try:
        e = json.loads(line)
    except ValueError:
        continue
    print({k: e.get(k) for k in ('ts', 'direction', 'result', 'attempt', 'error') if k in e})"
else
  echo "MISSING: no send_audit.jsonl yet (no proactive send attempted)"
fi

echo "== contacts token age =="
CONTACTS="$ILINK_DATA_DIR/contacts.json"
if [ -f "$CONTACTS" ]; then
  ls -l --time-style=full-iso "$CONTACTS"
  echo "(If proactive sends fail with prepare failed and this file is ~4.5h old, ask the owner to send any WeChat message to refresh the context_token. See references/troubleshooting.md.)"
else
  echo "MISSING: no contacts.json yet (no inbound message cached a context_token)"
fi
