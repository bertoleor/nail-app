import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

import * as matchers from "@testing-library/jest-dom/matchers";
import { expect, vi } from "vitest";

declare module "vitest" {
  interface Assertion<T> extends TestingLibraryMatchers<T, void> {}
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<void, void> {}
}

expect.extend(matchers);

beforeEach(() => {
  vi.clearAllMocks();
});
