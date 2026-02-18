# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-17

### Added

- **Page Object Model architecture** with `BasePage`, `HomePage`, `LoginPage`, `ProductPage`, `CartPage`, `CheckoutPage`, `PaymentPage`
- **Custom Playwright fixtures** with automatic ad-blocking across all page fixtures
- **UI test suites**: smoke tests, login tests (data-driven), end-to-end payment flow
- **API test suites**: authentication, products, brands, user management
- **Data-driven testing** via `test_data/test_data.json` and environment variables
- **Multi-browser support**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **CI/CD pipelines** (GitHub Actions on Windows):
  - `ci-cd.yml` — full pipeline with lint, multi-browser tests, and notifications
  - `pr-checks.yml` — PR validation with commit checks and smoke tests
  - `scheduled-smoke-tests.yml` — health monitoring every 6 hours
  - `manual-test-run.yml` — on-demand test execution with configurable parameters
- **ESLint** with `typescript-eslint` and Prettier integration
- **Prettier** for consistent code formatting
- **TypeScript strict mode** with complete type checking
- `.env.example` for credential templates
- Comprehensive `README.md`, `CONTRIBUTING.md`, and `LICENSE`

### Fixed

- Ad-blocking (`blockAds()`) now applied to all page fixtures, not just `homePage`
- Product detail page handles Cloudflare 520/503 server errors with retry logic
- Consent dialog no longer blocks test interactions across browsers

### Security

- Real credentials removed from `.env.example` (replaced with placeholders)
- `.env` file git-ignored to prevent credential leaks
- GitHub Actions pinned to commit SHAs for supply-chain security
