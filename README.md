# Public Actions Lab

A small, **synthetic-only** GitHub Actions diagnostic laboratory. It contains no private application, account information, music library, repository history or credentials.

## What it tests

The `Public synthetic smoke` workflow attempts to start a GitHub-hosted Ubuntu runner, checks an allowlist of files and basic secret signatures, then runs six unit tests using made-up task identifiers.

## Run

- CI: open the repository's **Actions** tab and select `Public synthetic smoke`.
- Local: `node scripts/check-public-safe.mjs` and `node --test` (Node 22 recommended).

No npm packages, tokens, secrets, production endpoints or external connections are required.

## Limits

A successful public runner **does not prove** GitHub Actions will work in private repositories, nor does it validate any private application's behavior, security or deployment. This repository is intentionally not integrated with private workflows.

## Public safety contract

Only these six files may be present:

- `README.md`
- `.github/workflows/public-smoke.yml`
- `fixtures/sample.json`
- `scripts/check-public-safe.mjs`
- `src/validator.mjs`
- `test/validator.test.mjs`

Never copy anything else here or include personal records, real music data, application files, tokens, private commits, backups or Git history. The checker is a supplementary guard, not a proof of privacy.

## Synthetic cross-area contract (expanded lab, 2026-10-23)

Eight extra tests use **made-up goal IDs, opportunity records, question references and unknown progress** to exercise generic integrity rules: projection equality, snapshot equality, deduplication and no fabricated completion. No real private repository is cloned, mounted, referenced by name, or granted a token. The public workflow can validate **this synthetic contract only**; separate authenticated GitHub checks are still required to validate actual private records. Public Actions cannot start or debug a private hosted runner by themselves. This setup never authorizes opening private repositories, hosting sensitive data or spending money.

**Results:** GitHub Actions > `Public synthetic smoke`. A passing run means the artificial validators worked; it is not an approval of any private Master Plan deployment.
