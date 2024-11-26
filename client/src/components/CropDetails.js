import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Web3 from "web3";
import AgriSupplyChain from "../contracts/AgriSupplyChain.json";
import PopupMessage from "./PopupMessage";
import "../styles/CropDetails.css";

const CropDetails = () => {
    const { id } = useParams();
    const [crop, setCrop] = useState(null);
    const [popup, setPopup] = useState(null);

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

            const contract = new web3.eth.Contract(
                AgriSupplyChain.abi,
                deployedNetwork.address
            );

            const cropData = await contract.methods.getCrop(id).call();
            setCrop(cropData);
        } catch (error) {
            console.error(error);
            setPopup({
                message: error.message || "Error loading crop details.",
                type: "error",
            });
        }
    };

    useEffect(() => {
        loadCropDetails();
    }, [id]);

    return (
        <div className="crop-details-page">
            {popup && (
                <PopupMessage
                    message={popup.message}
                    type={popup.type}
                    onClose={() => setPopup(null)}
                />
            )}
            {crop ? (
                <div>
                    <h1>{crop.name}</h1>
                    <p><strong>Location:</strong> {crop.location}</p>
                    <p><strong>Harvest Time:</strong> {crop.harvestTime} days</p>
                    <p><strong>Price:</strong> {crop.price} ETH</p>
                    <p><strong>Additional Info:</strong> {crop.additionalInfo}</p>
                </div>
            ) : (
                <p>Loading crop details...</p>
            )}
        </div>
    );
};

export default CropDetails;
