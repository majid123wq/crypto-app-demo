import React, { useState } from "react";

const DemoBanner = () => {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "linear-gradient(90deg, #f59e0b, #d97706)",
        color: "#1a1a1a",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "13px",
        fontWeight: "600",
        fontFamily: "'Syne', sans-serif",
        boxShadow: "0 2px 12px rgba(245,158,11,0.4)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "16px" }}>⚠️</span>
        <span>
          <strong>STUDENT PROJECT DEMO</strong> — Student project demo. Not
          affiliated with any real exchange. Do not enter real personal or
          financial information.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: "rgba(0,0,0,0.2)",
          border: "none",
          color: "#1a1a1a",
          cursor: "pointer",
          padding: "4px 10px",
          borderRadius: "4px",
          fontWeight: "700",
          fontSize: "14px",
          flexShrink: 0,
          marginLeft: "12px",
        }}
      >
        ✕ Dismiss
      </button>
    </div>
  );
};

export default DemoBanner;
