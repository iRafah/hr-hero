import { tv } from "tailwind-variants";
import { cn } from "../../utils/cn";

const button = tv({
    base: "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
    variants: {
        variant: {
            primary: "bg-blue-600 hover:bg-blue-700 text-white",
            secondary: "bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-600",
            ghost: "bg-transparent hover:bg-slate-700 text-slate-300",
            success: "bg-green-600 hover:bg-green-700 text-white",
            danger: "bg-red-600 hover:bg-red-700 text-white",
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
