import { tv } from "tailwind-variants";
import { cn } from "../../utils/cn";

const button = tv({
    base: "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
    variants: {
        variant: {
            primary: "bg-brand-primary hover:bg-[#1A6FE8] text-white",
            secondary: "bg-brand-surface hover:bg-brand-elevated text-slate-100 border border-brand-border",
            ghost: "bg-transparent hover:bg-brand-surface text-brand-muted",
            success: "bg-brand-success hover:bg-[#00A583] text-white",
            danger: "bg-brand-error hover:bg-[#CC3333] text-white",
            indigo: "bg-brand-violet hover:bg-[#5B52EF] text-white",
        },
        size: {
            sm: "px-3 py-1.5 text-sm",
            md: "px-4 py-2.5 text-sm",
            lg: "px-6 py-3 text-base",
            full: "w-full px-4 py-2.5 text-sm",
        },
    },
    defaultVariants: {
        variant: "primary",
        size: "md",
    },
});

export function Button({ variant, size, className, children, ...props }) {
    return (
        <button className={cn(button({ variant, size }), className)} {...props}>
            {children}
        </button>
    );
}

export default Button;
