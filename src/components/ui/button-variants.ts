import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full border text-sm font-light tracking-wide whitespace-nowrap transition-all duration-300 ease-out outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-white/38 backdrop-blur-[20px] border-white/60 text-[rgba(15,15,20,0.82)] hover:bg-white/55 hover:border-white/80 hover:-translate-y-px active:translate-y-0",
        outline:
          "border-[rgba(15,15,20,0.16)] bg-transparent text-[rgba(15,15,20,0.55)] hover:border-[rgba(15,15,20,0.30)] hover:text-[rgba(15,15,20,0.82)] hover:-translate-y-px",
        destructive:
          "bg-red-500/20 border-red-300/40 text-red-600 hover:bg-red-500/30",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-white/50 text-black hover:bg-white/70 backdrop-blur-sm border-white/50",
      },
      size: {
        default: "min-h-[2.5rem] px-6 py-2",
        xs: "min-h-[1.75rem] px-3 text-xs",
        sm: "min-h-[2rem] px-4 text-sm",
        lg: "min-h-[3rem] px-8 py-3 uppercase tracking-widest",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonVariant = "default" | "outline" | "destructive" | "ghost" | "secondary";
export type ButtonSize = "xs" | "sm" | "default" | "lg" | "icon";
