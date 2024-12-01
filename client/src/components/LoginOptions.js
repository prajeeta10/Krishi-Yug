//LoginOptions.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import Layout from "./Layout";
const LoginOptions = () => {
    const navigate = useNavigate();

    return (
        <Layout>
        <div className="login-options">
            <header>
                <h1>Login Options</h1>
            </header>
            <div className="login-container">
                <div className="login-card">
                    <h2>Farmer Login🧑🏻‍🌾</h2>
                    <button onClick={() => navigate("/farmer-login")}>Login as Farmer</button>
                    <p>
                        Not registered?{" "}
                        <span onClick={() => navigate("/farmer-register")} className="register-link">
                            Register here
                        </span>
                    </p>
                </div>
                <div className="login-card">
                    <h2>Customer Login🤵🏻‍♂️</h2>
                    <button onClick={() => navigate("/customer-login")}>Login as Customer</button>
                    <p>
                        Not registered?{" "}
                        <span onClick={() => navigate("/customer-register")} className="register-link">
                            Register here
                        </span>
                    </p>
                </div>
            </div>
        </div>
        </Layout>
    );
};

export default LoginOptions;
