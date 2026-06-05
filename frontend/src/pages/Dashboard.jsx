import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome back, <span>{user?.username}</span></h2>
          <p>Ready to conquer the next maze?</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card glass">
            <p className="label">Current Level</p>
            <p className="value">{user?.currentLevel}</p>
          </div>
          <div className="stat-card glass">
            <p className="label">Coins</p>
            <p className="value">🪙 {user?.coins}</p>
          </div>
          <div className="stat-card glass">
            <p className="label">Balls Owned</p>
            <p className="value">{user?.ownedBalls?.length || 0}</p>
          </div>
        </div>

        <div className="action-buttons">
          <button className="play-btn" onClick={() => navigate("/game")}>
            Play Now 🎮
          </button>
          <button className="shop-btn" onClick={() => navigate("/shop")}>
            Visit Shop 🧸
          </button>
        </div>

        {/* Google AdSense Placement */}
        <div className="adsense-container">
          <span className="adsense-label">Sponsor Zone 🌟</span>
          <div className="adsense-mock-banner">
            <span>🍭 Magic Candies: Sweet Jelly Beans & Rainbow Drops! 🌈</span>
          </div>
        </div>
      </main>
    </div>
  );
}