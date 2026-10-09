import "@testing-library/jest-dom/vitest";

// NAIL-H3/L3: jsdom 29 no longer implements Web Storage at all — it used to
// delegate to the Node runtime, which only exposes localStorage behind the
// --localstorage-file flag (Node 22.4+, not available on the CI's Node 20).
// Without storage, every zustand persist store crashes on setState. This
// in-memory polyfill restores the standard contract for any Node version.
if (typeof window !== "undefined" && window.localStorage === undefined) {
  const storage = new Map<string, string>();
  const localStoragePolyfill: Storage = {
    get length(): number {
      return storage.size;
    },
    clear: () => {
      storage.clear();
    },
    getItem: (key: string) => storage.get(key) ?? null,
    key: (index: number) => Array.from(storage.keys())[index] ?? null,
    removeItem: (key: string) => {
      storage.delete(key);
    },
    setItem: (key: string, value: string) => {
      storage.set(key, String(value));
    },
  };
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: localStoragePolyfill,
    writable: false,
  });
}

class MockPointerEvent extends Event {
  public pointerId: number;
  public clientX: number;
  public clientY: number;
  public pointerType: string;
  public isPrimary: boolean;

  constructor(type: string, eventInitDict?: PointerEventInit) {
    super(type, eventInitDict);
    this.pointerId = eventInitDict?.pointerId ?? 0;
    this.clientX = eventInitDict?.clientX ?? 0;
    this.clientY = eventInitDict?.clientY ?? 0;
    this.pointerType = eventInitDict?.pointerType ?? "mouse";
    this.isPrimary = eventInitDict?.isPrimary ?? false;
  }
}

if (typeof window !== "undefined") {
  window.PointerEvent = MockPointerEvent as unknown as typeof PointerEvent;
  window.HTMLElement.prototype.hasPointerCapture = () => false;
  window.HTMLElement.prototype.setPointerCapture = () => {};
  window.HTMLElement.prototype.releasePointerCapture = () => {};
  window.HTMLElement.prototype.scrollIntoView = () => {};
}

if (typeof window !== "undefined") {
  window.CSS!.supports = ((propertyOrCondition: string, value?: string) => {
    if (value !== undefined) {
      if (propertyOrCondition === "backdrop-filter" && value === "blur(1px)") return true;
      if (propertyOrCondition === "display" && value === "grid") return true;
      return false;
    }
    return false;
  }) as typeof CSS.supports;

  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
