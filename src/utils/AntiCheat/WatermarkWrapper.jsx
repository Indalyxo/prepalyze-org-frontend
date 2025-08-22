import React from "react";
import "./WatermarkWrapper.scss";

const WatermarkWrapper = ({ text = "Confidential", children }) => {
  return (
    <div className="watermark-wrapper">
      {children}
      <div className="watermark-overlay">
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index} className="watermark-text">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default WatermarkWrapper;
