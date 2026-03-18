import { tv } from "tailwind-variants";
import { cn } from "../../utils/cn";

const badge = tv({
    base: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
    variants: {
        variant: {
            success: "bg-green-900/50 text-green-400 border border-green-700",
            danger: "bg-red-900/50 text-red-400 border border-red-700",
            info: "bg-blue-900/50 text-blue-400 border border-blue-700",
            neutral: "bg-slate-700 text-slate-300",
        },
    },
    defaultVariants: { variant: "neutral" },
});

export function Badge({ variant, className, children }) {
    return (
        <span className={cn(badge({ variant }), className)}>
            {children}
        </span>
    );
}

export default Badge;
