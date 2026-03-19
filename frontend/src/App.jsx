import "./App.css";
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { AuthLayout } from "./components/layout/AuthLayout";

import Homepage from "./pages/Homepage";
import Account from "./pages/Account";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import Analyse from "./pages/Analyse";
import Profile from "./pages/Profile";

function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Public */}
                <Route path="/" element={<Homepage />} />
                <Route path="/account" element={<Account />} />
                <Route path="/verificar-email" element={<VerifyEmail />} />

                {/* Protected — wrapped with sidebar layout */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <AuthLayout><Dashboard /></AuthLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/analyse"
                    element={
                        <ProtectedRoute>
                            <AuthLayout><Analyse /></AuthLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/perfil"
                    element={
                        <ProtectedRoute>
                            <AuthLayout><Profile /></AuthLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </AuthProvider>
    );
}

export default App;
