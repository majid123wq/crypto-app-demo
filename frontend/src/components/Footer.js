import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        background: "#0d0e11",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "32px 24px",
        marginTop: "auto",
        textAlign: "center",
        fontFamily: "'Syne', sans-serif",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "8px",
            padding: "16px 24px",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              color: "#ef4444",
              fontSize: "12px",
              margin: 0,
              lineHeight: "1.6",
            }}
          >
            🚨 <strong>DISCLAIMER:</strong> This is a student demo project
            created for educational purposes only. It is{" "}
            <strong>
              NOT affiliated with, sponsored by, or connected to any real
              cryptocurrency exchange.
            </strong>
            Do <strong>NOT</strong> enter real personal information, passwords,
            or financial data. No real transactions occur on this platform.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            flexWrap: "wrap",
            marginBottom: "16px",
          }}
        >
          <span style={{ color: "#555", fontSize: "12px" }}>
            University of Ghana
          </span>
          <span style={{ color: "#333" }}>•</span>
          <span style={{ color: "#555", fontSize: "12px" }}>
            Computer Science Department
          </span>
          <span style={{ color: "#333" }}>•</span>
          <span style={{ color: "#555", fontSize: "12px" }}>
            Full-Stack Integration Assignment
          </span>
        </div>
        <p style={{ color: "#3a3a3a", fontSize: "11px", margin: 0 }}>
          © {new Date().getFullYear()} Crypto App – Student Project. All rights
          reserved. For academic use only.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
