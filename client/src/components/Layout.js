// src/components/Layout.js
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
    const navigate = useNavigate();

    return (
        <div>
            {/* Header */}
            <AppBar
                position="static"
                style={{
                    background: "linear-gradient(90deg, #ACE1AF, #B0EBB4)", // Gradient background
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Subtle shadow
                }}
            >
                <Toolbar>
                    <Typography
                        variant="h4"
                        style={{
                            flexGrow: 1,
                            cursor: "pointer",
                            fontWeight: "bold",
                            color: "#2C6E49", // Deep green for logo
                            textShadow: "1px 1px 2px #E0FBE2", // Soft shadow for text depth
                        }}
                        onClick={() => navigate("/")}
                    >
                        Krishi Yug🧑🏻‍🌾🌿
                    </Typography>

                    <Button
                        onClick={() => navigate("/")}
                        style={{
                            color: "#2C6E49", // Matching green
                            fontWeight: "bold",
                            border: "2px solid #2C6E49", // Border for button
                            borderRadius: "5px",
                            padding: "5px 15px",
                            marginRight: "25px",
                            transition: "all 0.3s ease-in-out",
                        }}
                        onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = "#BFF6C3")
                        }
                        onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = "transparent")
                        }
                    >
                        Home
                    </Button>        

                    <Button
                        onClick={() => navigate("/login-options")}
                        style={{
                            color: "#2C6E49", // Matching green
                            fontWeight: "bold",
                            border: "2px solid #2C6E49", // Border for button
                            borderRadius: "5px",
                            padding: "5px 15px",
                            transition: "all 0.3s ease-in-out",
                        }}
                        onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = "#BFF6C3")
                        }
                        onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = "transparent")
                        }
                    >
                        Login
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Page Content */}
            <Box
                style={{
                    minHeight: "80vh",
                    padding: "20px",
                    backgroundColor: "#E0FBE2", // Lightest green for content background
                }}
            >
                {children}
            </Box>

            {/* Footer */}
            <Box
                component="footer"
                style={{
                    backgroundColor: "#ACE1AF", // Soft green footer
                    color: "#2C6E49", // Deep green text
                    textAlign: "center",
                    padding: "15px 0",
                    fontSize: "1rem",
                    borderTop: "5px solid #B0EBB4", // Accent border at the top
                    boxShadow: "0px -4px 10px rgba(0, 0, 0, 0.1)", // Shadow for depth
                }}
            >
                <Typography variant="body1">
                    © {new Date().getFullYear()} Krishi Yug:
                    A Service to the Farmers by Prajeeta❤️
                </Typography>
                <Box
                    style={{
                        marginTop: "10px",
                        display: "flex",
                        justifyContent: "center",
                        gap: "15px",
                    }}
                >
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            color: "#2C6E49",
                            fontSize: "1rem",
                            textDecoration: "none",
                            transition: "color 0.3s ease, transform 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.target.style.color = "#006400")}
                        onMouseLeave={(e) => (e.target.style.color = "#2C6E49")}
                    >
                        Facebook
                    </a>
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            color: "#2C6E49",
                            fontSize: "1rem",
                            textDecoration: "none",
                            transition: "color 0.3s ease, transform 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.target.style.color = "#006400")}
                        onMouseLeave={(e) => (e.target.style.color = "#2C6E49")}
                    >
                        Twitter
                    </a>
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            color: "#2C6E49",
                            fontSize: "1rem",
                            textDecoration: "none",
                            transition: "color 0.3s ease, transform 0.3s ease",
                        }}
                        onMouseEnter={(e) => (e.target.style.color = "#006400")}
                        onMouseLeave={(e) => (e.target.style.color = "#2C6E49")}
                    >
                        Instagram
                    </a>
                </Box>
            </Box>
        </div>
    );
};

export default Layout;

