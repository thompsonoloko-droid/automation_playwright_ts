# Contributing to automation_playwright_ts

Thank you for your interest in contributing! This guide will help you get started.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Writing Tests](#writing-tests)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/<your-username>/automation_playwright_ts.git
   cd automation_playwright_ts
   ```
3. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

### Prerequisites

- **Node.js** 20+
- **npm** 10+

### Installation

```bash
npm install
npx playwright install --with-deps
```

### Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

> **Important:** Never commit the `.env` file. It is git-ignored.

### Verify Setup

```bash
npm run quality        # TypeScript check + ESLint + Prettier
npm run test:smoke     # Run smoke tests
```

## Code Style

### Formatting & Linting

- **Prettier** for code formatting (100 char line width, semicolons, double quotes)
- **ESLint** with `typescript-eslint` for static analysis
- **TypeScript** strict mode enabled

Run the quality checks before committing:

```bash
npm run quality
```

Auto-fix issues:

```bash
npm run lint:fix
npm run format
```

### Naming Conventions

| Element    | Convention       | Example              |
| ---------- | ---------------- | -------------------- |
| Files      | kebab-case       | `product-page.ts`    |
| Classes    | PascalCase       | `ProductPage`        |
| Methods    | camelCase        | `addProductToCart()` |
| Constants  | UPPER_SNAKE_CASE | `BUTTON_ADD_TO_CART` |
| Test files | `*.spec.ts`      | `smoke.spec.ts`      |
| Test tags  | `@tag` in title  | `"test name @smoke"` |

### Page Object Guidelines

1. **Extend `BasePage`** — all page objects must inherit from `BasePage`
2. **Locators as readonly properties** — define selectors in the constructor or as class fields
3. **One method per action** — keep methods focused on a single user interaction
4. **Return types** — always specify return types on methods
5. **JSDoc comments** — add documentation for public methods

```typescript
import { type Page } from "@playwright/test";
import { BasePage } from "./base-page";

export class ExamplePage extends BasePage {
  private readonly submitButton = this.page.locator("button[type='submit']");

  constructor(page: Page) {
    super(page);
  }

  async submitForm(): Promise<void> {
    await this.submitButton.click();
  }
}
```

## Writing Tests

### Test Structure

```typescript
import { test } from "../../fixtures";
import { expect } from "@playwright/test";

test.describe("Feature Name", () => {
  test("should do something @smoke @regression", async ({ homePage }) => {
    // Arrange — set up preconditions
    // Act — perform the action
    // Assert — verify the outcome
  });
});
```

### Test Guidelines

- **Use custom fixtures** from `fixtures.ts` for page objects
- **Tag tests** with `@smoke`, `@regression`, `@cart`, `@login`, etc.
- **Keep tests independent** — no test should depend on another
- **One assertion concept per test** when practical
- **Use test data** from `test_data/test_data.json` or `.env` for credentials
- **Never hardcode credentials** — use environment variables via `dotenv`

### Running Tests

```bash
npm test                  # All tests, all browsers
npm run test:smoke        # Smoke tests only
npm run test:ui           # UI tests only
npm run test:api          # API tests only
npm run test:chromium     # Single browser
npm run test:headed       # Watch tests execute
```

## Pull Request Process

### Branch Naming

Use descriptive branch names:

- `feature/add-search-tests`
- `fix/cart-flaky-test`
- `refactor/checkout-page-object`
- `docs/update-readme`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add product search test suite
fix: resolve flaky cart test on Firefox
refactor: extract shared login helper
docs: update contributing guidelines
chore: update Playwright to 1.59
```

### PR Checklist

Before submitting:

- [ ] `npm run quality` passes (typecheck + lint + format)
- [ ] All existing tests pass (`npm test`)
- [ ] New tests added for new functionality
- [ ] Page objects follow `BasePage` pattern
- [ ] No credentials or secrets in code
- [ ] Branch is up-to-date with `develop`

### Review Process

1. Open a PR against the `develop` branch
2. CI checks must pass (see `.github/workflows/pr-checks.yml`)
3. At least one approving review required
4. Squash-merge preferred for clean history

## Reporting Issues

### Bug Reports

Include:

- **Steps to reproduce** — exact commands or actions
- **Expected behavior** — what should happen
- **Actual behavior** — what actually happens
- **Environment** — OS, Node.js version, browser
- **Logs/screenshots** — terminal output or failure screenshots

### Feature Requests

Include:

- **Use case** — why this feature is needed
- **Proposed solution** — how you'd approach it
- **Alternatives considered** — other approaches you evaluated

## Questions?

- Review existing tests in `tests/` for examples
- Check the [README](README.md) for project overview
- Open a GitHub issue for discussion
