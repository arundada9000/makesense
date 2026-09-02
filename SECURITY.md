# Security Policy

MakeSense is a local-first application: no account, no backend, and no
financial data ever leaves the browser. That drastically narrows the attack
surface, but issues are still possible in the client bundle, dependencies, and
the code we ship.

## Reporting a vulnerability

Do not open a public issue for security findings. Report privately instead.

- Email: arunneupane0000@gmail.com
- Subject prefix: `[MakeSense Security]`

Please include:

- A description of the issue and its potential impact.
- Steps to reproduce, with a minimal example if possible.
- Affected versions or commit hashes.
- Suggested fix, if you have one.

You will receive an acknowledgement within 3 business days, and we aim to
confirm the issue and its severity within 10 business days. We credit
researchers for confirmed, fixed vulnerabilities unless they prefer to stay
anonymous.

## Scope

In scope:

- Client-side data isolation (indexedDB usage, storage leakage).
- Injection flaws reachable through user input (URL params, imported JSON).
- XSS in rendered content, including any search-engine/AI-consumed output.
- Supply-chain issues in direct dependencies.

Out of scope (by design):

- DNS, hosting, or Vercel platform issues.
- Social engineering or phishing aimed at the maintainer.

## Security best practices for contributors

- Never commit secrets, API keys, or real user data.
- Validate any external input that flows into state: `docs/` import and URL
  parameters must be shape-checked before use.
- Keep dependencies current; bump lockfiles in focused commits.