import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginOptions from "./components/LoginOptions";
import FarmerLogin from "./components/FarmerLogin";
import FarmerRegister from "./components/FarmerRegister";
import FarmerDashboard from "./components/FarmerDashboard";
import CropRegistration from "./components/CropRegistration";
import CustomerLogin from "./components/CustomerLogin";
import CustomerRegister from "./components/CustomerRegister";
import CustomerDashboard from "./components/CustomerDashboard";
import CropDetails from "./components/CropDetails";
import Services from "./components/Services"; // Import the Services component

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Home Page */}
                <Route path="/" element={<HomePage />} />

                {/* Login Options */}
                <Route path="/login-options" element={<LoginOptions />} />

                {/* Farmer Login and Registration */}
                <Route path="/farmer-login" element={<FarmerLogin />} />
                <Route path="/farmer-register" element={<FarmerRegister />} />

                {/* Farmer Dashboard and Crop Registration */}
                <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
                <Route path="/crop-registration" element={<CropRegistration />} />

                {/* Customer Login and Registration */}
                <Route path="/customer-login" element={<CustomerLogin />} />
                <Route path="/customer-register" element={<CustomerRegister />} />

                {/* Customer Dashboard and Crop Details */}
                <Route path="/customer-dashboard" element={<CustomerDashboard />} />
                <Route path="/crop-details/:id" element={<CropDetails />} />

                {/* Services Page */}
                <Route path="/services" element={<Services />} /> {/* Add the route for services */}
            </Routes>
        </Router>
    );
};

export default App;
