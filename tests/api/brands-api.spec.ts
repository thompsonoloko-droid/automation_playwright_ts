/**
 * API tests for brand endpoints (API 3 & 4).
 *
 * Converted from tests/api/test_brands_api.py.
 */

import { test, expect } from "@playwright/test";

import { BASE_URL } from "./helpers";

test.describe("Brands API @api", () => {
  test("GET /brandsList returns all brands", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/brandsList`);
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.responseCode).toBe(200);
    expect(data.brands).toBeDefined();
    expect(data.brands.length).toBeGreaterThan(0);

    for (const brand of data.brands) {
      expect(brand.id).toBeDefined();
      expect(brand.brand).toBeDefined();
    }
  });

  test("PUT /brandsList returns 405 (unsupported)", async ({ request }) => {
    const response = await request.put(`${BASE_URL}/brandsList`);
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.responseCode).toBe(405);
    expect(data.message.toLowerCase()).toContain("not supported");
  });
});
