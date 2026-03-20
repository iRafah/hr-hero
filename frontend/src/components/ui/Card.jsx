import { cn } from "../../utils/cn";

export function Card({ className, children, ...props }) {
    return (
        <div
            className={cn("bg-brand-surface rounded-2xl shadow-lg border border-brand-border", className)}
            {...props}
        >
            {children}
        </div>
    );
}

export default Card;
