//CustomerRegistration.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import AgriSupplyChain from "../contracts/AgriSupplyChain.json";
import "../styles/Login.css";
import Layout from "./Layout";

const CustomerRegister = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!username || !password || !name) {
            alert("Please fill all fields.");
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

            // Register customer
            await contract.methods
                .registerCustomer(username, password, name)
                .send({ from: accounts[0] });

            alert("Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/customer-login"), 1500);
        } catch (error) {
            console.error(error);
            alert(error.message || "Error during registration.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
        <div className="login-page">
            <h1>Customer Registration🤵🏻‍♂️</h1>
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
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button onClick={handleRegister} disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
                <p>
                    Already registered?{" "}
                    <span onClick={() => navigate("/customer-login")} className="register-link">
                        Login here
                    </span>
                </p>
            </div>
        </div>
        </Layout>
    );
};

export default CustomerRegister;
