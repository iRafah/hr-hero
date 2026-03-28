import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "../utils/cn";

const ToastContext = createContext(null);

const TYPE_CONFIG = {
    success: {
        icon: CheckCircle,
        color: "text-brand-success",
        bg: "bg-brand-elevated border-brand-success/30",
        bar: "bg-brand-success",
    },
    error: {
        icon: AlertCircle,
        color: "text-brand-error",
        bg: "bg-brand-elevated border-brand-error/30",
        bar: "bg-brand-error",
    },
    info: {
        icon: Info,
        color: "text-brand-primary",
        bg: "bg-brand-elevated border-brand-primary/30",
        bar: "bg-brand-primary",
    },
};

function ToastItem({ id, message, type, onDismiss }) {
    const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.info;
    const Icon = cfg.icon;

    return (
        <div
            className={cn(
                "relative flex items-start gap-3 px-4 py-3 rounded-xl border shadow-xl w-80 overflow-hidden",
                cfg.bg
            )}
        >
            <div className={cn("absolute bottom-0 left-0 h-0.5 w-full animate-[shrink_4s_linear_forwards]", cfg.bar)} />
            <Icon size={16} className={cn("shrink-0 mt-0.5", cfg.color)} />
            <p className="text-sm text-white flex-1 leading-snug">{message}</p>
            <button
                onClick={() => onDismiss(id)}
                className="text-brand-muted hover:text-white transition-colors shrink-0"
            >
                <X size={14} />
            </button>
        </div>
    );
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback(
        (message, type = "success") => {
            const id = Date.now() + Math.random();
            setToasts((prev) => [...prev, { id, message, type }]);
            setTimeout(() => removeToast(id), 4000);
        },
        [removeToast]
    );

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <ToastItem {...toast} onDismiss={removeToast} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}
