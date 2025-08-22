import React from "react";

const NoData = ({message}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        textAlign: "center",
      }}
    >
      <img
        src="/images/no-data.webp"
        alt="No data"
        style={{ width: "240px", height: "auto", opacity: 0.8 }}
      />
      <h2
        style={{
          marginTop: "16px",
          fontSize: "20px",
          fontWeight: "600",
          color: "#374151",
        }}
      >
        No Data Found
      </h2>
      <p style={{ marginTop: "8px", color: "#6B7280", maxWidth: "400px" }}>
        {message}
      </p>
    </div>
  );
};

export default NoData;
