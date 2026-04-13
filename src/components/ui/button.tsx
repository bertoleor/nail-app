"use client";

import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import type { ReactNode, ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

import { buttonVariants } from "./button-variants";

export interface ButtonProps
  extends VariantProps<typeof buttonVariants>,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  readonly children: ReactNode;
  readonly className?: string;
  readonly asChild?: boolean;
}

export function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  ...props
}: Readonly<ButtonProps>) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Comp>
  );
}

export { buttonVariants };
