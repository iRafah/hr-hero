import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "../components/ui/Button";
import { FileUpload } from "../features/analysis/components/FileUpload";
import { CVAnalysisResults } from "../features/analysis/components/CVAnalysisResults";
import { useAnalysis } from "../features/analysis/hooks/useAnalysis";
import LoadingIcon from "../components/LoadingIcon";

export default function Analyse() {
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [files, setFiles] = useState([]);
    const { isLoading, results, error, runAnalysis } = useAnalysis();

    const isValid = jobTitle.trim() && jobDescription.trim() && files.length > 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid) return;
        await runAnalysis({ jobTitle, jobDescription, files });
    };

    return (
        <div className="px-6 py-8 max-w-3xl space-y-6">
            <h1 className="text-2xl font-bold text-slate-100">Análise de CV</h1>

            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 space-y-6">
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="jobTitle">
                            Título da Vaga
                        </label>
                        <input
                            id="jobTitle"
                            type="text"
                            placeholder="ex: Desenvolvedor Full-Stack"
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="jobDescription">
                            Descrição da Vaga
                        </label>
                        <textarea
                            id="jobDescription"
                            rows={5}
                            placeholder="Cole aqui a descrição da vaga"
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </div>

                    <FileUpload onFileSelect={setFiles} />

                    <Button
                        type="submit"
                        variant={isLoading ? "secondary" : "success"}
                        size="full"
                        disabled={isLoading || !isValid}
                    >
                        {isLoading ? (
                            <><LoadingIcon /> Analisando...</>
                        ) : (
                            <>Analisar CV <Search size={16} /></>
                        )}
                    </Button>
                </form>

                {error && (
                    <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg px-4 py-3 text-sm">
                        {error}
                    </div>
                )}

                {!isLoading && results && results.map((result, i) => (
                    <CVAnalysisResults key={i} result={result} />
                ))}

                {!isLoading && !results && !error && (
                    <p className="text-slate-500 italic text-sm text-center py-4">
                        Nenhum resultado ainda. Envie um CV para começar.
                    </p>
                )}
            </div>
        </div>
    );
}
