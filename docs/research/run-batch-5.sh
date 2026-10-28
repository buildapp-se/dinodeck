#!/bin/bash
# Two research jobs at once: Triassic and Jurassic in one, Cretaceous in the other, so they never pick the same animal.
cd /c/dev/dinodeck || exit 1
job() {
  codex --search exec --skip-git-repo-check -s workspace-write -C /c/dev/dinodeck \
    "Read docs/research/BRIEF-batch-5.md and carry it out exactly. Your file: docs/research/batch-5$1.md. Your periods: $2." \
    < /dev/null >> "docs/research/batch-5$1.log" 2>&1
  echo "batch-5$1 exit $? $(grep -c "^## [0-9]" docs/research/batch-5$1.md 2>/dev/null) animals"
}
job a "Triassic and Jurassic" &
job b "Cretaceous" &
wait
