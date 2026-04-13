import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Input } from "@/components/ui/input";

describe("Input", () => {
  it('renders with variant="default"', () => {
    render(<Input data-testid="input" />);

    const input = screen.getByTestId("input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  it('applies default styling for variant="default"', () => {
    render(<Input variant="default" data-testid="input" />);

    const input = screen.getByTestId("input");
    expect(input.className).toMatch(/rounded-2xl/);
    expect(input.className).toMatch(/border/);
  });

  it('applies underline styling for variant="underline"', () => {
    render(<Input variant="underline" data-testid="input" />);

    const input = screen.getByTestId("input");
    expect(input.className).toMatch(/border-b|border-bottom/);
    expect(input.className).toMatch(/bg-transparent/);
  });

  it("shows focus-visible ring", () => {
    render(<Input data-testid="input" />);

    const input = screen.getByTestId("input");
    expect(input.className).toMatch(/focus-visible/);
  });

  it("accepts placeholder text", () => {
    render(<Input placeholder="Enter text" />);

    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
  });

  it("can be disabled", () => {
    render(<Input disabled data-testid="input" />);

    const input = screen.getByTestId("input");
    expect(input).toBeDisabled();
    expect(input.className).toMatch(/disabled/);
  });

  it("accepts custom className", () => {
    render(<Input className="custom-input" data-testid="input" />);

    const input = screen.getByTestId("input");
    expect(input).toHaveClass("custom-input");
  });

  it("accepts different input types", () => {
    render(<Input type="email" data-testid="input" />);

    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("type", "email");
  });

  it("spreads additional props", () => {
    render(<Input data-testid="input" aria-label="Email address" />);

    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("aria-label", "Email address");
  });
});
