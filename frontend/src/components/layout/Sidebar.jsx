import { Link, useLocation, useNavigate } from "react-router-dom";
import { GiRobotHelmet } from "react-icons/gi";
import { LayoutDashboard, User, Search, Briefcase, FileText, CreditCard, LogOut, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";

const NAV_ITEMS = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Perfil", path: "/perfil", icon: User },
    { label: "Analisar CV", path: "/analyse", icon: Search },
    { label: "Vagas", path: "/vagas", icon: Briefcase, disabled: true },
    { label: "Currículos", path: "/curriculos", icon: FileText, disabled: true },
    { label: "Assinatura", path: "/assinatura", icon: CreditCard, disabled: true },
];

export function Sidebar({ isOpen, onClose }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleNavClick = () => {
        if (onClose) onClose();
    };

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={cn(
                    "fixed top-0 left-0 h-screen w-60 bg-brand-dark border-r border-brand-border flex flex-col z-40 transition-transform duration-200",
                    "md:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                {/* Logo */}
                <div className="px-6 py-5 border-b border-brand-border flex items-center justify-between">
                    <Link to="/" className="text-lg font-bold text-white flex items-center gap-2" onClick={handleNavClick}>
                        HR Hero <GiRobotHelmet className="text-brand-violet" />
                    </Link>
                    {/* Close button — mobile only */}
                    <button
                        onClick={onClose}
                        className="md:hidden text-brand-muted hover:text-white p-1"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    {NAV_ITEMS.map(({ label, path, icon: Icon, disabled }) => {
                        const isActive = location.pathname === path;
                        return (
                            <Link
                                key={label}
                                to={disabled ? "#" : path}
                                onClick={handleNavClick}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-brand-violet text-white"
                                        : "text-brand-muted hover:text-white hover:bg-brand-surface",
                                    disabled && "opacity-40 pointer-events-none"
                                )}
                            >
                                <Icon size={18} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="px-3 py-4 border-t border-brand-border space-y-2">
                    {user && (
                        <div className="px-3 py-2.5 rounded-lg bg-brand-violet/10 border border-brand-violet/30">
                            <p className="text-xs text-brand-violet font-medium">Plano Gratuito</p>
                            <p className="text-xs text-brand-muted mt-0.5 truncate">{user.email}</p>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-brand-muted hover:text-white hover:bg-brand-surface transition-colors w-full"
                    >
                        <LogOut size={18} />
                        Sair
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
