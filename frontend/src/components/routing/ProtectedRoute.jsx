import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <p className="text-slate-400 text-sm">Carregando...</p>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/account" replace />;
}

export default ProtectedRoute;
