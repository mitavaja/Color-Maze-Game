import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showHistory, setShowHistory] = useState(false);

  return (
    <nav className="navbar-glass">
      <div className="nav-container">
        <h2 className="logo" onClick={() => navigate("/dashboard")}>
          Color <span>Maze</span>
        </h2>

        <div className="nav-links">
          <div className="nav-stat clickable" onClick={() => setShowHistory(true)}>
            <span className="coin-icon">🪙</span>
            <span className="coin-count">{user?.coins}</span>
          </div>

          <div className="nav-stat">
            <span className="star-icon">⭐</span>
            <span className="star-count">{user?.stars}</span>
          </div>

          {user?.starsForSpinner >= 5 && (
            <button className="spin-nav-btn" onClick={() => window.dispatchEvent(new CustomEvent("openSpinner"))}>
              🎡 Spin
            </button>
          )}

          <button 
            className={`nav-btn ${location.pathname === "/game" ? "active" : ""}`} 
            onClick={() => navigate("/game")}
          >
            Play
          </button>
          <button 
            className={`nav-btn ${location.pathname === "/shop" ? "active" : ""}`} 
            onClick={() => navigate("/shop")}
          >
            Shop
          </button>
          <button className="logout-btn highlight" onClick={() => { logout(); navigate("/"); }}>Logout</button>
        </div>
      </div>

      <AnimatePresence>
        {showHistory && (
          <div className="history-modal-overlay" onClick={() => setShowHistory(false)}>
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="history-modal glass"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Coin History</h3>
                <button className="close-btn" onClick={() => setShowHistory(false)}>×</button>
              </div>
              <div className="history-list-modal">
                {user?.coinHistory?.length > 0 ? (
                  [...user.coinHistory].reverse().map((h, i) => (
                    <div key={i} className="history-item-modal">
                      <span className="hist-level">Level {h.level}</span>
                      <span className="hist-coins">+{h.coinsEarned} 🪙</span>
                    </div>
                  ))
                ) : (
                  <p className="no-history">No history yet</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}