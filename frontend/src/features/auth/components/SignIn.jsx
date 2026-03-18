import { useState } from "react";

function SignInForm() {
    const [state, setState] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`You are login with email: ${state.email} and password: ${state.password}`);
        setState({ email: "", password: "" });
    };

    return (
        <div className="form-container sign-in-container">
            <form onSubmit={handleSubmit}>
                <h1 className="text-3xl">Sign in</h1>
                <div className="social-container">
                    <a href="#" className="social"><i className="fab fa-facebook-f" /></a>
                    <a href="#" className="social"><i className="fab fa-google-plus-g" /></a>
                    <a href="#" className="social"><i className="fab fa-linkedin-in" /></a>
                </div>
                <span>or use your account</span>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={state.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={state.password}
                    onChange={handleChange}
                />
                <a href="#">Forgot your password?</a>
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}

export default SignInForm;
