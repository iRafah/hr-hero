import { useState } from "react";
import { Menu } from "lucide-react";
import { GiRobotHelmet } from "react-icons/gi";
import { Link } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function AuthLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-900">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Content area — offset on desktop, full-width on mobile */}
            <div className="flex-1 flex flex-col min-h-screen md:ml-60">
                {/* Mobile top bar */}
                <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-slate-950 border-b border-slate-800 sticky top-0 z-20">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-slate-400 hover:text-white p-1"
                    >
                        <Menu size={22} />
                    </button>
                    <Link to="/" className="text-base font-bold text-white flex items-center gap-2">
                        HR Hero <GiRobotHelmet className="text-indigo-400" />
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
