"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full text-base transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: [
          "min-h-[3.5rem] rounded-2xl border border-white/50",
          "bg-white/60 backdrop-blur-[12px] hover:bg-white/75",
          "px-5 py-2 shadow-sm ring-offset-background",
          "text-[rgba(15,15,20,0.88)] placeholder:text-[rgba(15,15,20,0.35)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:border-white/70",
        ],
        underline: [
          "rounded-none border-0 border-b border-[rgba(15,15,20,0.14)]",
          "bg-transparent px-0 py-3 h-auto shadow-none",
          "text-[15px] text-[rgba(15,15,20,0.88)]",
          "placeholder:text-[rgba(15,15,20,0.28)]",
          "focus-visible:outline-none focus-visible:border-[rgba(15,15,20,0.45)]",
          "ring-0 ring-offset-0",
        ],
      },
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", variant, ...props }, ref) => {
    return (
      <input
        className={cn(inputVariants({ variant }), className)}
        ref={ref}
        type={type}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
