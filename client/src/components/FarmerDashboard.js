//FarmerDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import AgriSupplyChain from "../contracts/AgriSupplyChain.json";
import "../styles/Dashboard.css";
import Layout from './Layout';

const FarmerDashboard = () => {
    const [name, setName] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [lastLogin, setLastLogin] = useState(null);
    const [crops, setCrops] = useState([]);
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

            const contract = new web3.eth.Contract(AgriSupplyChain.abi, deployedNetwork.address);

            const farmer = await contract.methods.farmers(accounts[0]).call();
            if (farmer.isRegistered) {
                setName(farmer.name);
                setLastLogin(new Date(Number(farmer.lastLogin) * 1000).toLocaleString());

                const cropCount = Number(await contract.methods.cropCount().call());
                const farmerCrops = [];
                for (let i = 1; i <= cropCount; i++) {
                    const crop = await contract.methods.getCrop(i).call();
                    if (crop.farmer.toLowerCase() === accounts[0].toLowerCase()) {
                        farmerCrops.push({
                            id: Number(crop.id),
                            name: crop.name,
                            location: crop.location,
                            harvestTime: Number(crop.harvestTime),
                            price: Number(crop.price),
                            additionalInfo: crop.additionalInfo,
                        });
                    }
                }
                setCrops(farmerCrops);
            } else {
                console.error("Farmer data not found. Please log in again.");
                setTimeout(() => navigate("/farmer-login"), 1500);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadFarmerData();
    }, []);

    const handleLogout = () => {
        console.log("Logging out...");
        setTimeout(() => navigate("/login-options"), 1500);
    };

    return (
        <Layout>
            <div className="dashboard-page">
                <h1>Welcome strong Farmer!🧑🏻‍🌾</h1>
                <div className="dashboard-info">
                    <p><strong>Name:</strong> {name}</p>
                    <p><strong>Wallet Address:</strong> {walletAddress}</p>
                    <p><strong>Last Login:</strong> {lastLogin}</p>
                    <ol><strong>Crops Registered:</strong>
                        {crops.length > 0 ? (
                            crops.map((crop) => (
                                <li key={crop.id}>
                                    <p><strong>Name:</strong> {crop.name}</p>
                                    <p><strong>Location:</strong> {crop.location}</p>
                                    <p><strong>Harvest Time:</strong> {crop.harvestTime} Month(s)</p>
                                    <p><strong>Price: ₹</strong>{crop.price} </p>
                                    <p><strong>Additional Info:</strong> {crop.additionalInfo}</p>
                                </li>
                            ))
                        ) : (
                            <p>No crops registered yet.</p>
                        )}
                    </ol>
                </div>
                <button className="dashboard-button" onClick={() => navigate("/crop-registration")}>
                    Register a Crop
                </button>
                <button className="dashboard-logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </Layout>
    );
};

export default FarmerDashboard;
