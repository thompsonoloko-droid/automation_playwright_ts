/**
 * Shared constants and helpers for API tests.
 *
 * Converted from tests/api/conftest.py.
 */

import fs from "fs";
import path from "path";

export interface ApiConfig {
  base_url: string;
  timeout: number;
  test_user_template: Record<string, string>;
  update_user_template: Record<string, string>;
  search_terms?: string[];
  users: Array<{ id: string; email: string; password: string; valid: boolean }>;
  invalid_login_attempts: Array<{
    id: string;
    email: string;
    password: string;
    expected_code: number;
    expected_message: string;
  }>;
}

interface TestData {
  api: ApiConfig;
  users: Array<{ id: string; email: string; password: string; valid: boolean }>;
  invalid_credentials: Array<{
    id: string;
    email: string;
    password: string;
    error_contains: string;
  }>;
}

export function loadTestData(): TestData {
  const filePath = path.resolve(__dirname, "../../test_data/test_data.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function loadApiConfig(): ApiConfig {
  return loadTestData().api;
}

const cfg = loadApiConfig();
export const BASE_URL = cfg.base_url;
export const TIMEOUT = cfg.timeout;
export const USER_TEMPLATE = cfg.test_user_template;
export const UPDATE_TEMPLATE = cfg.update_user_template;

/** If value starts with $, resolve it from environment variables. */
export function resolveEnv(value: string): string {
  if (value.startsWith("$")) {
    return process.env[value.slice(1)] ?? value;
  }
  return value;
}

/** Generate a unique test email using crypto.randomUUID(). */
export function uniqueEmail(): string {
  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  return `testbot_${id}@example.com`;
}
