import { tv } from "tailwind-variants";
import { cn } from "../../utils/cn";

const badge = tv({
    base: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
    variants: {
        variant: {
            success: "bg-brand-success/15 text-brand-success border border-brand-success/40",
            danger: "bg-brand-error/15 text-brand-error border border-brand-error/40",
            info: "bg-brand-primary/15 text-brand-primary border border-brand-primary/40",
            neutral: "bg-brand-elevated text-brand-muted",
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
