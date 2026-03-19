import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { TagInput } from "../components/ui/TagInput";
import { useAuth } from "../context/AuthContext";
import {
    addEducation,
    addExperience,
    deleteEducation,
    deleteExperience,
    getMyProfile,
    updateMyProfile,
} from "../services/profileApi";

const SENIORITY_OPTIONS = [
    { value: "", label: "Selecione..." },
    { value: "junior", label: "Junior" },
    { value: "pleno", label: "Pleno" },
    { value: "senior", label: "Senior" },
    { value: "lead", label: "Lead" },
    { value: "especialista", label: "Especialista" },
];

const inputClass =
    "w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm";

const labelClass = "block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1";

// ---------------------------------------------------------------------------
// Experience Modal
// ---------------------------------------------------------------------------
function ExperienceModal({ isOpen, onClose, onSave }) {
    const [form, setForm] = useState({
        company: "", position: "", start_date: "", end_date: "", is_current: false, description: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSave({ ...form, end_date: form.is_current ? null : form.end_date || null });
            setForm({ company: "", position: "", start_date: "", end_date: "", is_current: false, description: "" });
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Experiência">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Empresa *</label>
                        <input className={inputClass} required value={form.company}
                            onChange={(e) => setForm({ ...form, company: e.target.value })} />
                    </div>
                    <div>
                        <label className={labelClass}>Cargo *</label>
                        <input className={inputClass} required value={form.position}
                            onChange={(e) => setForm({ ...form, position: e.target.value })} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Data de Início *</label>
                        <input type="date" className={inputClass} required value={form.start_date}
                            onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
                    </div>
                    <div>
                        <label className={labelClass}>Data de Término</label>
                        <input type="date" className={inputClass} value={form.end_date}
                            disabled={form.is_current}
                            onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
                    </div>
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input type="checkbox" checked={form.is_current}
                        onChange={(e) => setForm({ ...form, is_current: e.target.checked })}
                        className="rounded border-slate-600 bg-slate-700 text-blue-500"
                    />
                    Trabalho aqui atualmente
                </label>
                <div>
                    <label className={labelClass}>Descrição</label>
                    <textarea rows={3} className={inputClass + " resize-none"} value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancelar</Button>
                    <Button type="submit" variant="indigo" size="sm" disabled={isLoading}>
                        {isLoading ? "Salvando..." : "Adicionar"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

// ---------------------------------------------------------------------------
// Education Modal
// ---------------------------------------------------------------------------
function EducationModal({ isOpen, onClose, onSave }) {
    const [form, setForm] = useState({
        institution: "", degree: "", field_of_study: "", start_date: "", end_date: "", description: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSave({ ...form, end_date: form.end_date || null, field_of_study: form.field_of_study || null });
            setForm({ institution: "", degree: "", field_of_study: "", start_date: "", end_date: "", description: "" });
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Educação">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className={labelClass}>Instituição *</label>
                    <input className={inputClass} required value={form.institution}
                        onChange={(e) => setForm({ ...form, institution: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Grau *</label>
                        <input className={inputClass} placeholder="ex: Bacharelado" required value={form.degree}
                            onChange={(e) => setForm({ ...form, degree: e.target.value })} />
                    </div>
                    <div>
                        <label className={labelClass}>Área de Estudo</label>
                        <input className={inputClass} value={form.field_of_study}
                            onChange={(e) => setForm({ ...form, field_of_study: e.target.value })} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Data de Início *</label>
                        <input type="date" className={inputClass} required value={form.start_date}
                            onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
                    </div>
                    <div>
                        <label className={labelClass}>Data de Término</label>
                        <input type="date" className={inputClass} value={form.end_date}
                            onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
                    </div>
                </div>
                <div>
                    <label className={labelClass}>Descrição</label>
                    <textarea rows={3} className={inputClass + " resize-none"} value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancelar</Button>
                    <Button type="submit" variant="indigo" size="sm" disabled={isLoading}>
                        {isLoading ? "Salvando..." : "Adicionar"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

// ---------------------------------------------------------------------------
// Profile Page
// ---------------------------------------------------------------------------
export default function Profile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [expModal, setExpModal] = useState(false);
    const [eduModal, setEduModal] = useState(false);

    const [form, setForm] = useState({
        title: "", location: "", contact_email: "", phone: "",
        linkedin_url: "", github_url: "", portfolio_url: "",
        seniority: "", years_experience: "", current_position: "", current_company: "",
        technical_skills: [], soft_skills: [], languages: [],
    });

    useEffect(() => {
        getMyProfile()
            .then((data) => {
                setProfile(data);
                setForm({
                    title: data.title || "",
                    location: data.location || "",
                    contact_email: data.contact_email || "",
                    phone: data.phone || "",
                    linkedin_url: data.linkedin_url || "",
                    github_url: data.github_url || "",
                    portfolio_url: data.portfolio_url || "",
                    seniority: data.seniority || "",
                    years_experience: data.years_experience ?? "",
                    current_position: data.current_position || "",
                    current_company: data.current_company || "",
                    technical_skills: data.technical_skills || [],
                    soft_skills: data.soft_skills || [],
                    languages: data.languages || [],
                });
            })
            .catch(() => {})
            .finally(() => setIsLoading(false));
    }, []);

    const handleField = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveSuccess(false);
        try {
            const updated = await updateMyProfile({
                ...form,
                years_experience: form.years_experience !== "" ? Number(form.years_experience) : null,
                seniority: form.seniority || null,
            });
            setProfile(updated);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddExperience = async (data) => {
        const exp = await addExperience(data);
        setProfile((prev) => ({ ...prev, experiences: [exp, ...prev.experiences] }));
    };

    const handleDeleteExperience = async (id) => {
        await deleteExperience(id);
        setProfile((prev) => ({ ...prev, experiences: prev.experiences.filter((e) => e.id !== id) }));
    };

    const handleAddEducation = async (data) => {
        const edu = await addEducation(data);
        setProfile((prev) => ({ ...prev, education: [edu, ...prev.education] }));
    };

    const handleDeleteEducation = async (id) => {
        await deleteEducation(id);
        setProfile((prev) => ({ ...prev, education: prev.education.filter((e) => e.id !== id) }));
    };

    if (isLoading) {
        return (
            <div className="px-8 py-10">
                <p className="text-slate-400 text-sm">Carregando perfil...</p>
            </div>
        );
    }

    return (
        <div className="px-6 py-8 max-w-5xl space-y-6">
            <h1 className="text-2xl font-bold text-slate-100">Perfil</h1>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Informações Pessoais */}
                <Card className="p-6 space-y-5">
                    <h2 className="text-base font-semibold text-slate-100">Informações Pessoais</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Nome Completo <span className="text-red-400">*</span></label>
                            <input className={inputClass} value={user?.full_name || ""} readOnly
                                style={{ opacity: 0.7, cursor: "not-allowed" }} />
                        </div>
                        <div>
                            <label className={labelClass}>Título</label>
                            <input className={inputClass} placeholder="ex: Full-stack Developer"
                                value={form.title} onChange={handleField("title")} />
                        </div>
                        <div>
                            <label className={labelClass}>Localização</label>
                            <input className={inputClass} placeholder="ex: São Paulo, SP"
                                value={form.location} onChange={handleField("location")} />
                        </div>
                        <div>
                            <label className={labelClass}>Email de Contato</label>
                            <input type="email" className={inputClass}
                                value={form.contact_email} onChange={handleField("contact_email")} />
                        </div>
                        <div>
                            <label className={labelClass}>Telefone</label>
                            <input className={inputClass} placeholder="(XX) XXXXX-XXXX"
                                value={form.phone} onChange={handleField("phone")} />
                        </div>
                        <div>
                            <label className={labelClass}>LinkedIn</label>
                            <input className={inputClass} placeholder="https://linkedin.com/in/..."
                                value={form.linkedin_url} onChange={handleField("linkedin_url")} />
                        </div>
                        <div>
                            <label className={labelClass}>GitHub</label>
                            <input className={inputClass} placeholder="https://github.com/..."
                                value={form.github_url} onChange={handleField("github_url")} />
                        </div>
                        <div>
                            <label className={labelClass}>Portfólio</label>
                            <input className={inputClass} placeholder="https://..."
                                value={form.portfolio_url} onChange={handleField("portfolio_url")} />
                        </div>
                    </div>
                </Card>

                {/* Dados Profissionais */}
                <Card className="p-6 space-y-5">
                    <h2 className="text-base font-semibold text-slate-100">Dados Profissionais</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Senioridade</label>
                            <select className={inputClass} value={form.seniority} onChange={handleField("seniority")}>
                                {SENIORITY_OPTIONS.map(({ value, label }) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Anos de Experiência</label>
                            <input type="number" min="0" max="60" className={inputClass}
                                value={form.years_experience} onChange={handleField("years_experience")} />
                        </div>
                        <div>
                            <label className={labelClass}>Cargo Atual</label>
                            <input className={inputClass} placeholder="ex: Tech Lead"
                                value={form.current_position} onChange={handleField("current_position")} />
                        </div>
                        <div>
                            <label className={labelClass}>Empresa Atual</label>
                            <input className={inputClass} placeholder="ex: Acme Corp"
                                value={form.current_company} onChange={handleField("current_company")} />
                        </div>
                    </div>
                </Card>

                {/* Skills */}
                <Card className="p-6 space-y-4">
                    <h2 className="text-base font-semibold text-slate-100">Skills</h2>
                    <div>
                        <label className={labelClass}>Skills técnicas</label>
                        <TagInput
                            value={form.technical_skills}
                            onChange={(v) => setForm({ ...form, technical_skills: v })}
                            placeholder="Pressione Enter ou vírgula para adicionar"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Soft skills</label>
                        <TagInput
                            value={form.soft_skills}
                            onChange={(v) => setForm({ ...form, soft_skills: v })}
                            placeholder="Pressione Enter ou vírgula para adicionar"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Idiomas</label>
                        <TagInput
                            value={form.languages}
                            onChange={(v) => setForm({ ...form, languages: v })}
                            placeholder="Pressione Enter ou vírgula para adicionar"
                        />
                    </div>
                </Card>

                <div className="flex items-center gap-4">
                    <Button type="submit" variant="indigo" size="lg" disabled={isSaving}>
                        {isSaving ? "Salvando..." : "Salvar Perfil"}
                    </Button>
                    {saveSuccess && (
                        <p className="text-green-400 text-sm">Perfil salvo com sucesso!</p>
                    )}
                </div>
            </form>

            {/* Experiências */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-slate-100">Experiências</h2>
                    <Button type="button" variant="secondary" size="sm" onClick={() => setExpModal(true)}>
                        <Plus size={15} /> Adicionar
                    </Button>
                </div>
                {profile?.experiences?.length > 0 ? (
                    <div className="space-y-3">
                        {profile.experiences.map((exp) => (
                            <div key={exp.id} className="flex items-start justify-between bg-slate-700/40 border border-slate-700 rounded-xl p-4">
                                <div>
                                    <p className="text-slate-100 font-medium text-sm">{exp.position}</p>
                                    <p className="text-slate-400 text-sm">{exp.company}</p>
                                    <p className="text-slate-500 text-xs mt-1">
                                        {exp.start_date} → {exp.is_current ? "Atual" : exp.end_date || "—"}
                                    </p>
                                    {exp.description && (
                                        <p className="text-slate-400 text-xs mt-1 leading-relaxed">{exp.description}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleDeleteExperience(exp.id)}
                                    className="text-slate-500 hover:text-red-400 transition-colors ml-4 flex-shrink-0"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-500 text-sm">Nenhuma experiência adicionada.</p>
                )}
            </Card>

            {/* Educação */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-slate-100">Educação</h2>
                    <Button type="button" variant="secondary" size="sm" onClick={() => setEduModal(true)}>
                        <Plus size={15} /> Adicionar
                    </Button>
                </div>
                {profile?.education?.length > 0 ? (
                    <div className="space-y-3">
                        {profile.education.map((edu) => (
                            <div key={edu.id} className="flex items-start justify-between bg-slate-700/40 border border-slate-700 rounded-xl p-4">
                                <div>
                                    <p className="text-slate-100 font-medium text-sm">{edu.degree}{edu.field_of_study ? ` em ${edu.field_of_study}` : ""}</p>
                                    <p className="text-slate-400 text-sm">{edu.institution}</p>
                                    <p className="text-slate-500 text-xs mt-1">
                                        {edu.start_date} → {edu.end_date || "Em andamento"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeleteEducation(edu.id)}
                                    className="text-slate-500 hover:text-red-400 transition-colors ml-4 flex-shrink-0"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-500 text-sm">Nenhuma educação adicionada.</p>
                )}
            </Card>

            <ExperienceModal isOpen={expModal} onClose={() => setExpModal(false)} onSave={handleAddExperience} />
            <EducationModal isOpen={eduModal} onClose={() => setEduModal(false)} onSave={handleAddEducation} />
        </div>
    );
}
