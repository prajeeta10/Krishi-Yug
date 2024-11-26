import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import AgriSupplyChain from "../contracts/AgriSupplyChain.json";
import PopupMessage from "./PopupMessage";
import "../styles/Dashboard.css";

const FarmerDashboard = () => {
    const [name, setName] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [lastLogin, setLastLogin] = useState(null);
    const [popup, setPopup] = useState(null);
    const navigate = useNavigate();

    const loadFarmerData = async () => {
        try {
            if (!window.ethereum) {
                throw new Error("MetaMask not detected. Please install it.");
            }

            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.requestAccounts();
            setWalletAddress(accounts[0]);

            const networkId = await web3.eth.net.getId();
            const deployedNetwork = AgriSupplyChain.networks[networkId];

            if (!deployedNetwork) {
                throw new Error("Smart contract not deployed on this network.");
            }

            const contract = new web3.eth.Contract(
                AgriSupplyChain.abi,
                deployedNetwork.address
            );

            const farmer = await contract.methods.farmers(accounts[0]).call();

            if (farmer.isRegistered) {
                setName(farmer.name);
                setLastLogin(new Date(farmer.lastLogin * 1000).toLocaleString());
            } else {
                setPopup({ message: "Farmer data not found. Please log in again.", type: "error" });
                setTimeout(() => navigate("/farmer-login"), 1500);
            }
        } catch (error) {
            console.error(error);
            setPopup({
                message: error.message || "Error loading farmer data.",
                type: "error",
            });
        }
    };

    useEffect(() => {
        loadFarmerData();
    }, []);

    const handleLogout = () => {
        setPopup({ message: "Logging out...", type: "success" });
        setTimeout(() => navigate("/farmer-login"), 1500);
    };

    return (
        <div className="dashboard-page">
            {popup && (
                <PopupMessage
                    message={popup.message}
                    type={popup.type}
                    onClose={() => setPopup(null)}
                />
            )}
            <h1>Farmer Dashboard</h1>
            <div className="dashboard-info">
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Wallet Address:</strong> {walletAddress}</p>
                <p><strong>Last Login:</strong> {lastLogin}</p>
            </div>
            <button className="dashboard-button" onClick={() => navigate("/crop-registration")}>
                Register a Crop
            </button>
            <button className="dashboard-logout" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default FarmerDashboard;
