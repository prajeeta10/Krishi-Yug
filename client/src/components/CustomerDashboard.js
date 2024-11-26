import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import AgriSupplyChain from "../contracts/AgriSupplyChain.json";
import PopupMessage from "./PopupMessage";
import "../styles/Dashboard.css";

const CustomerDashboard = () => {
    const [crops, setCrops] = useState([]);
    const [popup, setPopup] = useState(null);
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

            const contract = new web3.eth.Contract(
                AgriSupplyChain.abi,
                deployedNetwork.address
            );

            const cropCount = await contract.methods.cropCount().call();
            const loadedCrops = [];

            for (let i = 1; i <= cropCount; i++) {
                const crop = await contract.methods.getCrop(i).call();
                loadedCrops.push(crop);
            }

            setCrops(loadedCrops);
        } catch (error) {
            console.error(error);
            setPopup({
                message: error.message || "Error loading crops.",
                type: "error",
            });
        }
    };

    useEffect(() => {
        loadCrops();
    }, []);

    return (
        <div className="dashboard-page">
            {popup && (
                <PopupMessage
                    message={popup.message}
                    type={popup.type}
                    onClose={() => setPopup(null)}
                />
            )}
            <h1>Customer Dashboard</h1>
            <div className="crops-list">
                {crops.length > 0 ? (
                    crops.map((crop, index) => (
                        <div
                            key={index}
                            className="crop-card"
                            onClick={() => navigate(`/crop-details/${crop.id}`)}
                        >
                            <h2>{crop.name}</h2>
                            <p>Price: {crop.price} ETH</p>
                            <p>Location: {crop.location}</p>
                        </div>
                    ))
                ) : (
                    <p>No crops available.</p>
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;
