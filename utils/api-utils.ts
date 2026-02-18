/**
 * API testing utilities — reusable REST client with Playwright's APIRequestContext.
 *
 * Converted from utils/api_utils.py. Uses Playwright's built-in API testing
 * instead of a separate HTTP library (requests → fetch via Playwright).
 */

import { type APIRequestContext, type APIResponse, expect } from "@playwright/test";

export class APIUtils {
  constructor(
    private request: APIRequestContext,
    private baseUrl: string,
  ) {}

  async get(endpoint: string, params?: Record<string, string>): Promise<APIResponse> {
    return await this.request.get(`${this.baseUrl}${endpoint}`, { params });
  }

  async post(
    endpoint: string,
    data?: Record<string, unknown>,
    form?: Record<string, string>,
  ): Promise<APIResponse> {
    if (form) {
      return await this.request.post(`${this.baseUrl}${endpoint}`, { form });
    }
    return await this.request.post(`${this.baseUrl}${endpoint}`, { data });
  }

  async put(
    endpoint: string,
    data?: Record<string, unknown>,
    form?: Record<string, string>,
  ): Promise<APIResponse> {
    if (form) {
      return await this.request.put(`${this.baseUrl}${endpoint}`, { form });
    }
    return await this.request.put(`${this.baseUrl}${endpoint}`, { data });
  }

  async delete(
    endpoint: string,
    data?: Record<string, unknown>,
    form?: Record<string, string>,
  ): Promise<APIResponse> {
    if (form) {
      return await this.request.delete(`${this.baseUrl}${endpoint}`, { form });
    }
    return await this.request.delete(`${this.baseUrl}${endpoint}`, { data });
  }

  async verifyStatusCode(response: APIResponse, expectedCode: number): Promise<void> {
    expect(response.status()).toBe(expectedCode);
  }
}
