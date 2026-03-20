import { Link, useLocation } from "react-router-dom";
import { GiRobotHelmet } from "react-icons/gi";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/cn";

const NAV_ITEMS = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Analyse", path: "/analyse" },
    { label: "Account", path: "/account" },
];

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    return (
        <header className="sticky top-0 z-50 bg-brand-dark border-b border-brand-border">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
                        HR Hero <GiRobotHelmet className="text-brand-primary" />
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        {NAV_ITEMS.map(({ label, path }) => (
                            <Link
                                key={label}
                                to={path}
                                className={cn(
                                    "text-sm font-medium transition-colors",
                                    location.pathname === path
                                        ? "text-white"
                                        : "text-brand-muted hover:text-white"
                                )}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>

                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden text-brand-muted hover:text-white p-2"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {mobileOpen && (
                <div className="md:hidden bg-brand-surface border-t border-brand-border px-4 py-3 space-y-1">
                    {NAV_ITEMS.map(({ label, path }) => (
                        <Link
                            key={label}
                            to={path}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                                "block px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                location.pathname === path
                                    ? "bg-brand-elevated text-white"
                                    : "text-brand-muted hover:text-white hover:bg-brand-surface"
                            )}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}

export default Navbar;
