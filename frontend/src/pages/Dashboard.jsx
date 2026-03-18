import { Navbar } from "../components/layout/Navbar";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-slate-900">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-slate-100">Dashboard</h1>
                    <p className="mt-3 text-slate-400">Coming soon.</p>
                </div>
            </main>
        </div>
    );
}
