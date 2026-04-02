import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, Star, Loader2, CreditCard } from "lucide-react";
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function Subscribe() {
    const navigate = useNavigate();
    const { subscription, loading, startCheckout } = useSubscription();

    const hasActivePlan =
        subscription &&
        subscription.plan !== "free" &&
        ["active", "trialing"].includes(subscription.status);

    // If the user already has an active paid plan, send them to subscription management
    useEffect(() => {
        if (!loading && hasActivePlan) {
            navigate("/account/subscription", { replace: true });
        }
    }, [loading, hasActivePlan, navigate]);

    async function handleSelectPlan(planId) {
        if (planId === "free") return;
        await startCheckout(planId);
    }

    if (loading || hasActivePlan) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 size={24} className="animate-spin text-brand-primary" />
            </div>
        );
    }

    return (
        <div className="px-4 md:px-8 py-10 max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Escolha seu plano</h1>
                <p className="text-brand-muted mt-1 text-sm">
                    Comece grátis e escale conforme sua necessidade. Cancele a qualquer momento.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 items-stretch">
                {PLANS.map((plan) => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        onSelect={handleSelectPlan}
                    />
                ))}
            </div>

            <p className="text-center text-brand-muted text-xs">
                Pagamento processado com segurança via Stripe. Cancele a qualquer momento.
            </p>
        </div>
    );
}

function PlanCard({ plan, onSelect }) {
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        if (plan.id === "free") return;
        setLoading(true);
        try {
            await onSelect(plan.id);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
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
                    <span className="text-brand-muted text-sm mb-1">{plan.period}</span>
                </div>
                <p className="mt-2 text-brand-muted text-sm">{plan.description}</p>
            </div>

            <ul className="space-y-2.5 flex-1">
                {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check size={14} className="text-brand-success shrink-0 mt-0.5" />
                        {feature}
                    </li>
                ))}
                {plan.limits.map((limit) => (
                    <li key={limit} className="flex items-start gap-2 text-sm text-brand-muted">
                        <X size={14} className="text-brand-muted shrink-0 mt-0.5" />
                        {limit}
                    </li>
                ))}
            </ul>

            {plan.id === "free" ? (
                <div className="rounded-xl border border-brand-border px-4 py-2.5 text-center text-sm text-brand-muted">
                    Plano atual — sem ação necessária
                </div>
            ) : (
                <Button
                    variant={plan.highlighted ? "primary" : "secondary"}
                    size="full"
                    onClick={handleClick}
                    disabled={loading}
                >
                    {loading ? (
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
}

// useState is used inside PlanCard — need to import it
import { useState } from "react";
