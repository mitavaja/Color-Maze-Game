import { useState, useEffect, useContext } from "react";
import "../styles/spinner.css";
import API from "../api/axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import spinSound from "../assets/spinner.mp3";
import rewardSound from "../assets/rewards.mp3";

const spinAudio = new Audio(spinSound);
const rewardAudio = new Audio(rewardSound);

export default function Spinner({ onReward, onClose }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const { user } = useContext(AuthContext);
  const [showItems, setShowItems] = useState(false);

  useEffect(() => {
    return () => {
      spinAudio.pause();
      spinAudio.currentTime = 0;
      rewardAudio.pause();
      rewardAudio.currentTime = 0;
    };
  }, []);
  const rewards = [
    { text: "Random Ball", type: "ball", emoji: "⚽" },
    { text: "5 Level Skip", type: "skip", emoji: "⏭️" },
    { text: "1 Star", type: "star", emoji: "⭐" },
    { text: "Random Ball", type: "ball", emoji: "⚽" },
    { text: "200 Coins", type: "coins", emoji: "🪙" },
    { text: "3 Level Skip", type: "skip", emoji: "⏭️" },
    { text: "Random Ball", type: "ball", emoji: "⚽" },
    { text: "500 Coins", type: "coins", emoji: "🪙" },
  ];


  const handleSpin = async () => {
    if (isSpinning || !user || user.starsForSpinner < 5) {
      if (user && user.starsForSpinner < 5) {
        toast.warning(`You need ${5 - user.starsForSpinner} more stars!`);
      }
      return;
    }
    
    try {
      const { data } = await API.post("/game/spin-wheel");
      
      setIsSpinning(true);
      spinAudio.currentTime = 0;
      spinAudio.play().catch(e => console.log("Audio play blocked"));
      
      const segmentAngle = 45;
      const extraDegrees = 360 * 5; 
      const targetAngle = 360 - (data.rewardIndex * segmentAngle);
      const totalRotation = rotation + extraDegrees + targetAngle - (rotation % 360);
      
      setRotation(totalRotation);

      setTimeout(() => {
        setIsSpinning(false);
        spinAudio.pause();
        spinAudio.currentTime = 0;
        rewardAudio.play().catch(e => console.log("Audio play blocked"));
        setResult(data.reward);
        onReward(data.user);
      }, 4000); 

    } catch (err) {
      console.error("Spin failed", err);
      const errorMsg = err.response?.data?.msg || "Spin failed. Try again.";
      toast.error(errorMsg);
      setIsSpinning(false);
    }
  };

  return (
    <div className="spinner-overlay">
      <div className="spinner-modal">
        <button className="close-spinner" onClick={onClose}>×</button>
        <h2>Lucky Spinner</h2>
        <p>Ready to win? {user?.starsForSpinner >= 5 ? "You have enough stars!" : `Collect ${5 - (user?.starsForSpinner || 0)} more stars to spin!`}</p>
        <div className="star-progress">
            <span className="star-count-big">⭐ {user?.starsForSpinner || 0} / 5</span>
        </div>

       

        <div className="wheel-container">
          <div className="wheel-pointer"></div>
          <div 
            className="wheel" 
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {rewards.map((r, i) => (
              <div 
                key={i} 
                className="segment" 
                style={{ "--i": i, "--clr": i % 2 === 0 ? "#6366f1" : "#4f46e5" }}
              >
                <div className="segment-content">
                  <span>{r.emoji}</span>
                </div>
              </div>
            ))}
          </div>
          <button 
            className="spin-btn" 
            onClick={handleSpin} 
            disabled={isSpinning || (user?.starsForSpinner < 5)}
          >
            {isSpinning ? "..." : user?.starsForSpinner < 5 ? "LOCKED" : "SPIN"}
          </button>
        </div>

        {result && (
          <div className="reward-popup">
            <h3>Congratulations!</h3>
            <p>You won: {result.type === "ball" ? result.value.name : result.type === "skip" ? `${result.value} Level Skip` : `${result.value} ${result.type}`}</p>
            <div className="popup-btns">
              {user?.starsForSpinner >= 5 && (
                <button className="spin-again-btn" onClick={() => { setResult(null); handleSpin(); }}>Spin Again</button>
              )}
              <button className="claim-btn" onClick={onClose}>Great!</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
