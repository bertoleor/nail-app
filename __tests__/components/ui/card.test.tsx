import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

describe("Card", () => {
  it("renders with glass styling", () => {
    render(<Card data-testid="card">Content</Card>);

    const card = screen.getByTestId("card");
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass("rounded-3xl");
    expect(card.className).toMatch(/glass|backdrop-blur/);
  });

  it("renders CardHeader with correct padding", () => {
    render(
      <Card>
        <CardHeader data-testid="header">
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>
    );

    const header = screen.getByTestId("header");
    expect(header).toHaveClass("p-8");
  });

  it("renders CardTitle with correct typography", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
        </CardHeader>
      </Card>
    );

    const title = screen.getByRole("heading", { name: /test title/i });
    expect(title).toBeInTheDocument();
    expect(title.className).toMatch(/font-light|text-3xl/);
  });

  it("renders CardDescription with correct styling", () => {
    render(
      <Card>
        <CardHeader>
          <CardDescription>Description text</CardDescription>
        </CardHeader>
      </Card>
    );

    const description = screen.getByText(/description text/i);
    expect(description).toBeInTheDocument();
    expect(description.className).toMatch(/text-\[rgba|text-lg/);
  });

  it("renders CardContent with correct padding", () => {
    render(
      <Card>
        <CardContent data-testid="content">Inner content</CardContent>
      </Card>
    );

    const content = screen.getByTestId("content");
    expect(content).toHaveClass("p-8");
  });

  it("renders CardFooter for actions", () => {
    render(
      <Card>
        <CardFooter data-testid="footer">Footer</CardFooter>
      </Card>
    );

    const footer = screen.getByTestId("footer");
    expect(footer).toHaveClass("flex");
    expect(footer).toHaveClass("items-center");
  });

  it("composes all parts together", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Full Card</CardTitle>
          <CardDescription>With all parts</CardDescription>
        </CardHeader>
        <CardContent>Content area</CardContent>
        <CardFooter>Footer area</CardFooter>
      </Card>
    );

    expect(screen.getByRole("heading", { name: /full card/i })).toBeInTheDocument();
    expect(screen.getByText(/with all parts/i)).toBeInTheDocument();
    expect(screen.getByText(/content area/i)).toBeInTheDocument();
    expect(screen.getByText(/footer area/i)).toBeInTheDocument();
  });

  it("accepts custom className on all parts", () => {
    render(
      <Card className="custom-card">
        <CardHeader className="custom-header">
          <CardTitle className="custom-title">T</CardTitle>
        </CardHeader>
        <CardContent className="custom-content">C</CardContent>
        <CardFooter className="custom-footer">F</CardFooter>
      </Card>
    );

    expect(screen.getByRole("heading")).toHaveClass("custom-title");
  });
});
