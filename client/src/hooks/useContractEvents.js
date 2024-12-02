import { useEffect } from 'react';
import Web3 from 'web3';
import { toast } from 'react-toastify';
import contractABI from '../contracts/AgriSupplyChain.json'; // ABI import

// Initialize Web3 instance
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));


// Ensure contract address is correctly specified
const networkId = '5777'; // Replace with the network ID you are using
const contractAddress = contractABI.networks[networkId].address;
console.log('Contract address:', contractAddress);
const useContractEvents = () => {
  useEffect(() => {
    if (!contractABI || !Array.isArray(contractABI.abi)) {
      console.error('Invalid contract ABI:', contractABI);
      return;
    }

    if (!contractAddress) {
      console.error('Contract address is not defined.');
      return;
    }

    const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

    try {
      // Listen for the CropSoldOut event
      const eventListener = contract.events
        .CropSoldOut({ fromBlock: 'latest' })
        .on('data', (event) => {
          console.log('Crop sold out event:', event);

          // Display a notification when the event is triggered
          if (event?.returnValues?.cropName) {
            toast.success(`Crop sold out: ${event.returnValues.cropName}`);
          } else {
            console.warn('Event data is missing expected return values.');
          }
        })
        .on('error', (error) => {
          console.error('Error listening for CropSoldOut event:', error);
        });

      // Cleanup listener when the component is unmounted
      return () => {
        eventListener.off('data');
        contract.removeAllListeners('CropSoldOut');
      };
    } catch (error) {
      console.error('Error setting up contract event listeners:', error);
    }
  }, []); // Empty dependency array to set up the listener only once
};

export default useContractEvents;
