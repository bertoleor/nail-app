import type { ActionResult } from "@/lib/types";

export type { ActionResult } from "@/lib/types";

export function errorResult<T>(
  error: string,
  validationErrors?: Record<string, readonly string[]>,
): ActionResult<T> {
  return { error, success: false, validationErrors };
}

export function successResult<T>(data: T): ActionResult<T> {
  return { data, success: true };
}
