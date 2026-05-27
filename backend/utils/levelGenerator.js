const getGridSize = (level) => {
  if (level <= 10) return 5;
  if (level <= 25) return Math.floor(Math.random() * 2) + 6; // 6-7
  if (level <= 50) return Math.floor(Math.random() * 2) + 8; // 8-9
  return Math.floor(Math.random() * 3) + 10; // 10-12
};

const getDifficulty = (level) => {
  if (level <= 10) return "Easy";
  if (level <= 25) return "Medium";
  if (level <= 50) return "Hard";
  return "Pro";
};

const getBoundaryColor = (difficulty) => {
  const colors = {
    Easy: "#6366f1", // Indigo
    Medium: "#f59e0b", // Amber
    Hard: "#ef4444", // Red
    Pro: "#7c3aed", // Violet
  };
  return colors[difficulty] || "#6366f1";
};

const hasPath = (grid, start, end) => {
  const size = grid.length;
  const queue = [start];
  const visited = new Set([`${start.x},${start.y}`]);
  const directions = [
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: -1, y: 0 },
  ];

  let reachableCount = 0;
  let emptyCellsCount = 0;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (grid[y][x] === 0) emptyCellsCount++;
    }
  }

  let foundEnd = false;

  while (queue.length > 0) {
    const { x, y } = queue.shift();
    reachableCount++;
    if (x === end.x && y === end.y) foundEnd = true;

    for (const dir of directions) {
      const nx = x + dir.x;
      const ny = y + dir.y;

      if (
        nx >= 0 && nx < size &&
        ny >= 0 && ny < size &&
        grid[ny][nx] === 0 &&
        !visited.has(`${nx},${ny}`)
      ) {
        visited.add(`${nx},${ny}`);
        queue.push({ x: nx, y: ny });
      }
    }
  }
  // For a "fill everything" game, all empty cells must be reachable
  // And for a "reach end" game, the end must be found.
  return foundEnd && reachableCount === emptyCellsCount;
};

export const generateLevel = (levelNumber) => {
  const size = getGridSize(levelNumber);
  const difficulty = getDifficulty(levelNumber);
  const boundaryColor = getBoundaryColor(difficulty);
  
  let grid = [];
  let startPos = { x: 0, y: 0 };
  let endPos = { x: size - 1, y: size - 1 };
  
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    grid = Array.from({ length: size }, () => Array(size).fill(0));
    
    // Wall density increases with level
    const wallDensity = Math.min(0.1 + (levelNumber * 0.005), 0.35);
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // Don't place wall on start or end
        if ((x === startPos.x && y === startPos.y) || (x === endPos.x && y === endPos.y)) {
          continue;
        }
        
        if (Math.random() < wallDensity) {
          grid[y][x] = 1;
        }
      }
    }

    if (hasPath(grid, startPos, endPos)) {
      break;
    }
    attempts++;
  }

  const timeLimit = Math.max(15, (size * size) - (levelNumber * 0.1));
  
  // Generate bombs
  const bombs = [];
  const bombCount = Math.min(Math.floor(levelNumber / 3) + (levelNumber > 1 ? 1 : 0), 6); 
  
  let bombAttempts = 0;
  while (bombs.length < bombCount && bombAttempts < 100) {
    const bx = Math.floor(Math.random() * size);
    const by = Math.floor(Math.random() * size);
    
    if (
      grid[by][bx] === 0 && 
      !(bx === startPos.x && by === startPos.y) && 
      !(bx === endPos.x && by === endPos.y) &&
      !bombs.some(b => b.x === bx && b.y === by)
    ) {
      // Temporarily treat as wall to check if it blocks path
      grid[by][bx] = 1; 
      if (hasPath(grid, startPos, endPos)) {
        bombs.push({ x: bx, y: by });
        grid[by][bx] = 3; // Mark as bomb in the grid
      } else {
        grid[by][bx] = 0; // Restore
      }
    }
    bombAttempts++;
  }

  return {
    levelNumber,
    grid,
    startPos,
    endPos,
    boundaryColor,
    difficulty,
    timeLimit: Math.floor(timeLimit),
    bombs
  };
};
