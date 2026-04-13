import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/ui/button";

describe("Button", () => {
  it('renders with variant="default" and glass styling', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("rounded-full");
    expect(button).toHaveAttribute("data-slot", "button");
  });

  it('applies glass background for default variant', () => {
    render(<Button variant="default">Default</Button>);

    const button = screen.getByRole("button");
    expect(button.className).toMatch(/backdrop-blur/);
  });

  it('applies outline styles for variant="outline"', () => {
    render(<Button variant="outline">Outline</Button>);

    const button = screen.getByRole("button");
    expect(button.className).toMatch(/border/);
    expect(button.className).toMatch(/bg-transparent|bg-inherit/);
  });

  it('applies destructive styles for variant="destructive"', () => {
    render(<Button variant="destructive">Delete</Button>);

    const button = screen.getByRole("button");
    expect(button.className).toMatch(/red|rose/);
  });

  it('applies size="lg" with correct padding', () => {
    render(<Button size="lg">Large</Button>);

    const button = screen.getByRole("button");
    expect(button.className).toMatch(/min-h-\[3rem\]|px-8|py-3/);
  });

  it('applies size="sm" with correct padding', () => {
    render(<Button size="sm">Small</Button>);

    const button = screen.getByRole("button");
    expect(button.className).toMatch(/px-4|min-h-\[2rem\]/);
  });

  it("is not focusable when disabled", () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button.className).toMatch(/disabled:opacity-50|opacity-50/);
    expect(button.className).toMatch(/disabled:pointer-events-none|pointer-events-none/);
  });

  it("renders as child when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );

    const link = screen.getByRole("link", { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass("rounded-full");
  });

  it("accepts custom className", () => {
    render(<Button className="custom-class">Custom</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });
});
