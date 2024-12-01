import React from 'react';
import { Button, Container, Grid, Typography, Paper } from '@mui/material';
import { FaLeaf, FaHandsHelping } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Layout from "./Layout";
import '../styles/HomePage.css'; // Add your CSS file for custom styling

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <Container className="home-page-container" maxWidth="lg">
                {/* Hero Section */}
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h3" gutterBottom className="hero-title">
                            Welcome to Krishi Yug
                        </Typography>
                        <Typography variant="h6" paragraph>
                            A blockchain-powered platform for transparent and efficient agricultural supply chains.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            className="explore-button"
                            onClick={() => navigate('/services')}
                        >
                            Explore Now
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <img src="/crop.jpeg" alt="Crop" className="crop-image" />
                    </Grid>
                </Grid>

                </Container>
        </Layout>
    );
};

export default HomePage;
