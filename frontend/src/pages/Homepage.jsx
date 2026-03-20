import { Link } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";

export default function Homepage() {
    return (
        <div className="min-h-screen bg-slate-900">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-slate-100">HR Hero</h1>
                    <p className="mt-4 text-slate-400 max-w-xl mx-auto text-lg">
                        AI-powered CV screening. Upload CVs, get instant match scores, identify skill gaps, and rank candidates.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <Link
                            to="/analyse"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                        >
                            Start Analysing
                        </Link>
                        <Link
                            to="/account"
                            className="bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-600 font-medium px-6 py-3 rounded-lg transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
