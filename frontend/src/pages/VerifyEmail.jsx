import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import { verifyEmail } from "../services/authApi";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("loading");
    const calledRef = useRef(false);

    useEffect(() => {
        if (calledRef.current) return;
        calledRef.current = true;

        const token = searchParams.get("token");
        if (!token) {
            setStatus("error");
            return;
        }
        verifyEmail(token)
            .then(() => setStatus("success"))
            .catch(() => setStatus("error"));
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10 text-center max-w-md w-full shadow-lg">
                {status === "loading" && (
                    <p className="text-slate-400">Verificando seu email...</p>
                )}
                {status === "success" && (
                    <>
                        <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
                        <h1 className="text-xl font-bold text-slate-100 mb-2">Email verificado!</h1>
                        <p className="text-slate-400 text-sm mb-6">
                            Sua conta está ativa. Faça login para começar.
                        </p>
                        <Link
                            to="/account"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
                        >
                            Fazer Login
                        </Link>
                    </>
                )}
                {status === "error" && (
                    <>
                        <XCircle size={48} className="text-red-400 mx-auto mb-4" />
                        <h1 className="text-xl font-bold text-slate-100 mb-2">Link inválido</h1>
                        <p className="text-slate-400 text-sm mb-6">
                            Este link de verificação é inválido ou já expirou.
                        </p>
                        <Link
                            to="/account"
                            className="bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-600 font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
                        >
                            Voltar ao Login
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
