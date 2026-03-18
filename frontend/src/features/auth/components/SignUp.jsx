import { useState } from "react";

function SignUpForm() {
    const [state, setState] = useState({ name: "", email: "", password: "" });

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`You are signing up with name: ${state.name}, email: ${state.email}`);
        setState({ name: "", email: "", password: "" });
    };

    return (
        <div className="form-container sign-up-container">
            <form onSubmit={handleSubmit}>
                <h1 className="text-3xl">Create Account</h1>
                <div className="social-container">
                    <a href="#" className="social"><i className="fab fa-facebook-f" /></a>
                    <a href="#" className="social"><i className="fab fa-google-plus-g" /></a>
                    <a href="#" className="social"><i className="fab fa-linkedin-in" /></a>
                </div>
                <span>or use your email for registration</span>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={state.name}
                    onChange={handleChange}
                />
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
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default SignUpForm;
