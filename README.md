# Public Actions Lab — synthetic tests only

This directory is a **standalone, public-safe repository starter**.
Its purpose is to verify whether GitHub-hosted Actions runners can execute in a
**separately created public repository**, without publishing private projects.

## What this repository can prove
- A public workflow can start a GitHub-hosted Linux runner.
- A simple, synthetic data validator behaves correctly.
- The public fixture has no dependency on any other repository or account.

## What it cannot prove
- Private repositories have available Actions minutes or working billing settings.
- A private workflow will run successfully.
- A private application, its data, or its production deployment has been tested.

## Setup
1. Create a NEW **public** repository with this directory's files at the repository root.
2. Verify there are **no extra files or history copied from private repositories**.
3. Push the public-safe files only. The workflow runs on pushes or manually.
4. Check Actions for success or runner-level failure.
5. Do not add real identities, messages, datasets, backups, credentials, URLs,
   reusable private workflows, or private repository access tokens.

## Running locally
`node scripts/check-public-safe.mjs`
`node --test`

Uses built-in Node.js APIs; no npm dependencies, connected apps or tokens.
The public runner diagnostic is independent from any private application.
