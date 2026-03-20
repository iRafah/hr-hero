import { useState } from "react";
import { Menu } from "lucide-react";
import { GiRobotHelmet } from "react-icons/gi";
import { Link } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function AuthLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-brand-dark">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Content area — offset on desktop, full-width on mobile */}
            <div className="flex-1 flex flex-col min-h-screen md:ml-60">
                {/* Mobile top bar */}
                <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-brand-dark border-b border-brand-border sticky top-0 z-20">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-brand-muted hover:text-white p-1"
                    >
                        <Menu size={22} />
                    </button>
                    <Link to="/" className="text-base font-bold text-white flex items-center gap-2">
                        HR Hero <GiRobotHelmet className="text-brand-violet" />
                    </Link>
                </header>

                <main className="flex-1 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default AuthLayout;
