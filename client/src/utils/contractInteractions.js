// utils/contractInteractions.js

import Web3 from 'web3';
import AgriSupplyChain from '../contracts/AgriSupplyChain.json'; // Adjust the path as necessary

const web3 = new Web3(window.ethereum);
let contract;

const initContract = async () => {
    if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = AgriSupplyChain.networks[networkId];

        if (deployedNetwork) {
            contract = new web3.eth.Contract(
                AgriSupplyChain.abi,
                deployedNetwork.address
            );
        } else {
            console.error('Smart contract not deployed on the current network');
        }
    } else {
        console.error('Please install MetaMask!');
    }
};

const getCropDetails = async () => {
    if (!contract) {
        await initContract();
    }

    try {
        const cropsCount = await contract.methods.getCropsCount().call();
        let crops = [];

        for (let i = 0; i < cropsCount; i++) {
            const crop = await contract.methods.getCrop(i).call();
            crops.push({
                name: crop.name,
                location: crop.location,
                quantityAvailable: crop.quantityAvailable,
                price: crop.price,
                deliveredTo: crop.deliveredTo,
                expectedDeliveryDate: crop.expectedDeliveryDate,
                customerName: crop.customerName,
                customerAddress: crop.customerAddress,
                customerContact: crop.customerContact,
            });
        }

        return crops;
    } catch (error) {
        console.error('Error fetching crop details:', error);
        return [];
    }
};

const generateReceipt = async (crop) => {
    // Simulate the receipt generation logic
    try {
        const receiptData = `
        Crop: ${crop.name}
        Location: ${crop.location}
        Quantity Available: ${crop.quantityAvailable} kg
        Price per Unit: ₹${crop.price}
        Delivered To: ${crop.deliveredTo}
        Expected Delivery Date: ${new Date(crop.expectedDeliveryDate).toLocaleDateString()}
        Customer Name: ${crop.customerName}
        Customer Address: ${crop.customerAddress}
        Customer Contact: ${crop.customerContact}
        `;
        return receiptData;
    } catch (error) {
        console.error('Error generating receipt:', error);
        return '';
    }
};

export { getCropDetails, generateReceipt };
