import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, logout, getProfile } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user) {
          setProfileData(user);
        } else {
          const data = await getProfile();
          setProfileData(data);
        }
      } catch (err) {
        console.error("Profile load error:", err);
        setError("Failed to load profile. Please sign in again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [getProfile, user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0b0d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "#6b7280",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "3px solid #1e293b",
              borderTopColor: "#3b82f6",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const displayData = profileData || user;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0b0d",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "10px",
              padding: "16px",
              marginBottom: "24px",
              color: "#ef4444",
              fontFamily: "'Syne', sans-serif",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* Profile header card */}
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px",
            padding: "40px",
            marginBottom: "20px",
            background: "linear-gradient(135deg, #111318 0%, #0f1117 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: "800",
                color: "white",
                flexShrink: 0,
                boxShadow: "0 0 0 4px rgba(59,130,246,0.15)",
              }}
            >
              {displayData?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div style={{ flex: 1 }}>
              <h1
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "28px",
                  fontWeight: "800",
                  color: "#f9fafb",
                  margin: "0 0 6px",
                }}
              >
                {displayData?.name}
              </h1>
              <p
                style={{
                  color: "#6b7280",
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "14px",
                  margin: 0,
                }}
              >
                {displayData?.email}
              </p>
              <span
                style={{
                  display: "inline-block",
                  marginTop: "8px",
                  background: "rgba(59,130,246,0.1)",
                  border: "1px solid rgba(59,130,246,0.2)",
                  color: "#3b82f6",
                  padding: "3px 10px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                User
              </span>
            </div>
          </div>
        </div>

        {/* Details card */}
        <div
          style={{
            background: "#111318",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px",
            padding: "32px",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "14px",
              fontWeight: "700",
              color: "#9ca3af",
              margin: "0 0 24px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Account Details
          </h2>

          {[
            { label: "Full Name", value: displayData?.name },
            { label: "Email Address", value: displayData?.email },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "14px 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <span
                style={{
                  color: "#6b7280",
                  fontSize: "13px",
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  color: "#f9fafb",
                  fontSize: "13px",
                  fontFamily: item.mono
                    ? "'Courier New', monospace"
                    : "'Syne', sans-serif",
                  fontWeight: "500",
                  textAlign: "right",
                  wordBreak: "break-all",
                }}
              >
                {item.value || "—"}
              </span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div
          style={{
            background: "#111318",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px",
            padding: "24px",
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "14px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#ef4444",
              borderRadius: "10px",
              fontSize: "14px",
              fontFamily: "'Syne', sans-serif",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.background = "rgba(239,68,68,0.2)")
            }
            onMouseLeave={(e) =>
              (e.target.style.background = "rgba(239,68,68,0.1)")
            }
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
