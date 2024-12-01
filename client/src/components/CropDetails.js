import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Web3 from "web3";
import AgriSupplyChain from "../contracts/AgriSupplyChain.json";
import "../styles/Dashboard.css";
import Layout from './Layout';

const CropDetails = () => {
    const [crop, setCrop] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();

    const loadCropDetails = async () => {
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

            const fetchedCrop = await contract.methods.getCrop(id).call();

            setCrop({
                ...fetchedCrop,
                price: fetchedCrop.price.toString(), // Assuming price is stored in INR
                harvestTime: fetchedCrop.harvestTime.toString() || "N/A", // Ensure harvestTime is handled as a string
            });
        } catch (error) {
            console.error(error);
            alert(error.message || "Error loading crop details.");
        }
    };

    useEffect(() => {
        loadCropDetails();
    }, [id]);

    return (
        <Layout>
            <div className="crop-details-page">
                <h1>Crop Details</h1>
                <p><strong>Name:</strong> {crop.name}</p>
                <p><strong>Location:</strong> {crop.location}</p>
                <p><strong>Price:</strong> ₹{crop.price}</p>
                <p>
                    <strong>Harvest Time:</strong> {crop.harvestTime} Month(s)
                </p>
                <p><strong>Additional Info:</strong> {crop.additionalInfo}</p>
                <button onClick={() => navigate("/customer-dashboard")}>
                    Back to Dashboard
                </button>
            </div>
        </Layout>
    );
};

export default CropDetails;
