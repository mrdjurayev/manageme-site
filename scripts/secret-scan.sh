#!/usr/bin/env bash

set -euo pipefail

MODE="${1:-}"

if [[ "$MODE" != "staged" && "$MODE" != "tracked" ]]; then
  echo "Usage: scripts/secret-scan.sh [staged|tracked]"
  exit 2
fi

has_secret_pattern() {
  rg --quiet --pcre2 --no-messages \
    -e 'sk-proj-[A-Za-z0-9_-]{20,}' \
    -e 'sk-[A-Za-z0-9]{20,}' \
    -e 'sb_secret_[A-Za-z0-9_-]{20,}' \
    -e 'OPENAI_API_KEY\s*=\s*["'"'"']?sk-[A-Za-z0-9_-]{20,}' \
    -e 'SUPABASE_SERVICE_ROLE_KEY\s*=\s*["'"'"']?[A-Za-z0-9._-]{20,}' \
    -e 'APP_LOGIN_PASSWORD\s*=\s*["'"'"']?[^\s"'"'"']{8,}' \
    -e 'UPSTASH_REDIS_REST_TOKEN\s*=\s*["'"'"']?[^\s"'"'"']{20,}'
}

is_forbidden_env_file() {
  local file="$1"
  [[ "$file" == .env* && "$file" != ".env.example" ]]
}

has_issue=0

if [[ "$MODE" == "staged" ]]; then
  files=()
  while IFS= read -r file; do
    files+=("$file")
  done < <(git diff --cached --name-only --diff-filter=ACMR)

  if [[ ${#files[@]} -eq 0 ]]; then
    exit 0
  fi

  for file in "${files[@]}"; do
    if is_forbidden_env_file "$file"; then
      echo "Blocked: do not commit env file '$file'."
      has_issue=1
      continue
    fi

    if ! git cat-file -e ":$file" 2>/dev/null; then
      continue
    fi

    if git show ":$file" | has_secret_pattern; then
      echo "Blocked: secret-like value detected in staged file '$file'."
      has_issue=1
    fi
  done
fi

if [[ "$MODE" == "tracked" ]]; then
  files=()
  while IFS= read -r file; do
    files+=("$file")
  done < <(git ls-files)

  if [[ ${#files[@]} -eq 0 ]]; then
    exit 0
  fi

  for file in "${files[@]}"; do
    if is_forbidden_env_file "$file"; then
      echo "Blocked: tracked env file '$file' is not allowed."
      has_issue=1
      continue
    fi

    if [[ "$file" == ".env.example" ]]; then
      continue
    fi

    if has_secret_pattern < "$file"; then
      echo "Blocked: secret-like value detected in tracked file '$file'."
      has_issue=1
    fi
  done
fi

if [[ "$has_issue" -eq 1 ]]; then
  echo "Push/commit stopped to protect secrets."
  echo "Rotate leaked keys and keep real values only in .env.local or Vercel env vars."
  exit 1
fi

exit 0
