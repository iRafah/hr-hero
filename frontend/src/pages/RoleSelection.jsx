import { useNavigate, useSearchParams } from "react-router-dom";
import { UserCheck, Building2, ArrowLeft, Brain, ListChecks, Target, FileText, BarChart2, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/Button";
import { cn } from "../utils/cn";

const ROLES = [
    {
        id: "candidate",
        label: "Candidato",
        sublabel: "Melhorar meu CV",
        icon: UserCheck,
        accent: "brand-violet",
        borderActive: "border-brand-violet",
        iconBg: "bg-brand-violet/10",
        iconColor: "text-brand-violet",
        badgeBg: "bg-brand-violet/10 text-brand-violet",
        features: [
            { icon: Brain, label: "Análise de CV com IA" },
            { icon: ListChecks, label: "Identificação de pontos fracos" },
            { icon: Target, label: "Sugestões de melhoria" },
            { icon: UserCheck, label: "Preparação para entrevistas" },
        ],
    },
    {
        id: "recruiter",
        label: "Recrutador",
        sublabel: "Analisar candidatos",
        icon: Building2,
        accent: "brand-primary",
        borderActive: "border-brand-primary",
        iconBg: "bg-brand-primary/10",
        iconColor: "text-brand-primary",
        badgeBg: "bg-brand-primary/10 text-brand-primary",
        features: [
            { icon: FileText, label: "Upload de múltiplos CVs" },
            { icon: BarChart2, label: "Ranking de candidatos" },
            { icon: TrendingUp, label: "Criação e gestão de vagas" },
            { icon: Brain, label: "Geração de insights com IA" },
        ],
    },
];

export default function RoleSelection() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const plan = searchParams.get("plan");
    const isBusinessPlan = plan === "business";

    const handleSelect = (roleId) => {
        navigate(`/account?role=${roleId}&mode=signup`);
    };

    return (
        <div className="min-h-screen bg-brand-dark text-white flex flex-col">
            {/* Header */}
            <header className="px-6 py-5 flex items-center justify-between border-b border-brand-border">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-brand-muted hover:text-white transition-colors text-sm"
                >
                    <ArrowLeft size={16} />
                    Voltar
                </button>
                <span className="font-bold text-white">HR Hero</span>
                <div className="w-16" />
            </header>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-3xl">
                    {/* Step indicator */}
                    <div className="flex justify-center mb-8">
                        <span className="inline-flex items-center gap-2 text-xs font-medium text-brand-muted border border-brand-border rounded-full px-3 py-1">
                            <span className="w-4 h-4 rounded-full bg-brand-primary text-white text-[10px] flex items-center justify-center font-bold">1</span>
                            Passo 1 de 2
                        </span>
                    </div>

                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold">
                            Como você quer usar o HR Hero?
                        </h1>
                        <p className="mt-3 text-brand-muted text-base">
                            Escolha o perfil que melhor descreve você. Você poderá alterar depois.
                        </p>
                    </div>

                    {/* Business plan notice */}
                    {isBusinessPlan && (
                        <div className="mb-6 rounded-xl border border-brand-primary/30 bg-brand-primary/5 px-4 py-3 text-sm text-brand-muted text-center">
                            O plano <span className="text-white font-medium">Business</span> é voltado para recrutadores e equipes de RH.
                        </div>
                    )}

                    {/* Role cards */}
                    <div className="grid md:grid-cols-2 gap-5">
                        {ROLES.map((role) => {
                            const Icon = role.icon;
                            const isDisabled = isBusinessPlan && role.id === "candidate";

                            return (
                                <div
                                    key={role.id}
                                    className={cn(
                                        "relative rounded-2xl border bg-brand-surface p-7 flex flex-col gap-6 transition-all",
                                        isDisabled
                                            ? "border-brand-border opacity-40 cursor-not-allowed"
                                            : "border-brand-border hover:border-opacity-80 cursor-pointer hover:bg-brand-elevated",
                                        isBusinessPlan && role.id === "recruiter" && "border-brand-primary ring-1 ring-brand-primary/30"
                                    )}
                                    onClick={() => !isDisabled && handleSelect(role.id)}
                                >
                                    {/* Icon + title */}
                                    <div className="flex items-start gap-4">
                                        <div className={cn("flex items-center justify-center w-12 h-12 rounded-xl shrink-0", role.iconBg)}>
                                            <Icon size={24} className={role.iconColor} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">{role.label}</h2>
                                            <p className="text-brand-muted text-sm mt-0.5">{role.sublabel}</p>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-3 flex-1">
                                        {role.features.map(({ icon: FeatIcon, label }) => (
                                            <li key={label} className="flex items-center gap-3">
                                                <div className={cn("flex items-center justify-center w-7 h-7 rounded-lg shrink-0", role.iconBg)}>
                                                    <FeatIcon size={13} className={role.iconColor} />
                                                </div>
                                                <span className="text-sm text-brand-muted">{label}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA */}
                                    <Button
                                        variant={role.id === "recruiter" ? "primary" : "secondary"}
                                        size="full"
                                        disabled={isDisabled}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isDisabled) handleSelect(role.id);
                                        }}
                                    >
                                        Escolher
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
