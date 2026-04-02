import "./App.css";
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { AuthLayout } from "./components/layout/AuthLayout";

import Homepage from "./pages/Homepage";
import Account from "./pages/Account";
import VerifyEmail from "./pages/VerifyEmail";
import RoleSelection from "./pages/RoleSelection";
import Dashboard from "./pages/Dashboard";
import Analyse from "./pages/Analyse";
import Profile from "./pages/Profile";
import Subscribe from "./pages/Subscribe";
import SubscribeSuccess from "./pages/SubscribeSuccess";
import AccountSubscription from "./pages/Account/Subscription";

function App() {
    return (
        <AuthProvider>
            <ToastProvider>
            <Routes>
                {/* Public */}
                <Route path="/" element={<Homepage />} />
                <Route path="/comecar" element={<RoleSelection />} />
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
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <AuthLayout><Profile /></AuthLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/subscribe"
                    element={
                        <ProtectedRoute>
                            <AuthLayout><Subscribe /></AuthLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/subscribe/sucesso"
                    element={
                        <ProtectedRoute>
                            <AuthLayout><SubscribeSuccess /></AuthLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/account/subscription"
                    element={
                        <ProtectedRoute>
                            <AuthLayout><AccountSubscription /></AuthLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
            </ToastProvider>
        </AuthProvider>
    );
}

export default App;
