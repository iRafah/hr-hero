import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    CreditCard,
    Loader2,
    AlertCircle,
    CheckCircle,
    ArrowUp,
    ArrowDown,
    ExternalLink,
    XCircle,
    Clock,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { cn } from "../../utils/cn";
import { useSubscription } from "../../features/subscription/hooks/useSubscription";
import { CancelModal } from "../../features/subscription/components/CancelModal";
import { PlanChangeModal } from "../../features/subscription/components/PlanChangeModal";
import { useToast } from "../../context/ToastContext";

// ─── Constants ───────────────────────────────────────────────────────────────

const PLAN_ORDER = { free: 0, pro: 1, business: 2 };

const PLAN_LABELS = {
    free: "Gratuito",
    pro: "Pro",
    business: "Business",
};

const STATUS_CONFIG = {
    active: { label: "Ativa", icon: CheckCircle, color: "text-brand-success", bg: "bg-brand-success/10" },
    trialing: { label: "Período de teste", icon: Clock, color: "text-brand-primary", bg: "bg-brand-primary/10" },
    past_due: { label: "Pagamento pendente", icon: AlertCircle, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    canceled: { label: "Cancelada", icon: XCircle, color: "text-brand-muted", bg: "bg-brand-surface" },
    inactive: { label: "Inativa", icon: XCircle, color: "text-brand-muted", bg: "bg-brand-surface" },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function AccountSubscription() {
    const navigate = useNavigate();
    const { subscription, loading, error, cancel, changePlan, openPortal, startCheckout, refetch } =
        useSubscription();
    const { addToast } = useToast();

    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [changingTo, setChangingTo] = useState(null);
    const [portalLoading, setPortalLoading] = useState(false);
    const [planChangeModal, setPlanChangeModal] = useState(null);
    const [planChangeLoading, setPlanChangeLoading] = useState(false);

    const plan = subscription?.plan ?? "free";
    const isPaid = plan !== "free";
    const isActive = ["active", "trialing"].includes(subscription?.status);
    const isCanceled = subscription?.status === "canceled";
    const canCancel = isPaid && isActive;

    const upgradePlan = plan === "pro" ? "business" : null;
    const downgradePlan = plan === "business" ? "pro" : null;

    // ── Actions ──────────────────────────────────────────────────────────────

    function handleChangePlan(newPlan) {
        if (plan === "free") {
            startCheckout(newPlan);
            return;
        }
        setPlanChangeModal({ toPlan: newPlan, isUpgrade: PLAN_ORDER[newPlan] > PLAN_ORDER[plan] });
    }

    async function handlePlanChangeConfirm() {
        if (!planChangeModal) return;
        const { toPlan, isUpgrade } = planChangeModal;
        setPlanChangeLoading(true);
        setChangingTo(toPlan);
        try {
            await changePlan(toPlan);
            if (isUpgrade) {
                addToast(
                    "Seu plano foi atualizado imediatamente. Você será cobrado proporcionalmente pelo período restante.",
                    "success"
                );
            } else {
                const dateStr = subscription?.current_period_end
                    ? new Date(subscription.current_period_end).toLocaleDateString("pt-BR")
                    : "o fim do período atual";
                addToast(
                    `Seu plano será alterado no próximo ciclo de cobrança. Você continuará com acesso completo até ${dateStr}.`,
                    "success"
                );
            }
            setPlanChangeModal(null);
        } catch (err) {
            addToast(err?.response?.data?.detail || "Erro ao atualizar plano", "error");
        } finally {
            setPlanChangeLoading(false);
            setChangingTo(null);
        }
    }

    async function handleCancelConfirm() {
        setCancelLoading(true);
        try {
            await cancel();
            setCancelModalOpen(false);
            addToast("Assinatura cancelada. Acesso mantido até o fim do período.", "success");
        } catch (err) {
            addToast(err?.response?.data?.detail || "Erro ao cancelar assinatura", "error");
        } finally {
            setCancelLoading(false);
        }
    }

    async function handlePortal() {
        setPortalLoading(true);
        try {
            await openPortal();
        } catch (err) {
            addToast(err?.response?.data?.detail || "Erro ao abrir portal de cobrança", "error");
            setPortalLoading(false);
        }
    }

    // ── Loading ───────────────────────────────────────────────────────────────

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 size={28} className="animate-spin text-brand-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-4 md:px-8 py-10 max-w-3xl mx-auto">
                <div className="flex items-center gap-3 text-brand-error bg-brand-error/10 border border-brand-error/20 rounded-xl px-4 py-3">
                    <AlertCircle size={16} className="shrink-0" />
                    <p className="text-sm">{error}</p>
                    <Button variant="ghost" size="sm" onClick={refetch} className="ml-auto">
                        Tentar novamente
                    </Button>
                </div>
            </div>
        );
    }

    // ── Render ────────────────────────────────────────────────────────────────

    const statusCfg = STATUS_CONFIG[subscription?.status ?? "inactive"];
    const StatusIcon = statusCfg.icon;

    return (
        <>
            <div className="px-4 md:px-8 py-10 max-w-3xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-white">Assinatura</h1>
                    <p className="text-brand-muted text-sm mt-1">
                        Gerencie seu plano e dados de cobrança.
                    </p>
                </div>

                {/* ── Current plan card ────────────────────────────────── */}
                <div className="rounded-2xl border border-brand-border bg-brand-surface p-6 space-y-5">
                    <h2 className="text-sm font-medium text-brand-muted uppercase tracking-wider">
                        Plano atual
                    </h2>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-2xl font-bold text-white">{PLAN_LABELS[plan]}</p>

                            {/* Status badge */}
                            <div
                                className={cn(
                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                                    statusCfg.bg,
                                    statusCfg.color
                                )}
                            >
                                <StatusIcon size={12} />
                                {statusCfg.label}
                            </div>
                        </div>

                        {/* Billing date */}
                        {subscription?.current_period_end && (
                            <div className="text-right">
                                <p className="text-xs text-brand-muted">
                                    {isCanceled ? "Acesso até" : "Próxima cobrança"}
                                </p>
                                <p className="text-sm font-medium text-white mt-0.5">
                                    {new Date(subscription.current_period_end).toLocaleDateString(
                                        "pt-BR",
                                        { day: "2-digit", month: "long", year: "numeric" }
                                    )}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Canceled notice */}
                    {isCanceled && subscription?.current_period_end && (
                        <div className="flex items-start gap-2 text-sm text-brand-muted bg-brand-elevated rounded-xl px-4 py-3 border border-brand-border">
                            <AlertCircle size={15} className="shrink-0 mt-0.5 text-yellow-400" />
                            Sua assinatura foi cancelada. Você ainda tem acesso completo até{" "}
                            {new Date(subscription.current_period_end).toLocaleDateString("pt-BR")}.
                        </div>
                    )}

                    {/* Scheduled downgrade notice */}
                    {subscription?.scheduled_plan && (
                        <div className="flex items-start gap-2 text-sm text-brand-muted bg-brand-elevated rounded-xl px-4 py-3 border border-brand-border">
                            <Clock size={15} className="shrink-0 mt-0.5 text-yellow-400" />
                            Alteração agendada: seu plano será alterado para{" "}
                            {PLAN_LABELS[subscription.scheduled_plan]} no próximo ciclo de cobrança.
                        </div>
                    )}
                </div>

                {/* ── Actions card ─────────────────────────────────────── */}
                <div className="rounded-2xl border border-brand-border bg-brand-surface p-6 space-y-3">
                    <h2 className="text-sm font-medium text-brand-muted uppercase tracking-wider mb-4">
                        Ações
                    </h2>

                    {/* Upgrade */}
                    {upgradePlan && isActive && (
                        <ActionRow
                            icon={ArrowUp}
                            iconColor="text-brand-success"
                            title={`Fazer upgrade para ${PLAN_LABELS[upgradePlan]}`}
                            description="Mais vagas, análise em lote avançada e membros de equipe"
                        >
                            <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleChangePlan(upgradePlan)}
                                disabled={changingTo !== null || portalLoading || planChangeLoading}
                            >
                                {changingTo === upgradePlan ? (
                                    <Loader2 size={13} className="animate-spin" />
                                ) : (
                                    <ArrowUp size={13} />
                                )}
                                Upgrade
                            </Button>
                        </ActionRow>
                    )}

                    {/* Downgrade */}
                    {downgradePlan && isActive && !subscription?.scheduled_plan && (
                        <ActionRow
                            icon={ArrowDown}
                            iconColor="text-brand-muted"
                            title={`Fazer downgrade para ${PLAN_LABELS[downgradePlan]}`}
                            description="Menos vagas e funcionalidades, custo mensal reduzido"
                        >
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleChangePlan(downgradePlan)}
                                disabled={changingTo !== null || portalLoading || planChangeLoading}
                            >
                                {changingTo === downgradePlan ? (
                                    <Loader2 size={13} className="animate-spin" />
                                ) : (
                                    <ArrowDown size={13} />
                                )}
                                Downgrade
                            </Button>
                        </ActionRow>
                    )}

                    {/* Upgrade free → paid */}
                    {plan === "free" && (
                        <ActionRow
                            icon={ArrowUp}
                            iconColor="text-brand-primary"
                            title="Fazer upgrade de plano"
                            description="Desbloqueie análises ilimitadas e mais funcionalidades"
                        >
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => navigate("/subscribe")}
                            >
                                Ver planos
                            </Button>
                        </ActionRow>
                    )}

                    {/* Manage Billing */}
                    {isPaid && subscription?.stripe_customer_id && (
                        <ActionRow
                            icon={CreditCard}
                            iconColor="text-brand-primary"
                            title="Gerenciar cobrança"
                            description="Atualize cartão, veja faturas e dados de pagamento"
                        >
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handlePortal}
                                disabled={portalLoading || changingTo !== null}
                            >
                                {portalLoading ? (
                                    <Loader2 size={13} className="animate-spin" />
                                ) : (
                                    <ExternalLink size={13} />
                                )}
                                Portal de cobrança
                            </Button>
                        </ActionRow>
                    )}

                    {/* Cancel */}
                    {canCancel && (
                        <ActionRow
                            icon={XCircle}
                            iconColor="text-brand-error"
                            title="Cancelar assinatura"
                            description="Você mantém o acesso até o fim do período atual"
                        >
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => setCancelModalOpen(true)}
                                disabled={changingTo !== null || portalLoading}
                            >
                                <XCircle size={13} />
                                Cancelar
                            </Button>
                        </ActionRow>
                    )}

                    {/* No actions available */}
                    {plan === "free" && !isPaid && (
                        <p className="text-sm text-brand-muted text-center py-2">
                            Você está no plano gratuito.
                        </p>
                    )}
                </div>
            </div>

            <CancelModal
                isOpen={cancelModalOpen}
                onClose={() => setCancelModalOpen(false)}
                onConfirm={handleCancelConfirm}
                loading={cancelLoading}
            />

            <PlanChangeModal
                isOpen={planChangeModal !== null}
                onClose={() => !planChangeLoading && setPlanChangeModal(null)}
                onConfirm={handlePlanChangeConfirm}
                loading={planChangeLoading}
                fromPlan={plan}
                toPlan={planChangeModal?.toPlan ?? "pro"}
                currentPeriodEnd={subscription?.current_period_end}
                isUpgrade={planChangeModal?.isUpgrade ?? false}
            />
        </>
    );
}

// ── Sub-component ─────────────────────────────────────────────────────────────

function ActionRow({ icon: Icon, iconColor, title, description, children }) {
    return (
        <div className="flex items-center justify-between gap-4 py-3 border-b border-brand-border last:border-0">
            <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-elevated shrink-0 mt-0.5">
                    <Icon size={15} className={iconColor} />
                </div>
                <div>
                    <p className="text-sm font-medium text-white">{title}</p>
                    <p className="text-xs text-brand-muted mt-0.5">{description}</p>
                </div>
            </div>
            <div className="shrink-0">{children}</div>
        </div>
    );
}
