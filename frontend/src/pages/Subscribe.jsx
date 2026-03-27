import { useState } from "react";
import { Check, X, Star, AlertCircle, Loader2, CreditCard } from "lucide-react";
import { Button } from "../components/ui/Button";
import { cn } from "../utils/cn";
import { useSubscription } from "../features/subscription/hooks/useSubscription";

// ─── Plan definitions ─────────────────────────────────────────────────────────

const PLANS = [
    {
        id: "free",
        name: "Gratuito",
        price: "R$ 0",
        period: "/mês",
        description: "Ideal para candidatos que querem experimentar o poder da IA",
        target: "Para candidatos",
        features: [
            "3–5 análises de CV por mês",
            "Score de compatibilidade",
            "Habilidades ausentes identificadas",
            "Explicação básica da análise",
        ],
        limits: [
            "Sem histórico de análises",
            "Sem criação de vagas",
            "Sem exportação em PDF",
            "Sem gerador de e-mails",
        ],
        highlighted: false,
        badge: null,
    },
    {
        id: "pro",
        name: "Pro",
        price: "R$ 79",
        period: "/mês",
        description: "Para candidatos sérios, freelancers e recrutadores individuais",
        target: "Para uso individual",
        features: [
            "Análises de CV ilimitadas",
            "Histórico de análises salvo",
            "Explicação avançada com IA",
            "Gerador de e-mails (contato e rejeição)",
            "Enriquecimento de perfil (skills, experiência)",
            "Até 10 vagas salvas",
            "Análise em lote (até 20 CVs)",
        ],
        limits: [],
        highlighted: true,
        badge: "Mais popular",
    },
    {
        id: "business",
        name: "Business",
        price: "R$ 199",
        period: "/mês",
        description: "Para recrutadores, equipes de RH e agências de recrutamento",
        target: "Para equipes",
        features: [
            "Tudo do plano Pro",
            "Gestão completa de vagas",
            "Upload de múltiplos CVs por vaga",
            "Ranking automático de candidatos",
            "Histórico por vaga",
            "Exportação de relatórios em PDF",
            "Análise em lote avançada",
            "Processamento prioritário (IA mais rápida)",
            "Até 50 vagas e 5 membros de equipe",
        ],
        limits: [],
        highlighted: false,
        badge: null,
    },
];

