import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Web3 from "web3";
import AgriSupplyChain from "../contracts/AgriSupplyChain.json";
import "../styles/Dashboard.css";
import Layout from './Layout';

const INR_TO_ETHER_RATE = 315726; // Example conversion rate: 1 Ether = 1,50,000 INR

const CropDetails = () => {
    const [crop, setCrop] = useState({});
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
        termsAccepted: false,
    });

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
                price: parseFloat(fetchedCrop.price).toFixed(2), // Ensure price is a valid number and formatted correctly
                quantityProduced: fetchedCrop.quantityProduced.toString() || "N/A",
            });

            setFormData({
                ...formData,
                cropName: fetchedCrop.name,
                pricePerUnit: parseFloat(fetchedCrop.price).toFixed(2), // Ensure price per unit is correctly set
            });
        } catch (error) {
            console.error(error);
            alert(error.message || "Error loading crop details.");
        }
    };

    const handleBuyNow = () => {
        if (window.ethereum) {
            setFormVisible(true);
        } else {
            alert("Please connect your wallet to proceed.");
        }
    };

    const handleCancelPurchase = () => {
        setFormVisible(false);
        setFormData((prevData) => ({
            ...prevData,
            customerName: '',
            contactInfo: '',
            deliveryAddress: '',
            quantity: 0,
            totalPrice: 0,
            termsAccepted: false,
        }));
    };
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Handle checkbox separately
        if (name === 'termsAccepted') {
            setFormData({
                ...formData,
                [name]: !formData.termsAccepted,
            });
        } else {
            // Handle numeric fields and auto-calculate total price
            let updatedValue = value;
            if (name === 'quantity') {
                updatedValue = parseInt(value, 10) || 0;
                const totalPrice = updatedValue * parseFloat(crop.price);
                const totalPriceInEther = (totalPrice / INR_TO_ETHER_RATE).toFixed(6); // Calculate Ether price
                setFormData({
                    ...formData,
                    [name]: updatedValue,
                    totalPrice: totalPrice.toFixed(2), // Ensure totalPrice is formatted as a string with 2 decimal places
                    totalPriceInEther, // Update Ether equivalent
                });
            } else {
                setFormData({
                    ...formData,
                    [name]: updatedValue,
                });
            }
        }
    };

    const handleSubmit = async () => {
        try {
            if (!formData.termsAccepted) {
                alert("You must agree to the terms and conditions to proceed.");
                return;
            }

            // Validate price
            if (isNaN(formData.totalPrice) || parseFloat(formData.totalPrice) <= 0) {
                alert("Invalid total price. Please check your input.");
                return;
            }

            // Payment logic to be implemented here (e.g., interacting with smart contract)
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.requestAccounts();
            const userAccount = accounts[0];

            const networkId = await web3.eth.net.getId();
            const deployedNetwork = AgriSupplyChain.networks[networkId];
            const contract = new web3.eth.Contract(AgriSupplyChain.abi, deployedNetwork.address);

            // Convert total price from INR to Ether
            const priceInEther = web3.utils.toWei(formData.totalPrice.toString(), 'ether');

            // Call smart contract method to confirm purchase (replace with actual function)
            await contract.methods.confirmPurchase(
                crop.id,
                formData.customerName,
                formData.contactInfo,
                formData.deliveryAddress,
                formData.quantity
            ).send({ from: userAccount, value: priceInEther });

            setPurchaseStatus('Success');
            setFormVisible(false);
        } catch (error) {
            console.error("Error during purchase:", error);
            setPurchaseStatus('Failed');
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
                <p><strong>Quantity Produced:</strong> {crop.quantityProduced} Kg(s)</p>
                <p><strong>Additional Info:</strong> {crop.additionalInfo}</p>
                {!formVisible && (
                    <button onClick={handleBuyNow} className="buy-now-btn">
                        Buy Now
                    </button>
                )}
                {formVisible && (
                    <div className="purchase-form">
                        <h2>Purchase Form</h2>
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
                                Cancel Purchase
                            </button>
                            <button onClick={handleSubmit} className="confirm-btn">
                                Confirm Purchase
                            </button>
                        </div>
                    </div>
                )}
                {purchaseStatus && (
                    <p className="status-message">
                        {purchaseStatus === 'Success' ? 'Purchase Successful!' : 'Purchase Failed. Please try again.'}
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
