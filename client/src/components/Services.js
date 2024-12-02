import React from 'react';
import { Container, Grid, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from "./Layout";

const Services = () => {
    const navigate = useNavigate();

    // Inline styles
    const styles = {
        container: {
            padding: '40px 20px',
            backgroundColor: '#E0FBE2',
        },
        sectionTitle: {
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: 'bold',
        },
        serviceCard: {
            padding: '20px',
            backgroundColor: '#BFF6C3',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            borderColor: '#B0EBB4',
            borderWidth: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            margin: '10px',
        },
        
        serviceIcon: {
            fontSize: '3rem',
            color: '#4CAF50',
            marginBottom: '10px',
        },
        serviceTitle: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '10px',
        },
        serviceDescription: {
            fontSize: '1rem',
            lineHeight: '1.6',
        },
        backButton: {
            marginTop: '20px',
            marginLeft: '10px',
            fontSize: '1.1rem',
            padding: '10px 20px',
            backgroundColor: '#BFF6C3', /* Soft green for buttons */
            color: '#2c6e49', /* Complementary deep green text */
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            alignItems: 'center',
            textAlign: 'center',
            transition: 'backgroundColor 0.3s ease',
        },
        backButtonHover: {
            backgroundColor: '#B0EBB4',
        },
    };

    return (
        <Layout>
        <Container style={styles.container} maxWidth="lg">
            <Typography variant="h3" style={styles.sectionTitle}>
                Our Services
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6} lg={4}>
                    <Paper style={styles.serviceCard}>
                        <div style={styles.serviceIcon}>🌱</div>
                        <Typography variant="h5" style={styles.serviceTitle}>
                            Sustainable Farming
                        </Typography>
                        <Typography style={styles.serviceDescription}>
                            We provide tools and resources to support eco-friendly farming practices that benefit both farmers and the environment.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <Paper style={styles.serviceCard}>
                        <div style={styles.serviceIcon}>🔗</div>
                        <Typography variant="h5" style={styles.serviceTitle}>
                            Supply Chain Transparency
                        </Typography>
                        <Typography style={styles.serviceDescription}>
                            With blockchain technology, we ensure that the entire supply chain is transparent, secure, and trustworthy.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <Paper style={styles.serviceCard}>
                        <div style={styles.serviceIcon}>🤝</div>
                        <Typography variant="h5" style={styles.serviceTitle}>
                            Community Building
                        </Typography>
                        <Typography style={styles.serviceDescription}>
                            Our platform connects farmers and customers, fostering a collaborative environment for mutual growth.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
            <button
                style={styles.backButton}
                onClick={() => navigate('/')}
            >
                Back to Home
            </button>
        </Container>
        </Layout>
    );
};

export default Services;
