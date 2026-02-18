/**
 * API tests for user account CRUD (API 11–14).
 *
 * Converted from tests/api/test_user_api.py.
 */

import { test, expect } from "@playwright/test";

import { BASE_URL, USER_TEMPLATE, UPDATE_TEMPLATE, uniqueEmail } from "./helpers";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function createTestUser(
  request: import("@playwright/test").APIRequestContext,
  email: string,
  password?: string,
): Promise<Record<string, unknown>> {
  const pw = password ?? USER_TEMPLATE.password;
  const response = await request.post(`${BASE_URL}/createAccount`, {
    form: { ...USER_TEMPLATE, email, password: pw },
  });
  return await response.json();
}

async function deleteTestUser(
  request: import("@playwright/test").APIRequestContext,
  email: string,
  password?: string,
): Promise<Record<string, unknown>> {
  const pw = password ?? USER_TEMPLATE.password;
  const response = await request.delete(`${BASE_URL}/deleteAccount`, {
    form: { email, password: pw },
  });
  return await response.json();
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe("User Account API @api", () => {
  test("create user account", async ({ request }) => {
    const email = uniqueEmail();
    try {
      const data = await createTestUser(request, email);
      expect(data.responseCode).toBe(201);
    } finally {
      await deleteTestUser(request, email);
    }
  });

  test("delete user account", async ({ request }) => {
    const email = uniqueEmail();
    await createTestUser(request, email);

    const data = await deleteTestUser(request, email);
    expect(data.responseCode).toBe(200);
  });

  test("update user account", async ({ request }) => {
    const email = uniqueEmail();
    const pw = USER_TEMPLATE.password;
    try {
      await createTestUser(request, email, pw);

      const response = await request.put(`${BASE_URL}/updateAccount`, {
        form: { ...UPDATE_TEMPLATE, email, password: pw },
      });
      const data = await response.json();
      expect(data.responseCode).toBe(200);
    } finally {
      await deleteTestUser(request, email, pw);
    }
  });

  test("get user detail by email", async ({ request }) => {
    const email = uniqueEmail();
    const pw = USER_TEMPLATE.password;
    try {
      await createTestUser(request, email, pw);

      const response = await request.get(`${BASE_URL}/getUserDetailByEmail`, {
        params: { email },
      });
      const data = await response.json();
      expect(data.responseCode).toBe(200);
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe(email);

      for (const field of ["id", "name", "email", "title", "first_name", "last_name"]) {
        expect(data.user[field]).toBeDefined();
      }
    } finally {
      await deleteTestUser(request, email, pw);
    }
  });

  test("get user detail — nonexistent email returns 404", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/getUserDetailByEmail`, {
      params: { email: "absolutely_nobody@nope.com" },
    });
    const data = await response.json();
    expect(data.responseCode).toBe(404);
  });
});
