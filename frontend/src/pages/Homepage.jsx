import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/layout/Navbar";
import { Button } from "../components/ui/Button";
import { cn } from "../utils/cn";
import {
    Check,
    X,
    Brain,
    TrendingUp,
    FileText,
    BarChart2,
    Zap,
    Target,
    UserCheck,
    ListChecks,
    Building2,
    Star,
    AlertCircle,
    ArrowRight,
    Sparkles,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const PROBLEMS = [
    {
        persona: "Recrutadores",
        icon: Building2,
        color: "text-brand-primary",
        bgColor: "bg-brand-primary/10",
        items: [
            "Triagem manual leva horas ou dias",
            "Decisões subjetivas e inconsistentes",
            "Dificuldade em comparar candidatos",
            "Informações importantes passam despercebidas",
        ],
    },
    {
        persona: "Candidatos",
        icon: UserCheck,
        color: "text-brand-violet",
        bgColor: "bg-brand-violet/10",
        items: [
            "Não sabem por que foram rejeitados",
            "CV com falhas que não percebem",
            "Sem feedback sobre pontos de melhoria",
            "Dificuldade em se preparar para entrevistas",
        ],
    },
];

const SOLUTION_FEATURES = [
    {
        icon: Brain,
        color: "text-brand-primary",
        bg: "bg-brand-primary/10",
        title: "Análise instantânea por IA",
        description:
            "Nossa IA processa CVs em segundos, extraindo informações relevantes e comparando com os requisitos da vaga.",
    },
    {
        icon: BarChart2,
        color: "text-brand-teal",
        bg: "bg-brand-teal/10",
        title: "Score de compatibilidade",
        description:
            "Cada candidato recebe uma pontuação clara de compatibilidade com a vaga, facilitando a tomada de decisão.",
    },
    {
        icon: Target,
        color: "text-brand-violet",
        bg: "bg-brand-violet/10",
        title: "Insights detalhados",
        description:
            "Identifica habilidades ausentes, pontos fortes e fornece um raciocínio objetivo sobre cada candidato.",
    },
];

const BEFORE_ITEMS = [
    "Processo manual e demorado",
    "Decisões subjetivas",
    "Perda de tempo com triagem",
    "Critérios pouco claros",
    "Informações importantes ignoradas",
    "Sem feedback para candidatos",
];

const AFTER_ITEMS = [
    "Análise automática com IA",
    "Score claro e objetivo",
    "Triagem em segundos",
    "Critérios padronizados",
    "Insights detalhados por candidato",
    "Feedback estruturado disponível",
];

const CANDIDATE_FEATURES = [
    { icon: Brain, label: "Análise inteligente do seu CV" },
    { icon: AlertCircle, label: "Identificação de pontos fracos" },
    { icon: ListChecks, label: "Sugestões de melhoria personalizadas" },
    { icon: Target, label: "Preparação para entrevistas" },
];

const RECRUITER_FEATURES = [
    { icon: FileText, label: "Upload de múltiplos CVs de uma vez" },
    { icon: BarChart2, label: "Ranking automático de candidatos" },
    { icon: Zap, label: "Análise por descrição de vaga" },
    { icon: TrendingUp, label: "Geração de insights e relatórios" },
];

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

// ─── Component ───────────────────────────────────────────────────────────────

export default function Homepage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handlePlanCTA = (planId) => {
        if (isAuthenticated) {
            navigate("/subscribe");
        } else {
            const params = planId === "business" ? "?plan=business" : "";
            navigate(`/comecar${params}`);
        }
    };

    const handleHeroCTA = () => {
        navigate(isAuthenticated ? "/dashboard" : "/comecar");
    };

    const scrollToPlans = () => {
        document.getElementById("planos")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-brand-dark text-white">
            <Navbar />

            {/* ── 1. Hero ──────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden py-28 md:py-40 px-4">
                <div className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-brand-primary/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-brand-violet/10 blur-3xl" />

                <div className="relative mx-auto max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-surface px-4 py-1.5 text-sm text-brand-muted mb-8">
                        <Sparkles size={14} className="text-brand-primary" />
                        Powered by Inteligência Artificial
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
                        Triagem de CVs com{" "}
                        <span className="bg-linear-to-r from-brand-primary to-brand-violet bg-clip-text text-transparent">
                            Inteligência Artificial
                        </span>
                    </h1>

                    <p className="mt-6 text-lg md:text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed">
                        Pare de perder horas analisando CVs manualmente. O HR Hero usa IA para
                        triagem instantânea, ranking automático e insights precisos — para
                        recrutadores e candidatos.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="primary" size="lg" onClick={handleHeroCTA}>
                            Começar agora
                            <ArrowRight size={16} />
                        </Button>
                        <Button variant="secondary" size="lg" onClick={scrollToPlans}>
                            Ver planos
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── 2. Problem ───────────────────────────────────────────────── */}
            <section className="py-20 px-4 bg-brand-surface">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            O problema que nós resolvemos
                        </h2>
                        <p className="mt-4 text-brand-muted text-lg max-w-2xl mx-auto">
                            O processo de triagem de CVs é lento, subjetivo e frustrante — para
                            os dois lados.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {PROBLEMS.map(({ persona, icon: Icon, color, bgColor, items }) => (
                            <div
                                key={persona}
                                className="rounded-2xl border border-brand-border bg-brand-elevated p-8"
                            >
                                <div
                                    className={cn(
                                        "inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4",
                                        bgColor
                                    )}
                                >
                                    <Icon size={24} className={color} />
                                </div>
                                <h3 className="text-xl font-semibold mb-4">{persona}</h3>
                                <ul className="space-y-3">
                                    {items.map((item) => (
                                        <li
                                            key={item}
                                            className="flex items-start gap-3 text-brand-muted"
                                        >
                                            <X
                                                size={16}
                                                className="text-brand-error mt-0.5 shrink-0"
                                            />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 3. Solution ──────────────────────────────────────────────── */}
            <section id="funcionalidades" className="py-20 px-4 bg-brand-dark">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Como o HR Hero funciona
                        </h2>
                        <p className="mt-4 text-brand-muted text-lg max-w-2xl mx-auto">
                            Nossa IA analisa, pontua e classifica candidatos de forma automática e
                            objetiva.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {SOLUTION_FEATURES.map(({ icon: Icon, color, bg, title, description }) => (
                            <div
                                key={title}
                                className="rounded-2xl border border-brand-border bg-brand-surface p-8 hover:border-brand-primary/40 transition-colors"
                            >
                                <div
                                    className={cn(
                                        "inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4",
                                        bg
                                    )}
                                >
                                    <Icon size={24} className={color} />
                                </div>
                                <h3 className="text-lg font-semibold mb-3">{title}</h3>
                                <p className="text-brand-muted text-sm leading-relaxed">
                                    {description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 4. Before vs After ───────────────────────────────────────── */}
            <section className="py-20 px-4 bg-brand-surface">
                <div className="mx-auto max-w-5xl">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Antes e depois do HR Hero
                        </h2>
                        <p className="mt-4 text-brand-muted text-lg max-w-2xl mx-auto">
                            Veja como a sua rotina de recrutamento muda com o uso de IA.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Before */}
                        <div className="rounded-2xl border border-brand-error/30 bg-brand-elevated p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-error/10">
                                    <X size={16} className="text-brand-error" />
                                </div>
                                <h3 className="text-xl font-bold text-brand-error">Antes</h3>
                            </div>
                            <ul className="space-y-4">
                                {BEFORE_ITEMS.map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-center gap-3 text-brand-muted"
                                    >
                                        <X size={15} className="text-brand-error shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* After */}
                        <div className="rounded-2xl border border-brand-success/30 bg-brand-elevated p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-success/10">
                                    <Check size={16} className="text-brand-success" />
                                </div>
                                <h3 className="text-xl font-bold text-brand-success">Depois</h3>
                            </div>
                            <ul className="space-y-4">
                                {AFTER_ITEMS.map((item) => (
                                    <li key={item} className="flex items-center gap-3">
                                        <Check
                                            size={15}
                                            className="text-brand-success shrink-0"
                                        />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 5. Features by Persona ───────────────────────────────────── */}
            <section className="py-20 px-4 bg-brand-dark">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Para cada perfil, uma solução
                        </h2>
                        <p className="mt-4 text-brand-muted text-lg max-w-2xl mx-auto">
                            O HR Hero atende tanto candidatos quanto recrutadores com
                            funcionalidades específicas.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Candidates */}
                        <div className="rounded-2xl border border-brand-border bg-brand-surface p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-violet/10">
                                    <UserCheck size={20} className="text-brand-violet" />
                                </div>
                                <h3 className="text-xl font-semibold">Para Candidatos</h3>
                            </div>
                            <ul className="space-y-4">
                                {CANDIDATE_FEATURES.map(({ icon: Icon, label }) => (
                                    <li key={label} className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-violet/10 shrink-0">
                                            <Icon size={15} className="text-brand-violet" />
                                        </div>
                                        <span className="text-brand-muted text-sm">{label}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Recruiters */}
                        <div className="rounded-2xl border border-brand-border bg-brand-surface p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-primary/10">
                                    <Building2 size={20} className="text-brand-primary" />
                                </div>
                                <h3 className="text-xl font-semibold">Para Recrutadores</h3>
                            </div>
                            <ul className="space-y-4">
                                {RECRUITER_FEATURES.map(({ icon: Icon, label }) => (
                                    <li key={label} className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-primary/10 shrink-0">
                                            <Icon size={15} className="text-brand-primary" />
                                        </div>
                                        <span className="text-brand-muted text-sm">{label}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 6. Pricing ───────────────────────────────────────────────── */}
            <section id="planos" className="py-20 px-4 bg-brand-surface">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold">Planos e preços</h2>
                        <p className="mt-4 text-brand-muted text-lg max-w-2xl mx-auto">
                            Escolha o plano ideal para o seu perfil. Comece grátis e escale
                            conforme sua necessidade.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 items-stretch">
                        {PLANS.map((plan) => (
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
                                    <p className="mt-2 text-brand-muted text-sm">
                                        {plan.description}
                                    </p>
                                </div>

                                <ul className="space-y-2.5 flex-1">
                                    {plan.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-start gap-2 text-sm"
                                        >
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
                                            <X
                                                size={14}
                                                className="text-brand-muted shrink-0 mt-0.5"
                                            />
                                            {limit}
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    variant={plan.highlighted ? "primary" : "secondary"}
                                    size="full"
                                    onClick={() => handlePlanCTA(plan.id)}
                                >
                                    Escolher plano
                                </Button>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-brand-muted text-sm mt-8">
                        Cancele a qualquer momento. Sem contratos, sem taxas ocultas. Experimente o poder da IA no recrutamento hoje mesmo!
                    </p>
                </div>
            </section>

            {/* ── 7. Final CTA ─────────────────────────────────────────────── */}
            <section className="relative overflow-hidden py-28 px-4 bg-brand-dark">
                <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-brand-primary/10 via-transparent to-brand-violet/10" />
                <div className="relative mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                        Pronto para transformar seu processo de recrutamento?
                    </h2>
                    <p className="mt-6 text-lg text-brand-muted max-w-xl mx-auto">
                        Comece agora mesmo — sem cartão de crédito. Experimente o plano gratuito
                        e veja a diferença.
                    </p>
                    <div className="mt-10">
                        <Button variant="primary" size="lg" onClick={handleHeroCTA}>
                            Começar agora
                            <ArrowRight size={16} />
                        </Button>
                    </div>
                </div>
            </section>

            {/* ── Footer ───────────────────────────────────────────────────── */}
            <footer className="border-t border-brand-border bg-brand-dark py-10 px-4">
                <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2 text-white font-bold text-lg">
                        HR Hero
                        <span className="w-2 h-2 rounded-full bg-brand-primary inline-block" />
                    </div>
                    <p className="text-brand-muted text-sm text-center">
                        © {new Date().getFullYear()} HR Hero. Todos os direitos reservados.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-brand-muted">
                        <a href="#" className="hover:text-white transition-colors">
                            Privacidade
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                            Termos de uso
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                            Contato
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
