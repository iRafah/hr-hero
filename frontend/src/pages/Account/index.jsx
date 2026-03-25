import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./account.css";
import SignInForm from "../../features/auth/components/SignIn";
import SignUpForm from "../../features/auth/components/SignUp";
import { Navbar } from "../../components/layout/Navbar";

export default function Account() {
    const [searchParams] = useSearchParams();
    const roleFromUrl = searchParams.get("role");
    const modeFromUrl = searchParams.get("mode");

    const [type, setType] = useState(modeFromUrl === "signup" || roleFromUrl ? "signUp" : "signIn");

    const containerClass = "container " + (type === "signUp" ? "right-panel-active" : "");

    return (
        <div className="min-h-screen bg-slate-900">
            <Navbar />

            <div className="account-page flex justify-center items-center">
                <div className={containerClass} id="container">
                    <SignUpForm role={roleFromUrl} />
                    <SignInForm />

                    <div className="overlay-container">
                        <div className="overlay">
                            <div className="overlay-panel overlay-left">
                                <h1 className="text-3xl">Welcome Back!</h1>
                                <p>To keep connected with us please login with your personal info</p>
                                <button
                                    className="ghost"
                                    onClick={() => setType("signIn")}
                                >
                                    Sign In
                                </button>
                            </div>
                            <div className="overlay-panel overlay-right">
                                <h1 className="text-3xl">Hello!</h1>
                                <p>Enter your personal details and start using AI CV Screening</p>
                                <button
                                    className="ghost"
                                    onClick={() => setType("signUp")}
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
