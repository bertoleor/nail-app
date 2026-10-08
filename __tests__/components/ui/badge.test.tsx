import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders with glass-pill styling", () => {
    render(<Badge data-testid="badge">Status</Badge>);

    const badge = screen.getByTestId("badge");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toMatch(/backdrop-blur|rounded-full/);
  });

  it("applies default variant", () => {
    render(<Badge variant="default">Default</Badge>);

    const badge = screen.getByText("Default");
    expect(badge.className).toMatch(/glass-pill|rgba/);
  });

  it("applies success variant", () => {
    render(<Badge variant="success">Success</Badge>);

    const badge = screen.getByText("Success");
    expect(badge.className).toMatch(/green|emerald|success/);
  });

  it("applies warning variant", () => {
    render(<Badge variant="warning">Warning</Badge>);

    const badge = screen.getByText("Warning");
    expect(badge.className).toMatch(/yellow|amber|warning/);
  });

  it("applies error variant", () => {
    render(<Badge variant="error">Error</Badge>);

    const badge = screen.getByText("Error");
    expect(badge.className).toMatch(/red|rose|error/);
  });

  it("accepts custom className", () => {
    render(<Badge className="custom-badge">Custom</Badge>);

    const badge = screen.getByText("Custom");
    expect(badge).toHaveClass("custom-badge");
  });
});
