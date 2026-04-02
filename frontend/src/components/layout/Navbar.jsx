import { Link, useNavigate } from "react-router-dom";
import { GiRobotHelmet } from "react-icons/gi";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/cn";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";

const NAV_ITEMS = [
    { label: "Funcionalidades", href: "#funcionalidades" },
    { label: "Planos", href: "#planos" },
];

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleScroll = (href) => {
        const id = href.replace("#", "");
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setMobileOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-brand-dark/95 backdrop-blur border-b border-brand-border">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link
                        to="/"
                        className="text-xl font-bold text-white flex items-center gap-2"
                    >
                        HR Hero <GiRobotHelmet className="text-brand-primary" />
                    </Link>

                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center gap-6">
                        {NAV_ITEMS.map(({ label, href }) => (
                            <button
                                key={label}
                                onClick={() => handleScroll(href)}
                                className="text-sm font-medium text-brand-muted hover:text-white transition-colors cursor-pointer"
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Desktop CTAs */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => navigate("/dashboard")}
                            >
                                Ir para o painel
                            </Button>
                        ) : (
                            <>
                                <Link
                                    to="/account"
                                    className="text-sm font-medium text-brand-muted hover:text-white transition-colors"
                                >
                                    Entrar
                                </Link>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => navigate("/account")}
                                >
                                    Começar agora
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden text-brand-muted hover:text-white p-2"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-brand-surface border-t border-brand-border px-4 py-3 space-y-1">
                    {NAV_ITEMS.map(({ label, href }) => (
                        <button
                            key={label}
                            onClick={() => handleScroll(href)}
                            className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-brand-muted hover:text-white hover:bg-brand-elevated transition-colors"
                        >
                            {label}
                        </button>
                    ))}
                    <div className="pt-2 mt-2 border-t border-brand-border space-y-2">
                        {isAuthenticated ? (
                            <Button
                                variant="primary"
                                size="full"
                                onClick={() => {
                                    navigate("/dashboard");
                                    setMobileOpen(false);
                                }}
                            >
                                Ir para o painel
                            </Button>
                        ) : (
                            <>
                                <Link
                                    to="/account"
                                    onClick={() => setMobileOpen(false)}
                                    className="block px-3 py-2 rounded-lg text-sm font-medium text-brand-muted hover:text-white hover:bg-brand-elevated transition-colors"
                                >
                                    Entrar
                                </Link>
                                <Button
                                    variant="primary"
                                    size="full"
                                    onClick={() => {
                                        navigate("/account");
                                        setMobileOpen(false);
                                    }}
                                >
                                    Começar agora
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;
