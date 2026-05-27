import mongoose from "mongoose";
import Ball from "./models/Ball.js";
import Level from "./models/Level.js";
import dotenv from "dotenv";
import { generateLevel } from "./utils/levelGenerator.js";

dotenv.config();

const generateBalls = () => {
  const balls = [];
  const colors = [
    "#f87171", "#fb923c", "#fbbf24", "#facc15", "#a3e635", "#4ade80", "#34d399", "#2dd4bf", 
    "#22d3ee", "#38bdf8", "#60a5fa", "#818cf8", "#a78bfa", "#c084fc", "#e879f9", "#f472b6"
  ];
  
  for (let i = 0; i < 100; i++) {
    const price = i === 0 ? 0 : Math.floor(i * i * 1.5) + (i * 50);
    const color = colors[i % colors.length];
    const secondaryColor = colors[(i + 4) % colors.length];
    
    let name = `Ball #${i + 1}`;
    let pattern = "none";
    
    if (i === 0) {
      name = "Classic Blue";
    } else if (i < 20) {
      name = `Striped ${name}`;
      pattern = "stripes";
    } else if (i < 40) {
      name = `Checked ${name}`;
      pattern = "checks";
    } else if (i < 60) {
      name = `Gradient ${name}`;
      pattern = "gradient";
    } else if (i < 80) {
      name = `Elite ${name}`;
      pattern = "rings";
    } else {
      name = `Legendary ${name}`;
      pattern = "star";
    }

    balls.push({
      name,
      color,
      secondaryColor,
      price,
      pattern,
      glow: i > 40,
      border: i > 70 ? "#ffffff" : "none"
    });
  }
  return balls;
};

const balls = generateBalls();

const levels = [];
for (let i = 1; i <= 100; i++) {
  levels.push(generateLevel(i));
}

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    await Ball.deleteMany();
    await Ball.insertMany(balls);
    console.log("Balls seeded");

    await Level.deleteMany();
    await Level.insertMany(levels);
    console.log("Levels seeded");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
