import { cn } from "@/lib/utils";

export interface SkeletonProps {
  readonly className?: string;
  readonly variant?: "text" | "circular" | "rectangular";
  readonly glass?: boolean;
  readonly "data-testid"?: string;
}

export function Skeleton({
  className,
  variant = "rectangular",
  glass = true,
  ...props
}: Readonly<SkeletonProps>) {
  const baseClasses = glass ? "skeleton-glass" : "bg-gray-200 animate-pulse";
  const variantClasses = {
    text: "h-4 w-full rounded",
    circular: "rounded-full",
    rectangular: "rounded-2xl",
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      aria-hidden="true"
      {...props}
    />
  );
}
