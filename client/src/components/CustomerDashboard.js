//CustomerDashboard
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import AgriSupplyChain from "../contracts/AgriSupplyChain.json";
import "../styles/Dashboard.css";
import Layout from './Layout';

const ETH_TO_INR_CONVERSION_RATE = 800000; // Sample conversion rate; adjust as needed

const CustomerDashboard = () => {
    const [crops, setCrops] = useState([]);
    const navigate = useNavigate();

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

                // Convert price from ETH to INR
                const priceInEth = web3.utils.fromWei(crop.price.toString(), 'ether');
                const priceInINR = (priceInEth * ETH_TO_INR_CONVERSION_RATE).toFixed(2);

                loadedCrops.push({
                    ...crop,
                    price: priceInINR, // Store the price in INR
                });
            }

            setCrops(loadedCrops);
        } catch (error) {
            console.error(error);
            alert(error.message || "Error loading crops.");
        }
    };

    useEffect(() => {
        loadCrops();
    }, []);

    return (
        <Layout>
            <div className="dashboard-page">
                <h1>Welcome Dear Customer!🤵🏻‍♂️</h1>
                <h2>What would you like to buy today?</h2>
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
