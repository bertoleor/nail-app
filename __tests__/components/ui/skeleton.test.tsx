import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Skeleton } from "@/components/ui/skeleton";

describe("Skeleton", () => {
  it("renders with glass animation", () => {
    render(<Skeleton data-testid="skeleton" />);

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton.className).toMatch(/skeleton-glass|animate/);
  });

  it("renders rectangular variant by default", () => {
    render(<Skeleton data-testid="skeleton" />);

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton.className).toMatch(/rounded-2xl|rounded-xl/);
  });

  it("renders circular variant", () => {
    render(
      <Skeleton
        variant="circular"
        data-testid="skeleton"
      />,
    );

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton.className).toMatch(/rounded-full/);
  });

  it("renders text variant", () => {
    render(
      <Skeleton
        variant="text"
        data-testid="skeleton"
      />,
    );

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton.className).toMatch(/rounded|h-4/);
  });

  it("accepts custom className", () => {
    render(
      <Skeleton
        className="h-12 w-full"
        data-testid="skeleton"
      />,
    );

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toHaveClass("w-full");
    expect(skeleton).toHaveClass("h-12");
  });

  it("can disable glass variant", () => {
    render(
      <Skeleton
        glass={false}
        data-testid="skeleton"
      />,
    );

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton.className).not.toMatch(/skeleton-glass/);
  });

  it("has aria-hidden for accessibility", () => {
    render(<Skeleton data-testid="skeleton" />);

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
  });
});
