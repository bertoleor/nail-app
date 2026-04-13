import { type VariantProps, cva } from "class-variance-authority";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium backdrop-blur-[12px] border",
  {
    variants: {
      variant: {
        default:
          "bg-white/35 border-white/55 text-[rgba(15,15,20,0.82)]",
        secondary:
          "bg-gray-100/60 border-gray-200/60 text-gray-800",
        outline:
          "bg-transparent border-gray-300 text-gray-600",
        destructive:
          "bg-red-100/60 border-red-200/60 text-red-800",
        success:
          "bg-emerald-100/60 border-emerald-200/60 text-emerald-800",
        warning:
          "bg-amber-100/60 border-amber-200/60 text-amber-800",
        error:
          "bg-red-100/60 border-red-200/60 text-red-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends VariantProps<typeof badgeVariants> {
  readonly children: ReactNode;
  readonly className?: string;
  readonly "data-testid"?: string;
}

export function Badge({ className, variant, children, ...props }: Readonly<BadgeProps>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}

export { badgeVariants };
