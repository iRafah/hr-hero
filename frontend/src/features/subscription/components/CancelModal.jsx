import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";

export function CancelModal({ isOpen, onClose, onConfirm, loading }) {
    // Close on ESC
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            if (e.key === "Escape" && !loading) onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, onClose, loading]);

    // Prevent body scroll when open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => !loading && onClose()}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.93, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.93, y: 12 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="relative z-10 w-full max-w-md mx-4 bg-brand-elevated border border-brand-border rounded-2xl shadow-2xl p-6"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cancel-modal-title"
                    >
                        {/* Icon */}
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-error/10 mx-auto mb-4">
                            <AlertTriangle size={22} className="text-brand-error" />
                        </div>

                        {/* Content */}
                        <div className="text-center space-y-2 mb-6">
                            <h2
                                id="cancel-modal-title"
                                className="text-lg font-semibold text-white"
                            >
                                Cancelar assinatura?
                            </h2>
                            <p className="text-brand-muted text-sm leading-relaxed">
                                Você continuará com acesso até o final do período atual.
                                <br />
                                Após isso, sua conta voltará ao plano gratuito.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                variant="secondary"
                                size="full"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Voltar
                            </Button>
                            <Button
                                variant="danger"
                                size="full"
                                onClick={onConfirm}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        Cancelando...
                                    </>
                                ) : (
                                    "Confirmar cancelamento"
                                )}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
