"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { buttonVariants } from "./button-variants";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">,
    VariantProps<typeof buttonVariants> {
  readonly asChild?: boolean;
  readonly children: ReactNode;
  readonly className?: string;
}

export function Button({
  asChild = false,
  children,
  className,
  size = "default",
  variant = "default",
  ...props
}: Readonly<ButtonProps>) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ className, size, variant }))}
      data-slot="button"
      {...props}
    >
      {children}
    </Comp>
  );
}



export {buttonVariants} from "./button-variants";