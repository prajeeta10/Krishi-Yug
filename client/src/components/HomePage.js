import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="homepage">
            <header className="homepage-header">
                <h1>AgriSupplyChain</h1>
                <button className="login-button" onClick={() => navigate("/login-options")}>
                    Login
                </button>
            </header>
            <main>
                <p>Welcome to AgriSupplyChain - A Blockchain-based platform for farmers and customers!</p>
                <p>Track and register your crops with complete transparency.</p>
            </main>
            <footer>
                <p>&copy; 2024 AgriSupplyChain. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default HomePage;
