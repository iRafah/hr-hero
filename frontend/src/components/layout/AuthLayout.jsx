import { Sidebar } from "./Sidebar";

export function AuthLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-slate-900">
            <Sidebar />
            <main className="flex-1 ml-60 min-h-screen">
                {children}
            </main>
        </div>
    );
}

export default AuthLayout;
