import Ball from "./Ball";
import "../styles/game.css";

export default function MazeBoard({ grid, pos, onMove, ballColor, ballGlow, ballBorder, ballPattern, ballSecondaryColor, starPos, starCollected, bombs, onBombClick, selectedPos }) {
  const gridSize = grid[0]?.length || 0;
  const cellSize = Math.min(60, Math.floor(500 / gridSize)); 

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
        row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            className={`cell ${cell === 1 ? "wall" : cell === 2 ? "path" : ""} ${selectedPos?.x === x && selectedPos?.y === y ? "selected" : ""}`}
            style={{ width: cellSize, height: cellSize }}
            onMouseEnter={() => onMove(x, y, false)}
            onMouseDown={() => onMove(x, y, true)}
          >
            {starPos?.x === x && starPos?.y === y && !starCollected && (
              <div className="star-cell">⭐</div>
            )}
            
            {cell === 3 && (
              <div className="bomb-cell" onClick={(e) => { e.stopPropagation(); onBombClick(); }}>💣</div>
            )}

            {pos.x === x && pos.y === y && (
              <div className="ball-container">
                 <Ball 
                   color={ballColor} 
                   size={cellSize * 0.7} 
                   glow={ballGlow} 
                   border={ballBorder} 
                   pattern={ballPattern}
                   secondaryColor={ballSecondaryColor}
                 />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}