import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Ball from "../components/Ball";
import { toast } from "react-toastify";
import "../styles/shop.css";

export default function Shop() {
  const [balls, setBalls] = useState([]);
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("avatars"); // "avatars" or "powerups"

  useEffect(() => {
    fetchShop();
  }, []);

  const fetchShop = async () => {
    try {
      const { data } = await API.get("/game/shop");
      setBalls(data.balls);
      setUser(data.user);
    } catch (err) {
      console.error("Failed to fetch shop");
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (ballId) => {
    try {
      const { data } = await API.post(`/game/buy/${ballId}`);
      setUser(data.user);
      toast.success("Ball purchased successfully! 🥳", { autoClose: 1500 });
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to buy ball");
    }
  };

  const handleSelect = async (ballId) => {
    try {
      const { data } = await API.post(`/game/select/${ballId}`);
      setUser(data.user);
      toast.success("Equipped! 🎈", { autoClose: 1000 });
    } catch (err) {
      toast.error("Failed to select ball");
    }
  };

  const handleBuyPowerup = async (type) => {
    try {
      const { data } = await API.post(`/game/powerup/buy/${type}`);
      setUser(data.user);
      toast.success("Power-up purchased! 🥳✨", { autoClose: 1500 });
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to purchase power-up");
    }
  };

  const powerupsList = [
    { id: "shield", name: "Candy Shield", emoji: "🛡️", price: 150, description: "Deflects one balloon pop!" },
    { id: "timeFreeze", name: "Sugar Rush", emoji: "⚡", price: 100, description: "Adds +15 seconds to the timer!" },
    { id: "hint", name: "Magic Wand", emoji: "🪄", price: 200, description: "Reveals the secret path for 4s!" },
  ];

  if (loading) return <div className="loading">Loading Shop...</div>;

  return (
    <div className="shop-page">
      <Navbar />

      <div className="shop-container">
        <header className="shop-header">
          <h1>Toybox <span>Shop</span></h1>
          <p>Get cute skins and magical power-ups with your coins!</p>
        </header>

        {/* Tab Switcher */}
        <div className="shop-tabs">
          <button 
            className={`tab-btn ${activeTab === "avatars" ? "active" : ""}`} 
            onClick={() => setActiveTab("avatars")}
          >
            Avatars 🎨
          </button>
          <button 
            className={`tab-btn ${activeTab === "powerups" ? "active" : ""}`} 
            onClick={() => setActiveTab("powerups")}
          >
            Power-Ups ⚡
          </button>
        </div>

        {/* Avatars Tab */}
        {activeTab === "avatars" && (
          <div className="shop-grid">
            {balls.map((b) => {
              const isOwned = user?.ownedBalls?.some(owned => owned._id === b._id);
              const isSelected = user?.selectedBall?._id === b._id;

              return (
                <div className={`shop-card glass ${isSelected ? "selected" : ""}`} key={b._id}>
                  <div className="ball-preview-container">
                    <div className="ball-preview">
                      <Ball 
                        color={b.color} 
                        secondaryColor={b.secondaryColor}
                        pattern={b.pattern}
                        glow={b.glow}
                        border={b.border}
                        size={60}
                      />
                    </div>
                  </div>
                  
                  <div className="ball-info">
                    <h3>{b.name}</h3>
                    <p className="price">{isOwned ? "Owned" : `🪙 ${b.price}`}</p>
                  </div>

                  <div className="card-actions">
                    {isSelected ? (
                      <button className="status-btn active" disabled>Active</button>
                    ) : isOwned ? (
                      <button className="select-btn" onClick={() => handleSelect(b._id)}>Equip</button>
                    ) : (
                      <button 
                        className="buy-btn" 
                        onClick={() => handleBuy(b._id)}
                        disabled={user?.coins < b.price}
                      >
                        Buy Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Google AdSense Card Slot */}
            <div className="adsense-shop-card">
              <span className="adsense-label">Sponsor Zone 🌟</span>
              <div className="adsense-shop-mock">
                <span style={{ textAlign: "center", fontSize: "0.95rem" }}>
                  🎪 Kid Camp:<br />Bouncy Castles & Fun Games!<br />Book Now!
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Power-Ups Tab */}
        {activeTab === "powerups" && (
          <div className="shop-grid">
            {powerupsList.map((p) => {
              const ownedQty = user?.powerups?.[p.id] || 0;

              return (
                <div className="shop-card glass" key={p.id}>
                  <div className="ball-preview-container">
                    <span style={{ fontSize: "3.5rem" }}>{p.emoji}</span>
                  </div>
                  
                  <div className="ball-info">
                    <h3>{p.name}</h3>
                    <p style={{ fontSize: "0.9rem", color: "#475569", margin: "-5px 0 10px", fontWeight: "600" }}>
                      {p.description}
                    </p>
                    <p className="price">🪙 {p.price}</p>
                    <p style={{ fontSize: "0.95rem", fontWeight: "700", color: "#ff4081", margin: "-15px 0 15px" }}>
                      Inventory: {ownedQty}
                    </p>
                  </div>

                  <div className="card-actions">
                    <button 
                      className="buy-btn" 
                      onClick={() => handleBuyPowerup(p.id)}
                      disabled={user?.coins < p.price}
                    >
                      Buy Power-up
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Google AdSense Card Slot */}
            <div className="adsense-shop-card">
              <span className="adsense-label">Sponsor Zone 🌟</span>
              <div className="adsense-shop-mock">
                <span style={{ textAlign: "center", fontSize: "0.95rem" }}>
                  🍦 Yummy Ice Cream:<br />Chocolate, Mango & Mint!<br />Order Online!
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}