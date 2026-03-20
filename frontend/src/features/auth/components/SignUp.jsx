import { useState } from "react";
import { registerUser } from "../../../services/authApi";

function SignUpForm() {
    const [state, setState] = useState({ full_name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (state.password.length < 8) {
            setError("A senha deve ter pelo menos 8 caracteres");
            return;
        }
        setError("");
        setSuccess("");
        setIsLoading(true);
        try {
            await registerUser(state);
            setSuccess("Conta criada! Verifique seu email para ativar sua conta.");
            setState({ full_name: "", email: "", password: "" });
        } catch (err) {
            setError(err.response?.data?.detail || "Erro ao criar conta. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container sign-up-container">
            <form onSubmit={handleSubmit}>
                <h1>Criar Conta</h1>
                <div className="social-container">
                    <a href="#" className="social"><i className="fab fa-facebook-f" /></a>
                    <a href="#" className="social"><i className="fab fa-google-plus-g" /></a>
                    <a href="#" className="social"><i className="fab fa-linkedin-in" /></a>
                </div>
                <span>ou use seu email para se registrar</span>
                <input
                    type="text"
                    name="full_name"
                    placeholder="Nome completo"
                    value={state.full_name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={state.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Senha (mín. 8 caracteres)"
                    value={state.password}
                    onChange={handleChange}
                    required
                />
                {error && (
                    <p style={{ color: "#f87171", fontSize: "12px", margin: "4px 0" }}>{error}</p>
                )}
                {success && (
                    <p style={{ color: "#34d399", fontSize: "12px", margin: "4px 0" }}>{success}</p>
                )}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Criando..." : "Cadastrar"}
                </button>
            </form>
        </div>
    );
}

export default SignUpForm;
