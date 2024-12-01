//FarmerRegistration.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import AgriSupplyChain from "../contracts/AgriSupplyChain.json";
import "../styles/Login.css";
import Layout from "./Layout";

const FarmerRegister = () => {
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
    
            // Reinitialize Web3 to ensure it is properly set up
            const web3 = new Web3(window.ethereum);
    
            // Request the user accounts
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
    
            // Get the network ID
            const networkId = await web3.eth.net.getId();
    
            // Get the deployed contract address
            const deployedNetwork = AgriSupplyChain.networks[networkId];
            if (!deployedNetwork) {
                throw new Error("Smart contract not deployed on this network.");
            }
    
            // Create the contract instance
            const contract = new web3.eth.Contract(AgriSupplyChain.abi, deployedNetwork.address);
    
            console.log("Attempting to register farmer...");
            // Send the transaction to the smart contract
            await contract.methods
                .registerFarmer(username, password, name)
                .send({ from: accounts[0], gas: 3000000 });
    
            console.log("Farmer registered successfully!");
    
            // Navigate to the login page after successful registration
            navigate("/farmer-login");
        } catch (error) {
            console.error("Registration Error:", error);
            if (error.message.includes("internal JSON-RPC error")) {
                alert("An internal error occurred. Please check your MetaMask connection or try again later.");
            }
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <Layout>
        <div className="login-page">
            <h1>Farmer Registration🧑🏻‍🌾</h1>
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
                    <span onClick={() => navigate("/farmer-login")} className="register-link">
                        Login here
                    </span>
                </p>
            </div>
        </div>
        </Layout>
    );
};

export default FarmerRegister;
