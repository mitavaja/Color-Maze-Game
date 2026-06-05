import Ball from "./Ball";
import "../styles/game.css";

export default function MazeBoard({ 
  grid, 
  pos, 
  onMove, 
  ballColor, 
  ballGlow, 
  ballBorder, 
  ballPattern, 
  ballSecondaryColor, 
  starPos, 
  starCollected, 
  bombs, 
  onBombClick, 
  selectedPos,
  hintPath = [],
  shieldActive = false
}) {
  const gridSize = grid[0]?.length || 0;
  const cellSize = Math.min(60, Math.floor(500 / gridSize)); 

  // Helper to check if a cell is part of the active hint path
  const isHintCell = (x, y) => {
    return hintPath.some(step => step.x === x && step.y === y);
  };

  return (
    <div 
      className="maze" 
      style={{ 
        gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${grid.length}, ${cellSize}px)`,
        width: "fit-content"
      }}
    >
      {grid.map((row, y) =>
        row.map((cell, x) => {
          const isHint = isHintCell(x, y);
          const isStartCell = x === pos.x && y === pos.y;
          
          return (
            <div
              key={`${x}-${y}`}
              className={`cell 
                ${cell === 1 ? "wall" : cell === 2 ? "path" : ""} 
                ${selectedPos?.x === x && selectedPos?.y === y ? "selected" : ""}
                ${isHint && cell === 0 ? "hint-highlight" : ""}
              `}
              style={{ width: cellSize, height: cellSize }}
              onMouseEnter={() => onMove(x, y, false)}
              onMouseDown={() => onMove(x, y, true)}
            >
              {/* Star items */}
              {starPos?.x === x && starPos?.y === y && !starCollected && (
                <div className="star-cell">⭐</div>
              )}
              
              {/* Bombs look like cute crazy monsters or pop-balloons */}
              {cell === 3 && (
                <div className="bomb-cell" onClick={(e) => { e.stopPropagation(); onBombClick(x, y); }}>👾</div>
              )}

              {/* Player ball */}
              {isStartCell && (
                <div className="ball-container" style={{ position: "relative" }}>
                  {shieldActive && (
                    <div className="shield-bubble-overlay"></div>
                  )}
                  <Ball 
                    color={ballColor} 
                    size={cellSize * 0.75} 
                    glow={ballGlow} 
                    border={ballBorder} 
                    pattern={ballPattern}
                    secondaryColor={ballSecondaryColor}
                  />
                </div>
              )}
              
              {/* Little candy decorations inside walls for a sweet child theme */}
              {cell === 1 && (
                <div className="wall-candy-decor">🍬</div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}