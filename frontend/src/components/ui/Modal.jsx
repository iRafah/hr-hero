import { X } from "lucide-react";
import { cn } from "../../utils/cn";

export function Modal({ isOpen, onClose, title, children, className }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div
                className={cn(
                    "relative bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto",
                    className
                )}
            >
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700"
                    >
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

export default Modal;
