// CropRegistration.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import AgriSupplyChain from "../contracts/AgriSupplyChain.json";
import "../styles/Login.css";
import Layout from './Layout';

const CropRegistration = () => {
    const [cropDetails, setCropDetails] = useState({
        name: "",
        location: "",
        quantityProduced: "",
        price: "",
        additionalInfo: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        const { name, location, quantityProduced, price, additionalInfo } = cropDetails;

        if (!name || !location || !quantityProduced || !price) {
            alert("Please fill all required fields.");
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

            const contract = new web3.eth.Contract(AgriSupplyChain.abi, deployedNetwork.address);

            // Register crop with price directly in INR (no conversion to ETH)
            await contract.methods
                .registerCrop(name, location, parseInt(quantityProduced), price, additionalInfo)
                .send({ from: accounts[0] });

            alert("Crop registered successfully!");
            setTimeout(() => navigate("/farmer-dashboard"), 1500);
        } catch (error) {
            console.error(error);
            alert(error.message || "Error during crop registration.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="dashboard-page">
                <h1>Register Your Harvest🌶️</h1>
                <form className="cropregister-form">
                    <input type="text" placeholder="Name" value={cropDetails.name} onChange={(e) => setCropDetails({ ...cropDetails, name: e.target.value })} />
                    <input type="text" placeholder="Location" value={cropDetails.location} onChange={(e) => setCropDetails({ ...cropDetails, location: e.target.value })} />
                    <input type="number" placeholder="Quantity Produced (Kgs)" value={cropDetails.quantityProduced} onChange={(e) => setCropDetails({ ...cropDetails, quantityProduced: e.target.value })} />
                    <input type="number" placeholder="Price (INR)" value={cropDetails.price} onChange={(e) => setCropDetails({ ...cropDetails, price: e.target.value })} />
                    <input type="text" placeholder="Additional Information" value={cropDetails.additionalInfo} onChange={(e) => setCropDetails({ ...cropDetails, additionalInfo: e.target.value })} />
                    <button type="button" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Registering..." : "Register Crop"}
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default CropRegistration;
