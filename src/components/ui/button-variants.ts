import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full border text-sm font-light tracking-wide whitespace-nowrap transition-all duration-300 ease-out outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "min-h-[2.5rem] px-6 py-2",
        icon: "size-10",
        lg: "min-h-[2.875rem] px-[28px] py-[13px] text-[12px] font-medium tracking-[0.13em] uppercase",
        sm: "min-h-[2rem] px-4 text-sm",
        xs: "min-h-[1.75rem] px-3 text-xs",
      },
      variant: {
        default:
          "relative overflow-hidden btn-noise bg-white/38 backdrop-blur-[20px] saturate-150 border-white/60 text-[rgba(15,15,20,0.82)] hover:bg-white/55 hover:border-white/80 hover:-translate-y-px active:translate-y-0 active:bg-white/30",
        destructive:
          "bg-red-500/20 border-red-300/40 text-red-600 hover:bg-red-500/30",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        outline:
          "border-[rgba(15,15,20,0.16)] bg-transparent text-[rgba(15,15,20,0.55)] hover:border-[rgba(15,15,20,0.30)] hover:text-[rgba(15,15,20,0.82)] hover:-translate-y-px",
        secondary:
          "bg-white/50 text-black hover:bg-white/70 backdrop-blur-sm border-white/50",
      },
    },
  }
);

export type ButtonSize = "default" | "icon" | "lg" | "sm" | "xs";
export type ButtonVariant = "default" | "destructive" | "ghost" | "outline" | "secondary";