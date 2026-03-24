import { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
    getRecruiterProfile,
    updateMyUser,
    updateRecruiterProfile,
} from "../../services/profileApi";

const COMPANY_SIZE_OPTIONS = [
    { value: "", label: "Selecione..." },
    { value: "1-10", label: "1-10 funcionários" },
    { value: "11-50", label: "11-50 funcionários" },
    { value: "51-200", label: "51-200 funcionários" },
    { value: "200+", label: "200+ funcionários" },
];

const inputClass =
    "w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm";

const labelClass = "block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1";

export default function RecruiterProfileForm({ user }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const [form, setForm] = useState({
        full_name: user?.full_name || "",
        company_name: "",
        company_website: "",
        company_size: "",
        industry: "",
        role_title: "",
        hiring_volume: "",
        country: "",
        timezone: "",
    });

    useEffect(() => {
        getRecruiterProfile()
            .then((data) => {
                setForm({
                    full_name: user?.full_name || "",
                    company_name: data.company_name || "",
                    company_website: data.company_website || "",
                    company_size: data.company_size || "",
                    industry: data.industry || "",
                    role_title: data.role_title || "",
                    hiring_volume: data.hiring_volume ?? "",
                    country: data.country || "",
                    timezone: data.timezone || "",
                });
            })
            .catch(() => {
                setForm((prev) => ({ ...prev, full_name: user?.full_name || "" }));
            })
            .finally(() => setIsLoading(false));
    }, []);

    const handleField = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveSuccess(false);
        try {
            const { full_name, ...profileFields } = form;
            await Promise.all([
                updateRecruiterProfile({
                    ...profileFields,
                    company_size: profileFields.company_size || null,
                    hiring_volume: profileFields.hiring_volume !== "" ? Number(profileFields.hiring_volume) : null,
                }),
                full_name.trim() !== (user?.full_name || "") && updateMyUser({ full_name }),
            ]);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <p className="text-slate-400 text-sm">Carregando perfil...</p>;
    }

    return (
        <form onSubmit={handleSave} className="space-y-6">
            {/* Informações Pessoais */}
            <Card className="p-4 sm:p-6 space-y-5">
                <h2 className="text-base font-semibold text-slate-100">Informações Pessoais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Nome Completo <span className="text-red-400">*</span></label>
                        <input className={inputClass} value={form.full_name} onChange={handleField("full_name")} />
                    </div>
                    <div>
                        <label className={labelClass}>Cargo / Função</label>
                        <input className={inputClass} placeholder="ex: HR Manager, Tech Recruiter"
                            value={form.role_title} onChange={handleField("role_title")} />
                    </div>
                </div>
            </Card>

            {/* Dados da Empresa */}
            <Card className="p-4 sm:p-6 space-y-5">
                <h2 className="text-base font-semibold text-slate-100">Dados da Empresa</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Nome da Empresa</label>
                        <input className={inputClass} placeholder="ex: Acme Corp"
                            value={form.company_name} onChange={handleField("company_name")} />
                    </div>
                    <div>
                        <label className={labelClass}>Site da Empresa</label>
                        <input className={inputClass} placeholder="https://..."
                            value={form.company_website} onChange={handleField("company_website")} />
                    </div>
                    <div>
                        <label className={labelClass}>Tamanho da Empresa</label>
                        <select className={inputClass} value={form.company_size} onChange={handleField("company_size")}>
                            {COMPANY_SIZE_OPTIONS.map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Setor / Indústria</label>
                        <input className={inputClass} placeholder="ex: Fintech, Saúde, Varejo"
                            value={form.industry} onChange={handleField("industry")} />
                    </div>
                    <div>
                        <label className={labelClass}>Volume de Contratações / mês</label>
                        <input type="number" min="0" className={inputClass}
                            placeholder="ex: 5"
                            value={form.hiring_volume} onChange={handleField("hiring_volume")} />
                    </div>
                </div>
            </Card>

            {/* Localização */}
            <Card className="p-4 sm:p-6 space-y-5">
                <h2 className="text-base font-semibold text-slate-100">Localização</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>País</label>
                        <input className={inputClass} placeholder="ex: Brasil"
                            value={form.country} onChange={handleField("country")} />
                    </div>
                    <div>
                        <label className={labelClass}>Fuso Horário</label>
                        <input className={inputClass} placeholder="ex: America/Sao_Paulo"
                            value={form.timezone} onChange={handleField("timezone")} />
                    </div>
                </div>
            </Card>

            <div className="flex items-center gap-4">
                <Button type="submit" variant="indigo" size="lg" disabled={isSaving}>
                    {isSaving ? "Salvando..." : "Salvar Perfil"}
                </Button>
                {saveSuccess && <p className="text-green-400 text-sm">Perfil salvo com sucesso!</p>}
            </div>
        </form>
    );
}
