import { motion } from "framer-motion";
import { MdAnalytics } from "react-icons/md";
import { CheckCircle, Pin, Brain, Search } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";

function extractScore(text) {
    return parseInt(String(text || "").replace(/\D/g, ""), 10) || 0;
}

export function CVAnalysisResults({ result }) {
    const score = extractScore(result.match_score);
    const isGood = score >= 70;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full mt-5"
        >
            <Card className="p-6 space-y-5">
                <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                    <MdAnalytics className="text-blue-400 text-xl" />
                    {result.candidate_name
                        ? `${result.candidate_name} · ${result.filename}`
                        : "CV Analysis Results"}
                </h2>

                <hr className="border-slate-700" />

                {/* Match Score */}
                <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                        <Search size={12} /> Match Score
                    </p>
                    <p className={`text-4xl font-bold ${isGood ? "text-green-400" : "text-red-400"}`}>
                        {result.match_score}
                    </p>
                </div>

                {/* Missing Skills */}
                <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                        <Pin size={12} /> Missing Skills
                    </p>
                    {result.missing_skills?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {result.missing_skills.map((skill, i) => (
                                <Badge key={i} variant="danger">{skill}</Badge>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-green-400 text-sm bg-green-900/20 border border-green-800 px-3 py-2 rounded-lg">
                            <CheckCircle size={15} /> All required skills covered.
                        </div>
                    )}
                </div>

                {/* Reasoning */}
                <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                        <Brain size={12} /> Summary
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed">{result.reasoning}</p>
                </div>
            </Card>
        </motion.div>
    );
}

export default CVAnalysisResults;
