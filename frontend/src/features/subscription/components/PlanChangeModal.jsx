import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowDown, Loader2, X } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../utils/cn";

const PLAN_LABELS = {
    free: "Gratuito",
    pro: "Pro",
    business: "Business",
};

const PLAN_PRICES = {
    pro: "R$ 79/mês",
    business: "R$ 199/mês",
};

export function PlanChangeModal({
    isOpen,
    onClose,
    onConfirm,
    loading,
    fromPlan,
    toPlan,
    currentPeriodEnd,
    isUpgrade,
}) {
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

    const formattedDate = currentPeriodEnd
        ? new Date(currentPeriodEnd).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
          })
        : null;

    const ActionIcon = isUpgrade ? ArrowUp : ArrowDown;
    const iconBg = isUpgrade ? "bg-brand-success/10" : "bg-brand-primary/10";
    const iconColor = isUpgrade ? "text-brand-success" : "text-brand-primary";

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
                        aria-labelledby="plan-change-modal-title"
                    >
                        {/* Close button */}
                        <button
                            onClick={() => !loading && onClose()}
                            disabled={loading}
                            className="absolute top-4 right-4 text-brand-muted hover:text-white transition-colors disabled:opacity-50"
                            aria-label="Fechar"
                        >
                            <X size={18} />
                        </button>

                        {/* Icon */}
                        <div className={cn("flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-4", iconBg)}>
                            <ActionIcon size={22} className={iconColor} />
                        </div>

                        {/* Content */}
                        <div className="text-center space-y-2 mb-5">
                            <h2
                                id="plan-change-modal-title"
                                className="text-lg font-semibold text-white"
                            >
                                {isUpgrade ? "Confirmar upgrade?" : "Confirmar downgrade?"}
                            </h2>
                            <p className="text-brand-muted text-sm leading-relaxed">
                                {isUpgrade
                                    ? "Seu plano será atualizado imediatamente. Você será cobrado proporcionalmente pelo período restante."
                                    : formattedDate
                                    ? `Seu plano será alterado no próximo ciclo de cobrança. Você continuará com acesso completo até ${formattedDate}.`
                                    : "Seu plano será alterado no próximo ciclo de cobrança. Você continuará com acesso completo até o fim do período atual."}
                            </p>
                        </div>

                        {/* Plan summary */}
                        <div className="flex items-center justify-between gap-3 bg-brand-surface border border-brand-border rounded-xl px-4 py-3 mb-6">
                            <div className="text-center flex-1">
                                <p className="text-xs text-brand-muted mb-0.5">Plano atual</p>
                                <p className="text-sm font-semibold text-white">{PLAN_LABELS[fromPlan]}</p>
                                {PLAN_PRICES[fromPlan] && (
                                    <p className="text-xs text-brand-muted mt-0.5">{PLAN_PRICES[fromPlan]}</p>
                                )}
                            </div>

                            <ActionIcon size={16} className={cn("shrink-0", iconColor)} />

                            <div className="text-center flex-1">
                                <p className="text-xs text-brand-muted mb-0.5">Novo plano</p>
                                <p className="text-sm font-semibold text-white">{PLAN_LABELS[toPlan]}</p>
                                {PLAN_PRICES[toPlan] && (
                                    <p className="text-xs text-brand-muted mt-0.5">{PLAN_PRICES[toPlan]}</p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                variant="secondary"
                                size="full"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant={isUpgrade ? "success" : "primary"}
                                size="full"
                                onClick={onConfirm}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        {isUpgrade ? "Atualizando..." : "Agendando..."}
                                    </>
                                ) : isUpgrade ? (
                                    "Confirmar upgrade"
                                ) : (
                                    "Confirmar downgrade"
                                )}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