const STATUS_LABELS = {
    active: { label: "Ativa", color: "text-brand-success" },
    trialing: { label: "Período de teste", color: "text-brand-primary" },
    past_due: { label: "Pagamento pendente", color: "text-yellow-400" },
    canceled: { label: "Cancelada", color: "text-brand-muted" },
    inactive: { label: "Inativa", color: "text-brand-muted" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Subscribe() {
    const { subscription, loading, error, startCheckout, cancel } = useSubscription();
    const [checkoutLoading, setCheckoutLoading] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [cancelError, setCancelError] = useState(null);

    async function handleSelectPlan(planId) {
        if (planId === "free") return;
        setCheckoutLoading(planId);
        try {
            await startCheckout(planId);
        } catch (err) {
            setCheckoutLoading(null);
            alert(err?.message || "Erro ao iniciar pagamento. Tente novamente.");
        }
    }

    async function handleCancel() {
        if (!confirm("Tem certeza que deseja cancelar sua assinatura?")) return;
        setCancelLoading(true);
        setCancelError(null);
        try {
            await cancel();
        } catch (err) {
            setCancelError(err?.message || "Erro ao cancelar assinatura.");
        } finally {
            setCancelLoading(false);
        }
    }

    const activePlan = subscription?.plan ?? "free";
    const activePlanIsActive = subscription?.status === "active" || subscription?.status === "trialing";

    return (
        <div className="px-4 md:px-8 py-10 max-w-6xl mx-auto space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Planos e Assinatura</h1>
                <p className="text-brand-muted mt-1 text-sm">
                    Escolha o plano ideal para o seu perfil. Cancele a qualquer momento.
                </p>
            </div>

            {/* Current subscription status */}
            {!loading && subscription && (
                <div className="rounded-2xl border border-brand-border bg-brand-surface p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <p className="text-sm text-brand-muted">Sua assinatura atual</p>
                        <div className="flex items-center gap-3">
                            <span className="text-white font-semibold capitalize">
                                Plano {subscription.plan}
                            </span>
                            <span
                                className={cn(
                                    "text-xs font-medium",
                                    STATUS_LABELS[subscription.status]?.color ?? "text-brand-muted"
                                )}
                            >
                                {STATUS_LABELS[subscription.status]?.label ?? subscription.status}
                            </span>
                        </div>
                        {subscription.current_period_end && (
                            <p className="text-xs text-brand-muted">
                                {subscription.status === "canceled"
                                    ? "Acesso até"
                                    : "Próxima cobrança em"}{" "}
                                {new Date(subscription.current_period_end).toLocaleDateString("pt-BR")}
                            </p>
                        )}
                    </div>

                    {activePlanIsActive && subscription.plan !== "free" && (
                        <div className="shrink-0">
                            {cancelError && (
                                <p className="text-xs text-brand-error mb-2">{cancelError}</p>
                            )}
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleCancel}
                                disabled={cancelLoading}
                            >
                                {cancelLoading ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : null}
                                Cancelar assinatura
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Loading state */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 size={24} className="animate-spin text-brand-primary" />
                </div>
            )}

            {/* Error state */}
            {!loading && error && (
                <div className="flex items-center gap-3 text-brand-error bg-brand-error/10 border border-brand-error/20 rounded-xl px-4 py-3">
                    <AlertCircle size={16} className="shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Plans grid */}
            {!loading && (
                <div className="grid md:grid-cols-3 gap-6 items-stretch">
                    {PLANS.map((plan) => {
                        const isCurrent = activePlan === plan.id;
                        const isLoading = checkoutLoading === plan.id;

                        return (
                            <div
                                key={plan.id}
                                className={cn(
                                    "relative rounded-2xl border p-8 flex flex-col gap-6 h-full",
                                    plan.highlighted
                                        ? "border-brand-primary bg-brand-elevated shadow-lg shadow-brand-primary/10 md:scale-105"
                                        : "border-brand-border bg-brand-elevated"
                                )}
                            >
                                {plan.badge && (
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                                        <span className="inline-flex items-center gap-1.5 bg-brand-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                                            <Star size={10} />
                                            {plan.badge}
                                        </span>
                                    </div>
                                )}

                                <div>
                                    <span className="text-xs font-medium text-brand-muted uppercase tracking-wider">
                                        {plan.target}
                                    </span>
                                    <h3 className="text-lg font-bold mt-1">{plan.name}</h3>
                                    <div className="mt-3 flex items-end gap-1">
                                        <span className="text-3xl font-bold">{plan.price}</span>
                                        <span className="text-brand-muted text-sm mb-1">
                                            {plan.period}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-brand-muted text-sm">{plan.description}</p>
                                </div>

                                <ul className="space-y-2.5 flex-1">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2 text-sm">
                                            <Check
                                                size={14}
                                                className="text-brand-success shrink-0 mt-0.5"
                                            />
                                            {feature}
                                        </li>
                                    ))}
                                    {plan.limits.map((limit) => (
                                        <li
                                            key={limit}
                                            className="flex items-start gap-2 text-sm text-brand-muted"
                                        >
                                            <X size={14} className="text-brand-muted shrink-0 mt-0.5" />
                                            {limit}
                                        </li>
                                    ))}
                                </ul>

                                {isCurrent && activePlanIsActive ? (
                                    <div className="rounded-xl border border-brand-success/30 bg-brand-success/10 px-4 py-2.5 text-center text-sm text-brand-success font-medium">
                                        Plano atual
                                    </div>
                                ) : plan.id === "free" ? (
                                    <div className="rounded-xl border border-brand-border px-4 py-2.5 text-center text-sm text-brand-muted">
                                        Gratuito — sem ação necessária
                                    </div>
                                ) : (
                                    <Button
                                        variant={plan.highlighted ? "primary" : "secondary"}
                                        size="full"
                                        onClick={() => handleSelectPlan(plan.id)}
                                        disabled={isLoading || checkoutLoading !== null}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin" />
                                                Redirecionando...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard size={14} />
                                                Assinar agora
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <p className="text-center text-brand-muted text-xs">
                Pagamento processado com segurança via Stripe. Cancele a qualquer momento.
            </p>
        </div>
    );
}
