import { Link, useLocation, useNavigate } from "react-router-dom";
import { GiRobotHelmet } from "react-icons/gi";
import { LayoutDashboard, User, Search, Briefcase, FileText, CreditCard, LogOut } from "lucide-react";
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

export function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <aside className="fixed top-0 left-0 h-screen w-60 bg-slate-950 border-r border-slate-800 flex flex-col z-40">
            {/* Logo */}
            <div className="px-6 py-5 border-b border-slate-800">
                <Link to="/" className="text-lg font-bold text-white flex items-center gap-2">
                    HR Hero <GiRobotHelmet className="text-indigo-400" />
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {NAV_ITEMS.map(({ label, path, icon: Icon, disabled }) => {
                    const isActive = location.pathname === path;
                    return (
                        <Link
                            key={label}
                            to={disabled ? "#" : path}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-indigo-600 text-white"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800",
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
            <div className="px-3 py-4 border-t border-slate-800 space-y-2">
                {user && (
                    <div className="px-3 py-2.5 rounded-lg bg-indigo-950/50 border border-indigo-900/60">
                        <p className="text-xs text-indigo-400 font-medium">Plano Gratuito</p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{user.email}</p>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors w-full"
                >
                    <LogOut size={18} />
                    Sair
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
