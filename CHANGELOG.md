# Changelog

All notable changes to MakeSense are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions loosely
track the development milestone rather than a strict semver release cadence.

## [Unreleased]

### Added

- Personal finance layer: salary, savings goal, income vs expenses, and
  emergency fund calculators with dedicated landing pages under
  `/personal-finance`.
- Guides section: three plain-language articles (`/guides`) covering startup
  runway, revenue estimation from public signals, and LTV:CAC.
- PWA install button with iOS "Add to Home Screen" instructions in the site
  footer, plus a savings-goal app shortcut.
- Mobile navigation menu for the marketing site header.
- Professional repository tooling: `.editorconfig`, `.env.example`,
  `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`.

### Changed

- Site header nav now leads with Calculators, Personal finance, and Guides.
- Homepage calculator section is now a two-sided hub: money vs business.
- Manifest and service worker updated for the broader money + business
  positioning (cache bumped to `makesense-v2`).
- Sitemap and `llms.txt` now index the personal finance pages.
- Public copy normalized: no em dashes or en dash range separators.

## [2026-08-23]

### Added

- Google Search Console verification and AdSense configuration.

## [2026-08-22]

### Added

- `metadataBase`, absolute-URL sitemap, and BreadcrumbList schema across
  calculator pages.
- Calculators, manual, and exit links in the app shell; quick-edit assumptions
  actions and an inputs summary banner.
- Deterministic model seeding with an in-flight hydration lock.
- Landing page redesign: interactive showcase preview, live math sandbox,
  craft badge, and scroll reveals.
- Full PWA icons and shortcuts, AI-crawler robots rules, `llms.txt`,
  breadcrumb schema, and shared site chrome on calculators.
- Award-level landing, footer/header chrome, legal pages, manual, calculators
  hub, custom cursor and context menu, branded 404/error/loading states.
- Offline service worker, keyboard navigation shortcuts, JSON-LD structured
  data, OG image, command palette, PWA manifest, printable per-model reports,
  currency tab, sensitivity analysis, and twelve standalone calculator pages.

## [2026-08-21] and earlier

### Added

Initial build-out of the domain engine, workspace tabs, theming, persistence,
scenario/analysis/financing/currency features, and supporting documentation.
See `docs/TRACKER.md` for the phase-by-phase history.