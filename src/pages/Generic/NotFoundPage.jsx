import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f8f9feff 0%, #fcfafeff 100%)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#000",
        textAlign: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <img
          src="/images/not-found.webp"
          alt="Page not found"
          style={{
            maxWidth: "200px",
            height: "auto",
            marginBottom: "30px",
            filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))",
          }}
        />
        
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "400",
            margin: "0 0 20px 0",
            opacity: "0.9",
          }}
        >
          Oops! Page Not Found
        </h2>
        
        <p
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
            margin: "0 0 30px 0",
            opacity: "0.8",
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <button
          onClick={() => window.history.back()}
          style={{
            color: "#fff",
            backgroundColor: "#667eea",
            border: "none",
            padding: "12px 30px",
            fontSize: "16px",
            fontWeight: "600",
            borderRadius: "25px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
            marginRight: "15px",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.3)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
          }}
        >
          Go Back
        </button>
        
        <button
          onClick={() => navigate("/")}
          style={{
            color: "#fff",
            backgroundColor: "#b15a5aff",
            border: "0",
            padding: "10px 28px",
            fontSize: "16px",
            fontWeight: "600",
            borderRadius: "25px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            e.target.style.borderColor = "rgba(214, 189, 189, 0.8)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.borderColor = "rgba(246, 220, 220, 0.5)";
          }}
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;