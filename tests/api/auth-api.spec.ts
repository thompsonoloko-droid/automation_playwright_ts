/**
 * API tests for authentication endpoints (API 7–10).
 *
 * Converted from tests/api/test_auth_api.py.
 */

import { test, expect } from "@playwright/test";

import { BASE_URL, loadApiConfig, loadTestData, resolveEnv } from "./helpers";

const email = process.env.TEST_USER_EMAIL ?? "";
const password = process.env.TEST_USER_PASSWORD ?? "";
const apiCfg = loadApiConfig();
const testData = loadTestData();

test.describe("Verify Login API @api @login", () => {
  const validUsers = testData.users.filter((u) => u.valid);

  for (const user of validUsers) {
    test(`valid login — ${user.id}`, async ({ request }) => {
      test.skip(!email || !password, "TEST_USER_EMAIL / TEST_USER_PASSWORD not set");

      const response = await request.post(`${BASE_URL}/verifyLogin`, {
        form: { email, password },
      });
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.responseCode).toBe(200);
    });
  }

  test("login without email returns 400", async ({ request }) => {
    const response = await request.post(`${BASE_URL}/verifyLogin`, {
      form: { password: "SomePassword123" },
    });
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.responseCode).toBe(400);
    expect(data.message.toLowerCase()).toContain("parameter");
  });

  test("DELETE /verifyLogin returns 405", async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/verifyLogin`);
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.responseCode).toBe(405);
    expect(data.message.toLowerCase()).toContain("not supported");
  });

  const invalidAttempts = apiCfg.invalid_login_attempts ?? [];

  for (const attempt of invalidAttempts) {
    test(`invalid login — ${attempt.id}`, async ({ request }) => {
      const response = await request.post(`${BASE_URL}/verifyLogin`, {
        form: {
          email: resolveEnv(attempt.email),
          password: attempt.password,
        },
      });
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.responseCode).toBe(attempt.expected_code);
      expect(data.message.toLowerCase()).toContain(attempt.expected_message.toLowerCase());
    });
  }
});
