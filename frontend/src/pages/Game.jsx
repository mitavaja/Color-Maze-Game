import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import MazeBoard from "../components/MazeBoard";
import Spinner from "../components/Spinner";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/game.css";
import moveSound from "../assets/ballsound.mp3";
import winSound from "../assets/winner.mp3";
import failSound from "../assets/fail.mp3";

const ballAudio = new Audio(moveSound);
const winnerAudio = new Audio(winSound);
const failAudio = new Audio(failSound);

export default function Game() {
  const { user, setUser } = useContext(AuthContext);
  const [level, setLevel] = useState(null);
  const [grid, setGrid] = useState([]);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [startTime, setStartTime] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [reward, setReward] = useState(null);
  const [starPos, setStarPos] = useState(null);
  const [starCollected, setStarCollected] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [failed, setFailed] = useState(false);
  const [selectedPos, setSelectedPos] = useState(null);
  const [movingPath, setMovingPath] = useState([]);
  const [isMoving, setIsMoving] = useState(false);

  // Power-up States
  const [shieldActive, setShieldActive] = useState(false);
  const [hintPath, setHintPath] = useState([]);

  const isToddler = user?.gameMode === "Toddler";

  useEffect(() => {
    fetchLevel();
    window.addEventListener("openSpinner", handleOpenSpinner);
    return () => {
      window.removeEventListener("openSpinner", handleOpenSpinner);
    };
  }, []);

  useEffect(() => {
    if (isToddler) return; // Toddler mode has no timer pressure!
    
    if (timeLeft > 0 && !completed && !failed) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !completed && !failed && level) {
      handleFail();
    }
  }, [timeLeft, completed, failed, level, isToddler]);

  useEffect(() => {
    if (movingPath.length > 0 && !completed && !failed) {
      setIsMoving(true);
      const timer = setTimeout(() => {
        const nextStep = movingPath[0];
        const remainingPath = movingPath.slice(1);
        
        const newGrid = grid.map(row => [...row]);
        newGrid[nextStep.y][nextStep.x] = 2; 
        
        setGrid(newGrid);
        setPos(nextStep);
        
        ballAudio.currentTime = 0;
        ballAudio.play().catch(e => console.log("Audio play blocked"));

        if (starPos && nextStep.x === starPos.x && nextStep.y === starPos.y && !starCollected) {
          setStarCollected(true);
        }

        if (checkWin(newGrid)) {
          handleWin();
          setMovingPath([]);
          setIsMoving(false);
        } else {
          setMovingPath(remainingPath);
          if (remainingPath.length === 0) setIsMoving(false);
        }
      }, 100); 
      return () => clearTimeout(timer);
    }
  }, [movingPath, grid, completed, failed, starPos, starCollected]);

  const handleOpenSpinner = () => {
    setShowSpinner(true);
  };

  const fetchLevel = async () => {
    try {
      const { data } = await API.get("/game/level");
      setLevel(data);
      const initialGrid = data.grid.map(row => [...row]);
      initialGrid[data.startPos.y][data.startPos.x] = 2; 
      setGrid(initialGrid);
      setPos(data.startPos);
      setStartTime(Date.now());
      setCompleted(false);
      setFailed(false);
      setTimeLeft(data.timeLimit || 30);
      setReward(null);
      setStarCollected(false);
      setShieldActive(false);
      setHintPath([]);

      const emptyCells = [];
      data.grid.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell === 0 && !(x === data.startPos.x && y === data.startPos.y)) {
            const isBomb = data.bombs?.some(b => b.x === x && b.y === y);
            if (!isBomb) emptyCells.push({ x, y });
          }
        });
      });

      if (emptyCells.length > 0) {
        const randomStar = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        setStarPos(randomStar);
      } else {
        setStarPos(null);
      }
      setSelectedPos(null);
      setMovingPath([]);
      setIsMoving(false);
    } catch (err) {
      console.error("Failed to fetch level");
    }
  };

  const findPath = (start, end) => {
    const queue = [[start]];
    const visited = new Set();
    visited.add(`${start.x}-${start.y}`);

    while (queue.length > 0) {
      const path = queue.shift();
      const current = path[path.length - 1];

      if (current.x === end.x && current.y === end.y) {
        return path.slice(1);
      }

      const neighbors = [
        { x: current.x + 1, y: current.y },
        { x: current.x - 1, y: current.y },
        { x: current.x, y: current.y + 1 },
        { x: current.x, y: current.y - 1 },
      ];

      for (const neighbor of neighbors) {
        if (
          neighbor.y >= 0 && neighbor.y < grid.length &&
          neighbor.x >= 0 && neighbor.x < grid[0].length &&
          grid[neighbor.y][neighbor.x] !== 1 && 
          grid[neighbor.y][neighbor.x] !== 3 && 
          !visited.has(`${neighbor.x}-${neighbor.y}`)
        ) {
          visited.add(`${neighbor.x}-${neighbor.y}`);
          queue.push([...path, neighbor]);
        }
      }
    }
    return null;
  };

  const checkWin = (currentGrid) => {
    return currentGrid.every(row => !row.includes(0));
  };
 
  const handleMove = (x, y, isClick = false) => {
    if (completed || failed || isMoving) return;
 
    if (y < 0 || y >= grid.length || x < 0 || x >= grid[0].length) return;
    if (grid[y][x] === 1) return;
 
    // Bomb check
    if (grid[y][x] === 3) {
      if (isClick) handleBombCollision(x, y);
      return;
    }

    // Auto-move selection logic - Only for Clicks
    if (isClick && selectedPos) {
      if (selectedPos.x === x && selectedPos.y === y) {
        setSelectedPos(null);
        return;
      }

      const path = findPath(pos, { x, y });
      if (path) {
        setMovingPath(path);
        setSelectedPos(null);
        return;
      } else {
        toast.info("No path available!", { autoClose: 1000 });
      }
    }

    // Select start point - Only for Clicks
    if (isClick && x === pos.x && y === pos.y) {
      setSelectedPos({ x, y });
      toast.success("Start point selected!", { autoClose: 500, hideProgressBar: true });
      return;
    }

    // Normal move (drag or click adjacent)
    const dx = Math.abs(x - pos.x);
    const dy = Math.abs(y - pos.y);

    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      const newGrid = grid.map(row => [...row]);
      newGrid[y][x] = 2; 
      setGrid(newGrid);
      setPos({ x, y });
 
      ballAudio.currentTime = 0;
      ballAudio.play().catch(e => console.log("Audio play blocked"));
 
      if (starPos && x === starPos.x && y === starPos.y && !starCollected) {
        collectStar();
      }
 
      if (checkWin(newGrid)) {
        handleWin();
      }
    }
  };

  const collectStar = () => {
    setStarCollected(true);
  };

  const handleWin = async () => {
    setCompleted(true);
    ballAudio.pause();
    ballAudio.currentTime = 0;
    winnerAudio.play().catch(e => console.log("Audio play blocked"));
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    
    try {
      const { data } = await API.post("/game/complete", { timeTaken, starCollected });
      setReward(data.coins);
      setUser(data.user);
    } catch (err) {
      console.error("Failed to save progress");
    }
  };

  const handleFail = () => {
    setFailed(true);
    ballAudio.pause();
    failAudio.play().catch(e => console.log("Audio play blocked"));
  };

  // Game Mode Selection handler
  const changeGameMode = async (mode) => {
    try {
      const { data } = await API.post("/game/mode", { mode });
      setUser(data.user);
      toast.success(`Game Mode set to: ${mode}! 🥳`, { autoClose: 1500 });
      // Reset timer if switching to Toddler Mode mid-game
      if (mode === "Toddler") {
        setTimeLeft(level?.timeLimit || 30);
      }
    } catch (err) {
      toast.error("Failed to set game mode");
    }
  };

  // Power-up Triggers
  const useShield = async () => {
    if (!user?.powerups?.shield || user.powerups.shield <= 0 || shieldActive || completed || failed) return;
    try {
      const { data } = await API.post("/game/powerup/use/shield");
      setUser(data.user);
      setShieldActive(true);
      toast.success("Candy Shield activated! 🛡️✨", { autoClose: 1500 });
    } catch (err) {
      toast.error("Failed to use Candy Shield");
    }
  };

  const useTimeFreeze = async () => {
    if (!user?.powerups?.timeFreeze || user.powerups.timeFreeze <= 0 || completed || failed) return;
    try {
      const { data } = await API.post("/game/powerup/use/timeFreeze");
      setUser(data.user);
      setTimeLeft(prev => prev + 15);
      toast.success("Sugar Rush! +15 seconds! ⚡🍬", { autoClose: 1500 });
    } catch (err) {
      toast.error("Failed to use Sugar Rush");
    }
  };

  const useHint = async () => {
    if (!user?.powerups?.hint || user.powerups.hint <= 0 || isMoving || completed || failed) return;
    try {
      const { data } = await API.post("/game/powerup/use/hint");
      setUser(data.user);
      const target = (starPos && !starCollected) ? starPos : level.endPos;
      const path = findPath(pos, target);
      if (path) {
        setHintPath(path);
        toast.success("Magic Wand revealed the path! 🪄✨", { autoClose: 2000 });
        setTimeout(() => {
          setHintPath([]);
        }, 4000);
      } else {
        toast.info("No path found! 🌟");
      }
    } catch (err) {
      toast.error("Failed to use Magic Wand");
    }
  };

  const handleBombCollision = (bx, by) => {
    if (completed || failed) return;

    if (shieldActive) {
      setShieldActive(false);
      // Consume shield in backend
      API.post("/game/powerup/use/shield")
        .then((res) => setUser(res.data.user))
        .catch(e => console.log("Failed to consume shield"));
      
      // Clear the bomb from the grid
      if (bx !== undefined && by !== undefined) {
        const newGrid = grid.map(row => [...row]);
        newGrid[by][bx] = 0;
        setGrid(newGrid);
      }
      toast.success("Candy Shield absorbed the pop! 🛡️🎈", { autoClose: 2000 });
      return;
    }

    if (user?.gameMode === "Toddler") {
      if (bx !== undefined && by !== undefined) {
        const newGrid = grid.map(row => [...row]);
        newGrid[by][bx] = 0;
        setGrid(newGrid);
      }
      toast.info("Pop! Balloon popped safely! 🎈✨", { autoClose: 1500 });
      return;
    }

    if (user?.gameMode === "Junior") {
      toast.warning("Ouch! Reset to start! 🌀", { autoClose: 2000 });
      setPos(level.startPos);
      return;
    }

    handleFail();
  };

  if (!level) return <div className="loading">Loading Level...</div>;

  return (
    <div className="game-page">
      <Navbar />

      <div 
        className="game-container" 
        style={{ borderColor: level.boundaryColor, boxShadow: `0 10px 30px ${level.boundaryColor}22` }}
      >
        <div className="game-header">
          <div className="header-top">
            <h2 style={{ color: level.boundaryColor }}>Level {level.levelNumber}</h2>
            
            {/* Game Mode Toggle */}
            <div className="mode-selection-bar">
              <button 
                className={`mode-btn ${user?.gameMode === "Toddler" ? "active" : ""}`} 
                onClick={() => changeGameMode("Toddler")}
              >
                Toddler 🧸
              </button>
              <button 
                className={`mode-btn ${user?.gameMode === "Junior" ? "active" : ""}`} 
                onClick={() => changeGameMode("Junior")}
              >
                Junior 🌟
              </button>
              <button 
                className={`mode-btn ${user?.gameMode === "SuperKid" ? "active" : ""}`} 
                onClick={() => changeGameMode("SuperKid")}
              >
                Super Kid 🏆
              </button>
            </div>
          </div>
          
          <div className="header-bottom">
            <div 
              className="difficulty-badge" 
              style={{ backgroundColor: `${level.boundaryColor}22`, color: level.boundaryColor, border: `2px solid ${level.boundaryColor}` }}
            >
              {level.difficulty}
            </div>

            {completed && <div className="win-msg">Success! +{reward} Coins</div>}
            {failed && <div className="fail-msg">Level Failed!</div>}

            {/* Render Timer (Hidden or Fixed for Toddler Mode) */}
            <div className="timer-container">
              <span className="timer-icon">⏱️</span>
              <span className={`timer-text ${(timeLeft < 10 && !isToddler) ? "timer-danger" : ""}`}>
                {isToddler ? "∞" : `${timeLeft}s`}
              </span>
            </div>
          </div>
        </div>

        <div className="board-wrapper">
          <MazeBoard
            grid={grid}
            pos={pos}
            onMove={handleMove}
            ballColor={user?.selectedBall?.color || "#6366f1"}
            ballGlow={user?.selectedBall?.glow}
            ballBorder={user?.selectedBall?.border}
            ballPattern={user?.selectedBall?.pattern}
            ballSecondaryColor={user?.selectedBall?.secondaryColor}
            starPos={starPos}
            starCollected={starCollected}
            bombs={level.bombs}
            onBombClick={handleBombCollision}
            selectedPos={selectedPos}
            hintPath={hintPath}
            shieldActive={shieldActive}
          />

          <AnimatePresence>
            {completed && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="status-overlay win-overlay"
              >
                <div className="emoji-anim">🥳🎉🏆</div>
                <h2>Level Complete!</h2>
                <p>You earned {reward} coins</p>
                <button className="next-btn" onClick={fetchLevel}>Next Level</button>
              </motion.div>
            )}

            {failed && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="status-overlay fail-overlay"
              >
                <div className="emoji-anim">💥😵💀</div>
                <h2>Game Over!</h2>
                <p>Time's up or you hit a bomb!</p>
                <button className="retry-btn" onClick={fetchLevel}>Restart Level</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Powerups inventory panel */}
        <div className="powerups-panel">
          <button 
            className="powerup-button" 
            onClick={useShield} 
            disabled={!user?.powerups?.shield || user.powerups.shield <= 0 || shieldActive || completed || failed}
            title="Dodge one bomb explosion!"
          >
            <span className="powerup-icon">🛡️</span>
            <span className="powerup-name">Shield</span>
            <span className="powerup-count">{user?.powerups?.shield || 0}</span>
          </button>
          
          <button 
            className="powerup-button" 
            onClick={useTimeFreeze} 
            disabled={!user?.powerups?.timeFreeze || user.powerups.timeFreeze <= 0 || isToddler || completed || failed}
            title="Add +15 seconds to timer!"
          >
            <span className="powerup-icon">⚡</span>
            <span className="powerup-name">Sugar Rush</span>
            <span className="powerup-count">{user?.powerups?.timeFreeze || 0}</span>
          </button>
          
          <button 
            className="powerup-button" 
            onClick={useHint} 
            disabled={!user?.powerups?.hint || user.powerups.hint <= 0 || isMoving || completed || failed}
            title="Reveal path to star or exit!"
          >
            <span className="powerup-icon">🪄</span>
            <span className="powerup-name">Magic Wand</span>
            <span className="powerup-count">{user?.powerups?.hint || 0}</span>
          </button>
        </div>

        {/* Google AdSense Placement Placeholder */}
        <div className="adsense-game-bottom">
          <span className="adsense-label">Sponsor Zone 🌟</span>
          <div className="adsense-game-bottom-mock">
            <span>🧸 Fun Toys: Bubble Blasters & Lego Blocks 50% Off! 🎈</span>
          </div>
        </div>

        {showSpinner && (
          <Spinner 
            onReward={(updatedUser) => {
              const oldLevel = level?.levelNumber;
              setUser(updatedUser);
              if (updatedUser.currentLevel !== oldLevel) {
                fetchLevel();
              }
            }} 
            onClose={() => setShowSpinner(false)} 
          />
        )}
      </div>
    </div>
  );
}