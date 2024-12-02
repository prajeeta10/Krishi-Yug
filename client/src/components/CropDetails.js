// CropDetails.js:
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Web3 from "web3";
import AgriSupplyChain from "../contracts/AgriSupplyChain.json";
import "../styles/Dashboard.css";
import Layout from './Layout';

const INR_TO_ETHER_RATE = 315726;

const CropDetails = () => {
    const [crop, setCrop] = useState({});
    const [farmerInfo, setFarmerInfo] = useState({});
    const [formVisible, setFormVisible] = useState(false);
    const [purchaseStatus, setPurchaseStatus] = useState(null);
    const [formData, setFormData] = useState({
        customerName: '',
        contactInfo: '',
        deliveryAddress: '',
        cropName: '',
        quantity: 0,
        pricePerUnit: 0,
        totalPrice: 0,
        totalPriceInEther: 0,
        termsAccepted: false,
    });

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        loadCropDetails();
    }, [id]);
    
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
            console.log("Fetched Crop Data: ", fetchedCrop);  // Log to inspect the fetched crop data
    
            const farmerDetails = await contract.methods.farmers(fetchedCrop.farmer).call();
            const farmerName = farmerDetails.name || "Unknown Farmer";
    
            setCrop({
                ...fetchedCrop,
                price: parseFloat(fetchedCrop.price).toFixed(2),
                quantityProduced: fetchedCrop.quantityProduced.toString() || "N/A",
            });
    
            setFarmerInfo({
                name: farmerName,
                walletAddress: fetchedCrop.farmer,
            });
    
            setFormData({
                ...formData,
                cropName: fetchedCrop.name,
                pricePerUnit: parseFloat(fetchedCrop.price).toFixed(2),
            });
        } catch (error) {
            console.error("Error loading crop details:", error);
            alert(error.message || "Error loading crop details.");
        }
    };

    const handleBuyNow = () => {
        if (crop.quantityProduced <= 0) {
            alert("This crop has been sold out. No more purchases can be made.");
            return;
        }
        setFormVisible(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        let updatedValue = value;
        if (name === "quantity" || name === "pricePerUnit") {
            updatedValue = parseFloat(value) || 0;
        }

        const updatedFormData = {
            ...formData,
            [name]: updatedValue,
        };

        if (updatedFormData.quantity > 0 && updatedFormData.pricePerUnit > 0) {
            const totalPrice = updatedFormData.pricePerUnit * updatedFormData.quantity;
            const totalPriceInEther = totalPrice / INR_TO_ETHER_RATE;
            updatedFormData.totalPrice = totalPrice.toFixed(2);
            updatedFormData.totalPriceInEther = totalPriceInEther.toFixed(8);
        }

        setFormData(updatedFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!window.ethereum) {
            alert("MetaMask not detected. Please install it to proceed.");
            return;
        }

        try {
            const web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = AgriSupplyChain.networks[networkId];

            if (!deployedNetwork) {
                throw new Error("Smart contract not deployed on this network.");
            }

            const contract = new web3.eth.Contract(AgriSupplyChain.abi, deployedNetwork.address);

            const tx = await contract.methods.buyCrop(id, formData.quantity).send({
                from: accounts[0],
                value: web3.utils.toWei(formData.totalPriceInEther, "ether"),
                gas: 3000000,
            });

            console.log("Transaction success:", tx);
            setPurchaseStatus("Purchase successful.");
            setFormVisible(false);
        } catch (error) {
            console.error("Detailed error info:", error);
            alert("Error: " + (error.message || "Unknown error"));
            setPurchaseStatus("Error: " + error.message);
        }
    };

    const handleCancelPurchase = () => {
        setFormVisible(false);
        setPurchaseStatus(null);
    };

    return (
        <Layout>
            <div className="crop-details-page">
                <h1>Crop Details</h1>
                <p><strong>Name:</strong> {crop.name}</p>
                <p><strong>Location:</strong> {crop.location}</p>
                <p><strong>Price:</strong> ₹{crop.price}</p>
                <p><strong>Quantity Produced:</strong> {crop.quantityProduced} Kg(s)</p>
                <p><strong>Farmer Name:</strong> {farmerInfo.name}</p>
                <p><strong>Farmer Wallet:</strong> {farmerInfo.walletAddress}</p>
                <p><strong>Additional Info:</strong> {crop.additionalInfo}</p>
                {!formVisible && crop.quantityProduced > 0 && (
                    <button onClick={handleBuyNow} className="buy-now-btn">
                        Buy Now
                    </button>
                )}
                {formVisible && (
                    <div className="purchase-form">
                        <h2><center>Purchase {formData.cropName}</center></h2>
                        <div className="form-group">
                            <label>Customer Name:</label>
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Contact Information:</label>
                            <input
                                type="text"
                                name="contactInfo"
                                value={formData.contactInfo}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Delivery Address:</label>
                            <input
                                type="text"
                                name="deliveryAddress"
                                value={formData.deliveryAddress}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Crop Name:</label>
                            <input
                                type="text"
                                name="cropName"
                                value={formData.cropName}
                                onChange={handleInputChange}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label>Crop Cultivator:</label>
                            <input
                                type="text"
                                value={farmerInfo.name}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label>Quantity (kg):</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                min="1"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Price per unit (₹/kg):</label>
                            <input
                                type="text"
                                value={formData.pricePerUnit}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label>Total Price (₹):</label>
                            <input
                                type="text"
                                value={`₹${formData.totalPrice} (${formData.totalPriceInEther} ETH)`}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label>Paying To (Wallet Address):</label>
                            <input
                                type="text"
                                value={farmerInfo.walletAddress}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="termsAccepted"
                                    checked={formData.termsAccepted}
                                    onChange={handleInputChange}
                                />
                                I agree to the terms and conditions.
                            </label>
                        </div>
                        <div className="form-buttons">
                            <button onClick={handleCancelPurchase} className="cancel-btn">
                                Cancel
                            </button>
                            <button onClick={handleSubmit} className="submit-btn" disabled={!formData.termsAccepted}>
                                Confirm Purchase
                            </button>
                        </div>
                    </div>
                )}
                {purchaseStatus && (
                    <p className="status-message">
                        {purchaseStatus}
                    </p>
                )}
                <button onClick={() => navigate("/customer-dashboard")}>
                    Back to Dashboard
                </button>
            </div>
        </Layout>
    );
};

export default CropDetails;
