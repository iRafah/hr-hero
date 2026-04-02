import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import api from "../services/api";

export default function SubscribeSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");

    const [state, setState] = useState("loading"); // "loading" | "success" | "error"
    const [plan, setPlan] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (!sessionId) {
            setState("error");
            setErrorMessage("ID de sessão não encontrado.");
            return;
        }

        api.get(`/api/v1/subscriptions/verify-checkout?session_id=${sessionId}`)
            .then((res) => {
                setPlan(res.data.plan);
                setState("success");
            })
            .catch((err) => {
                setErrorMessage(
                    err?.response?.data?.detail || "Não foi possível confirmar o pagamento."
                );
                setState("error");
            });
    }, [sessionId]);

    // Auto-redirect after success
    useEffect(() => {
        if (state !== "success") return;
        const timer = setTimeout(() => navigate("/dashboard"), 5000);
        return () => clearTimeout(timer);
    }, [state, navigate]);

    if (state === "loading") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                <Loader2 size={32} className="animate-spin text-brand-primary" />
                <p className="text-brand-muted text-sm">Confirmando seu pagamento...</p>
            </div>
        );
    }

    if (state === "error") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 space-y-6">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-brand-error/10">
                    <AlertCircle size={40} className="text-brand-error" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-white">Algo deu errado</h1>
                    <p className="text-brand-muted max-w-sm text-sm">{errorMessage}</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => navigate("/subscribe")}>
                        Ver planos
                    </Button>
                    <Button variant="primary" onClick={() => navigate("/dashboard")}>
                        Ir para o Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 space-y-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-brand-success/10">
                <CheckCircle size={40} className="text-brand-success" />
            </div>

            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">Assinatura ativada!</h1>
                <p className="text-brand-muted max-w-sm">
                    Seu pagamento foi confirmado. Você agora tem acesso ao plano{" "}
                    <span className="text-white font-semibold capitalize">{plan}</span>.
                </p>
            </div>

            <p className="text-xs text-brand-muted">
                Redirecionando ao dashboard em alguns segundos...
            </p>

            <Button variant="primary" onClick={() => navigate("/dashboard")}>
                Ir para o Dashboard
            </Button>
        </div>
    );
}
