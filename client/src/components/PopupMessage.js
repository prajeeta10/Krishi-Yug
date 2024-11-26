import React from "react";

const PopupMessage = ({ message, type, onClose }) => {
    const popupStyle = {
        padding: "10px",
        margin: "20px auto",
        borderRadius: "5px",
        width: "80%",
        maxWidth: "400px",
        textAlign: "center",
        color: type === "success" ? "green" : "red",
        backgroundColor: type === "success" ? "#d4edda" : "#f8d7da",
        border: `1px solid ${type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
    };

    return (
        <div style={popupStyle}>
            <p>{message}</p>
            <button
                onClick={onClose}
                style={{
                    padding: "5px 10px",
                    border: "none",
                    backgroundColor: "#007bff",
                    color: "white",
                    borderRadius: "3px",
                    cursor: "pointer",
                }}
            >
                Close
            </button>
        </div>
    );
};

export default PopupMessage;
