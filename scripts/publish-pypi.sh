#!/bin/bash
set -euo pipefail

[ -n "${1:-}" ] && cd $1

[ -z "${TWINE_USERNAME:-}" ] && {
  echo "Missing TWINE_USERNAME"
  exit 1
}

[ -z "${TWINE_PASSWORD:-}" ] && {
  echo "Missing TWINE_PASSWORD"
  exit 1
}

if [ -z "$(ls *.whl)" ]; then
  echo "cannot find any .whl files in $PWD"
  exit 1
fi

python3 -m pip install --user --upgrade twine
python3 -m twine upload --skip-existing *
