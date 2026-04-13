export interface ActionResult<T> {
  readonly data?: T;
  readonly error?: string;
  readonly success: boolean;
  readonly validationErrors?: Record<string, readonly string[]>;
}
