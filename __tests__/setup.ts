import "@testing-library/jest-dom/vitest";

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
