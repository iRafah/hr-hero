import React, { useState } from "react";
import "./account.css";
import SignInForm from "../../components/SignIn.jsx";
import SignUpForm from "../../components/SignUp.jsx";
import Navbar from "../../components/NavBar.jsx";

export default function Account() {
    const [type, setType] = useState("signIn");
    const handleOnClick = text => {
        if (text !== type) {
            setType(text);
            return;
        }
    };
    const containerClass =
        "container " + (type === "signUp" ? "right-panel-active" : "");
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="account-page flex justify-center items-center flex-direction-column">
                <div className={containerClass} id="container">
                    <SignUpForm />
                    <SignInForm />

                    <div className="overlay-container md:block">
                        <div className="overlay">
                            <div className="md:block overlay-panel overlay-left">
                                <h1 className="text-3xl">Welcome Back!</h1>
                                <p>
                                    To keep connected with us please login with your personal info
                                </p>
                                <button
                                    className="ghost"
                                    id="signIn"
                                    onClick={() => handleOnClick("signIn")}
                                >
                                    Sign In
                                </button>
                            </div>
                            <div className="md:block overlay-panel overlay-right">
                                <h1 className="text-3xl">Hello!</h1>
                                <p>Enter your personal details and start using your AI CV Screening </p>
                                <button
                                    className="ghost "
                                    id="signUp"
                                    onClick={() => handleOnClick("signUp")}
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