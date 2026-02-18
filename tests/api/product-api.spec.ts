/**
 * API tests for product endpoints (API 1, 2, 5 & 6).
 *
 * Converted from tests/api/test_product_api.py.
 */

import { test, expect } from "@playwright/test";

import { BASE_URL, loadApiConfig } from "./helpers";

const searchTerms = loadApiConfig().search_terms ?? ["Top"];

test.describe("Product API @api", () => {
  test("GET /productsList returns non-empty products array", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/productsList`);
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.responseCode).toBe(200);
    expect(data.products).toBeDefined();
    expect(data.products.length).toBeGreaterThan(0);
  });

  for (const term of searchTerms) {
    test(`POST /searchProduct returns results for "${term}"`, async ({ request }) => {
      const response = await request.post(`${BASE_URL}/searchProduct`, {
        form: { search_product: term },
      });
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.products).toBeDefined();
      expect(data.products.length).toBeGreaterThan(0);

      for (const product of data.products) {
        expect(product.name).toBeDefined();
        expect(typeof product.name).toBe("string");
      }
    });
  }
});

test.describe("Product API Edge Cases @api", () => {
  test("POST /productsList returns 405 (unsupported)", async ({ request }) => {
    const response = await request.post(`${BASE_URL}/productsList`);
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.responseCode).toBe(405);
    expect(data.message.toLowerCase()).toContain("not supported");
  });

  test("POST /searchProduct without param returns 400", async ({ request }) => {
    const response = await request.post(`${BASE_URL}/searchProduct`);
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.responseCode).toBe(400);
    expect(data.message.toLowerCase()).toContain("parameter");
  });
});
