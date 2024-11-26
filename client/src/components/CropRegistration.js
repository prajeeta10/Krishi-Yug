import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import AgriSupplyChain from "../contracts/AgriSupplyChain.json";
import PopupMessage from "./PopupMessage";
import "../styles/Dashboard.css";

const CropRegistration = () => {
    const [cropDetails, setCropDetails] = useState({
        name: "",
        location: "",
        harvestTime: "",
        price: "",
        additionalInfo: "",
    });
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        const { name, location, harvestTime, price, additionalInfo } = cropDetails;

        if (!name || !location || !harvestTime || !price) {
            setPopup({ message: "Please fill all required fields.", type: "error" });
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

            // Register crop
            await contract.methods
                .registerCrop(name, location, parseInt(harvestTime), parseInt(price), additionalInfo)
                .send({ from: accounts[0] });

            setPopup({ message: "Crop registered successfully!", type: "success" });
            setTimeout(() => navigate("/farmer-dashboard"), 1500);
        } catch (error) {
            console.error(error);
            setPopup({
                message: error.message || "Error during crop registration.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
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
            <h1>Crop Registration</h1>
            <div className="dashboard-form">
                <input
                    type="text"
                    placeholder="Crop Name"
                    value={cropDetails.name}
                    onChange={(e) =>
                        setCropDetails({ ...cropDetails, name: e.target.value })
                    }
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={cropDetails.location}
                    onChange={(e) =>
                        setCropDetails({ ...cropDetails, location: e.target.value })
                    }
                />
                <input
                    type="number"
                    placeholder="Time Required (in days)"
                    value={cropDetails.harvestTime}
                    onChange={(e) =>
                        setCropDetails({ ...cropDetails, harvestTime: e.target.value })
                    }
                />
                <input
                    type="number"
                    placeholder="Price (in ETH)"
                    value={cropDetails.price}
                    onChange={(e) =>
                        setCropDetails({ ...cropDetails, price: e.target.value })
                    }
                />
                <textarea
                    placeholder="Additional Info"
                    value={cropDetails.additionalInfo}
                    onChange={(e) =>
                        setCropDetails({ ...cropDetails, additionalInfo: e.target.value })
                    }
                ></textarea>
                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </div>
        </div>
    );
};

export default CropRegistration;
