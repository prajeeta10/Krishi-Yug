// CustomerDashboard.js
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom"; // Add this import
import AgriSupplyChain from "../contracts/AgriSupplyChain.json";
import "../styles/Dashboard.css";
import Layout from './Layout';

const CustomerDashboard = () => {
    const [walletAddress, setWalletAddress] = useState("");
    const [crops, setCrops] = useState([]);
    const navigate = useNavigate(); // Initialize navigate

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                alert("MetaMask not detected. Please install it.");
                return;
            }
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setWalletAddress(accounts[0]);

            // Event listener for account change
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                } else {
                    setWalletAddress(""); // User disconnected wallet
                }
            });
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    };

    const loadCrops = async () => {
        try {
            if (!window.ethereum) {
                throw new Error("MetaMask not detected. Please install it.");
            }

            const web3 = new Web3(window.ethereum);
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = AgriSupplyChain.networks[networkId];

            if (!deployedNetwork) {
                throw new Error("Smart contract not deployed on this network.");
            }

            const contract = new web3.eth.Contract(AgriSupplyChain.abi, deployedNetwork.address);
            const cropCount = await contract.methods.cropCount().call();
            const loadedCrops = [];

            for (let i = 1; i <= cropCount; i++) {
                const crop = await contract.methods.getCrop(i).call();

                // Display the price as is, in INR
                const priceInINR = crop.price.toString(); // Display price as is

                loadedCrops.push({
                    ...crop,
                    price: priceInINR,
                });
            }

            setCrops(loadedCrops);
        } catch (error) {
            console.error("Error loading crops:", error);
            alert("Failed to load crops. Please try again later.");
        }
    };

    useEffect(() => {
        connectWallet();
        loadCrops();

        return () => {
            // Clean up the accountsChanged listener
            if (window.ethereum?.removeListener) {
                window.ethereum.removeListener("accountsChanged", connectWallet);
            }
        };
    }, []);

    return (
        <Layout>
            <div className="dashboard-page">
                <h1>Welcome Dear Customer!🤵🏻‍♂️</h1>
                <h2>What would you like to buy today?</h2>
                <br></br>
                <button className="wallet-btn" onClick={connectWallet}>
                    {walletAddress ? `Connected: ${walletAddress}` : "Connect Wallet"}
                </button>
                <div className="crops-list">
                    {crops.length > 0 ? (
                        crops.map((crop, index) => (
                            <div
                                key={index}
                                className="crop-card"
                                onClick={() => navigate(`/crop-details/${crop.id}`)}
                            >
                                <h2>{crop.name}</h2>
                                <p>Price: ₹{crop.price}</p>
                                <p>Location: {crop.location}</p>
                            </div>
                        ))
                    ) : (
                        <p>No crops available.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default CustomerDashboard;
