import { cn } from "@/lib/utils";

export interface SkeletonProps {
  readonly className?: string;
  readonly "data-testid"?: string;
  readonly glass?: boolean;
  readonly variant?: "circular" | "rectangular" | "text";
}

export function Skeleton({
  className,
  glass = true,
  variant = "rectangular",
  ...props
}: Readonly<SkeletonProps>) {
  const baseClasses = glass ? "skeleton-glass" : "bg-gray-200 animate-pulse";
  const variantClasses = {
    circular: "rounded-full",
    rectangular: "rounded-2xl",
    text: "h-4 w-full rounded",
  };

  return (
    <div
      aria-hidden="true"
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  );
}
