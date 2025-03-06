//TrackCrops.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Web3 from "web3";
import AgriSupplyChainABI from "../contracts/AgriSupplyChain.json";
import jsPDF from "jspdf";
import "../styles/Dashboard.css"
import Layout from "../components/Layout"

const TrackCrops = () => {
    const location = useLocation();
    const { cropId } = location.state || {}; // Optional: Pass specific cropId if required

    const [purchasedCrops, setPurchasedCrops] = useState([]);
    const [expandedCard, setExpandedCard] = useState(null); // Track which card is expanded
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPurchasedCrops = async () => {
            try {
                const web3 = new Web3(window.ethereum);
                const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your deployed contract address
                const contract = new web3.eth.Contract(AgriSupplyChainABI, contractAddress);

                const orders = await contract.methods.getOrders(cropId).call(); // Adjust as needed
                const formattedOrders = orders.map((order, index) => ({
                    id: index,
                    customerName: order.customerName,
                    customerAddress: order.customerAddress,
                    customerContact: order.customerContact,
                    cropName: order.cropName,
                    harvestLocation: order.harvestLocation,
                    deliveredTo: order.deliveredTo,
                    pricePerUnit: order.pricePerUnit,
                    quantityPurchased: order.quantityPurchased,
                    expectedDeliveryDate: new Date(order.expectedDeliveryDate * 1000).toLocaleDateString(),
                }));

                setPurchasedCrops(formattedOrders);
            } catch (error) {
                console.error("Error fetching purchased crops:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPurchasedCrops();
    }, [cropId]);

    const printReceipt = (details) => {
        const doc = new jsPDF();
        doc.setFontSize(12);

        doc.text("Crop Purchase Receipt", 20, 20);
        doc.text(`Customer Name: ${details.customerName}`, 20, 30);
        doc.text(`Customer Address: ${details.customerAddress}`, 20, 40);
        doc.text(`Customer Contact: ${details.customerContact}`, 20, 50);
        doc.text(`Crop Name: ${details.cropName}`, 20, 60);
        doc.text(`Harvest Location: ${details.harvestLocation}`, 20, 70);
        doc.text(`Delivered To: ${details.deliveredTo}`, 20, 80);
        doc.text(`Price per Unit: ₹${details.pricePerUnit}`, 20, 90);
        doc.text(`Quantity Purchased: ${details.quantityPurchased} kg`, 20, 100);
        doc.text(`Expected Delivery Date: ${details.expectedDeliveryDate}`, 20, 110);

        doc.save(`${details.cropName}_receipt.pdf`);
    };

    if (loading) {
        return <p>Loading purchased crops...</p>;
    }

    return (
        <Layout>
            <div className="dashboard-page">
                <h1>Track Purchased Crops</h1>
                <div className="crop-card-container">
                    {purchasedCrops.length === 0 ? (
                        <p>No crops purchased!</p> // Display message if there are no crops
                    ) : (
                        purchasedCrops.map((crop) => (
                            <div key={crop.id} className="crop-card">
                                <h3>{crop.cropName}</h3>
                                <p><strong>Quantity Purchased:</strong> {crop.quantityPurchased} kg</p>
                                <p><strong>Price per Unit:</strong> ₹{crop.pricePerUnit}</p>
                                <button
                                    className="track-button"
                                    onClick={() =>
                                        setExpandedCard(expandedCard === crop.id ? null : crop.id)
                                    }
                                >
                                    {expandedCard === crop.id ? "Hide Details" : "View Details"}
                                </button>
                                {expandedCard === crop.id && (
                                    <div className="tracking-dropdown">
                                        <p><strong>Customer Name:</strong> {crop.customerName}</p>
                                        <p><strong>Customer Address:</strong> {crop.customerAddress}</p>
                                        <p><strong>Customer Contact:</strong> {crop.customerContact}</p>
                                        <p><strong>Harvest Location:</strong> {crop.harvestLocation}</p>
                                        <p><strong>Delivered To:</strong> {crop.deliveredTo}</p>
                                        <p><strong>Expected Delivery Date:</strong> {crop.expectedDeliveryDate}</p>
                                        <button
                                            className="print-receipt-button"
                                            onClick={() => printReceipt(crop)}
                                        >
                                            Print Receipt
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Layout>
    );
    
}
export default TrackCrops;
