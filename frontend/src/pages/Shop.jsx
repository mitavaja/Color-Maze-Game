import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Ball from "../components/Ball";
import "../styles/shop.css";

export default function Shop() {
  const [balls, setBalls] = useState([]);
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

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
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to buy ball");
    }
  };

  const handleSelect = async (ballId) => {
    try {
      const { data } = await API.post(`/game/select/${ballId}`);
      setUser(data.user);
    } catch (err) {
      alert("Failed to select ball");
    }
  };

  if (loading) return <div className="loading">Loading Shop...</div>;

  return (
    <div className="shop-page">
      <Navbar />

      <div className="shop-container">
        <header className="shop-header">
          <h1>Ball <span>Shop</span></h1>
          <p>Customize your experience with unique colors</p>
        </header>

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
                  <p className="price">{isOwned ? "Owned" : `${b.price} Coins`}</p>
                </div>

                <div className="card-actions">
                  {isSelected ? (
                    <button className="status-btn active" disabled>Selected</button>
                  ) : isOwned ? (
                    <button className="select-btn" onClick={() => handleSelect(b._id)}>Use This</button>
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
        </div>
      </div>
    </div>
  );
}