import { cn } from "../../utils/cn";

export function Card({ className, children, ...props }) {
    return (
        <div
            className={cn("bg-slate-800 rounded-2xl shadow-lg border border-slate-700", className)}
            {...props}
        >
            {children}
        </div>
    );
}

export default Card;
