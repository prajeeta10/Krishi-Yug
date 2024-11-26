//FarmerLogin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import AgriSupplyChain from "../contracts/AgriSupplyChain.json";
import PopupMessage from "./PopupMessage";
import "../styles/Login.css";

const FarmerLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username || !password) {
            setPopup({ message: "Please fill all fields.", type: "error" });
            return;
        }

        setLoading(true);

        try {
            if (!window.ethereum) {
                throw new Error("MetaMask not detected. Please install it.");
            }

            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.requestAccounts();

            const networkId = await web3.eth.net.getId();
            const deployedNetwork = AgriSupplyChain.networks[networkId];

            if (!deployedNetwork) {
                throw new Error("Smart contract not deployed on this network.");
            }

            const contract = new web3.eth.Contract(
                AgriSupplyChain.abi,
                deployedNetwork.address
            );

            console.log("Logging in with username:", username);
            console.log("Password:", password);
            console.log("Wallet Address:", accounts[0]);

            const isLoggedIn = await contract.methods
                .loginFarmer(username, password)
                .call({ from: accounts[0], gas: 6721975 });

            if (isLoggedIn) {
                setPopup({ message: "Login successful!", type: "success" });
                setTimeout(() => navigate("/farmer-dashboard"), 1500);
            } else {
                setPopup({ message: "Invalid username or password.", type: "error" });
            }
        } catch (error) {
            console.error("Error during login:", error);
            setPopup({
                message: error.message || "An error occurred during login.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {popup && (
                <PopupMessage
                    message={popup.message}
                    type={popup.type}
                    onClose={() => setPopup(null)}
                />
            )}
            <h1>Farmer Login</h1>
            <div className="login-form">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin} disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
                <p>
                    Not registered?{" "}
                    <span onClick={() => navigate("/farmer-register")} className="register-link">
                        Register here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default FarmerLogin;
