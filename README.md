# Playwright TypeScript Test Automation Framework

Production-ready Playwright + TypeScript based test automation framework for e-commerce testing with comprehensive Page Object Model (POM) architecture, data-driven testing, CI/CD (Windows) integration and advanced reporting.

## Tech Stack

- **TypeScript** 5.9+ — Type-safe test code
- **Playwright** 1.58+ — Cross-browser automation (Chromium, Firefox, WebKit)
- **Node.js** 20+ — Runtime
- **ESLint + Prettier** — Code quality and formatting
- **GitHub Actions** — CI/CD on Windows runners

## Repository Structure

```
automation_playwright_ts/
├── fixtures.ts                  # Custom Playwright fixtures (ad-blocking, page objects)
├── playwright.config.ts         # Playwright configuration
├── tsconfig.json                # TypeScript configuration
├── eslint.config.mjs            # ESLint flat config
├── .prettierrc                  # Prettier formatting rules
├── pages/                       # Page Object Models (POM)
│   ├── base-page.ts             # Base class — shared helpers (click, fill, getText)
│   ├── home-page.ts             # Homepage navigation
│   ├── login-page.ts            # Login and registration forms
│   ├── product-page.ts          # Product listing and detail pages
│   ├── cart-page.ts             # Shopping cart
│   ├── checkout-page.ts         # Order checkout
│   ├── payment-page.ts          # Payment and confirmation
│   └── index.ts                 # Barrel exports
├── tests/
│   ├── ui/                      # UI/E2E tests
│   │   ├── smoke.spec.ts        # Critical-path smoke tests
│   │   ├── login.spec.ts        # Data-driven login tests
│   │   └── payment.spec.ts      # End-to-end order flow
│   └── api/                     # API tests
│       ├── helpers.ts            # Shared API constants and utilities
│       ├── auth-api.spec.ts      # Authentication endpoints
│       ├── brands-api.spec.ts    # Brands endpoints
│       ├── product-api.spec.ts   # Products endpoints
│       └── user-api.spec.ts      # User CRUD endpoints
├── utils/
│   └── api-utils.ts             # Reusable REST client wrapper
├── test_data/
│   └── test_data.json           # Non-sensitive test data
├── .github/workflows/           # CI/CD pipelines
│   ├── ci-cd.yml                # Full pipeline (push, PR, schedule, manual)
│   ├── pr-checks.yml            # Pull request validation
│   ├── scheduled-smoke-tests.yml # Health monitoring (every 6 hours)
│   └── manual-test-run.yml      # On-demand test runs
└── reports/                     # Generated reports (git-ignored)
```

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Git](https://git-scm.com/)

### Setup

```bash
# Clone the repository
git clone https://github.com/thompsonoloko-droid/automation_playwright_ts.git
cd automation_playwright_ts

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps

# Copy environment file and fill in credentials
cp .env.example .env
# Edit .env with your test credentials
```

### Running Tests

```bash
# Run all tests (all browsers)
npm test

# Run specific suites
npm run test:smoke        # Smoke tests only
npm run test:ui           # UI tests only
npm run test:api          # API tests only

# Run on specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run headed (visible browser)
npm run test:headed

# Run specific test file
npx playwright test tests/ui/smoke.spec.ts

# Run by tag
npx playwright test --grep @cart
npx playwright test --grep @login
```

### Debugging

```bash
# Playwright Inspector (step-through debugger)
npx playwright test --debug

# Interactive UI mode
npx playwright test --ui

# Headed with slow motion
npx playwright test --headed --project=chromium

# Capture traces for all tests
npx playwright test --trace on
npx playwright show-trace test-results/.../trace.zip
```

### Reports

```bash
# Open HTML report from last run
npm run report

# Generate with specific reporter
npx playwright test --reporter=list     # Verbose terminal output
npx playwright test --reporter=html     # HTML report
```

### Code Quality

```bash
# Run all quality checks
npm run quality

# Individual checks
npm run typecheck          # TypeScript compilation
npm run lint               # ESLint
npm run lint:fix           # ESLint with auto-fix
npm run format             # Prettier format
npm run format:check       # Prettier check only
```

## Project Architecture

### Page Object Model (POM)

All page objects extend `BasePage`, which provides:

- **`click(selector)`** — Click with automatic retry and overlay dismissal
- **`fill(selector, text)`** — Fill input with overlay recovery
- **`getText(selector)`** — Get trimmed text content
- **`waitForElement(selector)`** — Wait for visibility
- **`dismissOverlays()`** — Remove consent banners and ad overlays
- **`takeScreenshot(name)`** — Capture page screenshot

```typescript
import { BasePage } from "./base-page";

export class YourPage extends BasePage {
  readonly SUBMIT_BTN = "button[type='submit']";
  readonly EMAIL_INPUT = "input[name='email']";

  async fillEmail(email: string): Promise<void> {
    await this.fill(this.EMAIL_INPUT, email);
  }

  async submit(): Promise<void> {
    await this.click(this.SUBMIT_BTN);
  }
}
```

### Custom Fixtures

Tests use custom fixtures from `fixtures.ts` that provide:

- **Ad/consent blocking** — Routes blocked before page loads
- **Pre-initialised page objects** — `homePage`, `loginPage`, `productPage`, `cartPage`, `checkoutPage`, `paymentPage`

```typescript
import { test, expect } from "../../fixtures";

test("example", async ({ homePage, loginPage, page }) => {
  await homePage.navigateToLogin();
  await loginPage.login("user@test.com", "password");
  await expect(page.getByText("Logged in as")).toBeVisible();
});
```

### Test Tags

Tests are tagged using Playwright's `@tag` convention in test titles:

| Tag           | Description           |
| ------------- | --------------------- |
| `@smoke`      | Critical-path tests   |
| `@regression` | Full regression suite |
| `@api`        | API tests             |
| `@login`      | Login-specific tests  |
| `@cart`       | Cart-specific tests   |
| `@checkout`   | Checkout/payment flow |

### Data-Driven Testing

Non-sensitive test data is stored in `test_data/test_data.json`. Sensitive credentials are loaded from environment variables (`.env` file locally, GitHub Secrets in CI).

## Environment Variables

Create a `.env` file from `.env.example`:

```dotenv
# Valid user login (automationexercise.com)
TEST_USER_NAME=Your Name
TEST_USER_EMAIL=your-email@example.com
TEST_USER_PASSWORD=your-password

# Payment card details (test values only)
CARD_NAME=Your Name
CARD_NUMBER=4444333322221111
CARD_CVC=000
CARD_EXPIRY_MONTH=12
CARD_EXPIRY_YEAR=2030
```

> **Security:** `.env` is git-ignored. Never commit real credentials.

## CI/CD Pipelines

All workflows run on **Windows** (`windows-latest`).

| Workflow                    | Trigger                 | Purpose                                                          |
| --------------------------- | ----------------------- | ---------------------------------------------------------------- |
| `ci-cd.yml`                 | Push, PR, daily, manual | Full pipeline — lint, multi-browser tests, mobile, notifications |
| `pr-checks.yml`             | Pull requests           | Commit validation, TypeScript check, Chromium smoke tests        |
| `scheduled-smoke-tests.yml` | Every 6 hours           | Continuous health monitoring (Chromium + Firefox)                |
| `manual-test-run.yml`       | Manual dispatch         | On-demand runs with suite/browser/retry selection                |

### Required GitHub Secrets

Set in **Settings > Secrets and variables > Actions > Repository secrets**:

| Secret               | Description                      |
| -------------------- | -------------------------------- |
| `TEST_USER_NAME`     | Test account display name        |
| `TEST_USER_EMAIL`    | Test account email               |
| `TEST_USER_PASSWORD` | Test account password            |
| `CARD_NAME`          | Test payment card name           |
| `CARD_NUMBER`        | Test payment card number         |
| `CARD_CVC`           | Test payment card CVC            |
| `CARD_EXPIRY_MONTH`  | Card expiry month                |
| `CARD_EXPIRY_YEAR`   | Card expiry year                 |
| `SLACK_WEBHOOK_URL`  | _(Optional)_ Slack notifications |

## Browser Support

| Browser            | Project Name    | Engine   |
| ------------------ | --------------- | -------- |
| Chrome             | `chromium`      | Chromium |
| Firefox            | `firefox`       | Firefox  |
| Safari             | `webkit`        | WebKit   |
| iPhone 13 (mobile) | `mobile-chrome` | Chromium |
| iPhone 13 (mobile) | `mobile-safari` | WebKit   |

## Best Practices

### Do

- Inherit all page objects from `BasePage`
- Use explicit waits (`waitForElement()`) instead of `sleep()`
- Add type annotations to all functions
- Add JSDoc comments to public methods
- Use test tags (`@smoke`, `@regression`, etc.)
- Store test data in `test_data.json`
- Run `npm run quality` before committing
- Keep tests atomic and independent

### Don't

- Hardcode credentials in test files
- Commit `.env` to git
- Use `page.waitForTimeout()` for synchronisation (only for intentional delays)
- Create page objects without extending `BasePage`
- Skip type annotations or documentation

## Adding New Tests

1. Create page object in `pages/` (if needed) extending `BasePage`
2. Add test file in `tests/ui/` or `tests/api/`
3. Import fixtures: `import { test, expect } from "../../fixtures"`
4. Add test data to `test_data.json` if data-driven
5. Add appropriate tags (`@smoke`, `@regression`, etc.)
6. Run `npm run quality` and `npm test` before committing

## Dependencies

| Package                  | Purpose                                          |
| ------------------------ | ------------------------------------------------ |
| `@playwright/test`       | Test framework and browser automation            |
| `typescript`             | Type-safe JavaScript                             |
| `@types/node`            | Node.js type definitions                         |
| `dotenv`                 | Environment variable loading                     |
| `eslint`                 | Code linting                                     |
| `typescript-eslint`      | TypeScript ESLint rules                          |
| `prettier`               | Code formatting                                  |
| `eslint-config-prettier` | Disable ESLint rules that conflict with Prettier |

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
