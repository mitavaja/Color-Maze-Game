import mongoose from "mongoose";
import Ball from "./models/Ball.js";
import Level from "./models/Level.js";
import dotenv from "dotenv";
import { generateLevel } from "./utils/levelGenerator.js";

dotenv.config();

const generateBalls = () => {
  const balls = [
    { name: "Classic Bubble", color: "#6366f1", price: 0, pattern: "none" },
    { name: "Happy Smiley", color: "#ffeb3b", price: 100, pattern: "smiley" },
    { name: "Strawberry Cream", color: "#ff4081", secondaryColor: "#ff80ab", price: 200, pattern: "gradient" },
    { name: "Tasty Donut", color: "#ff80ab", secondaryColor: "#f8bbd0", price: 350, pattern: "donut" },
    { name: "Cute Panda", color: "#ffffff", secondaryColor: "#212121", price: 500, pattern: "panda" },
    { name: "Playful Kitty", color: "#ffb74d", secondaryColor: "#ffe082", price: 700, pattern: "kitty" },
    { name: "Froggy Leap", color: "#4caf50", secondaryColor: "#81c784", price: 900, pattern: "frog" },
    { name: "Soccer Champion", color: "#ffffff", secondaryColor: "#000000", price: 1200, pattern: "soccer" },
    { name: "Sweet Cupcake", color: "#e040fb", secondaryColor: "#f3e5f5", price: 1500, pattern: "cupcake" },
    { name: "Shiny Star Candy", color: "#facc15", secondaryColor: "#fb923c", price: 2000, pattern: "star", glow: true, border: "#ffffff" }
  ];

  const colors = [
    "#f87171", "#fb923c", "#fbbf24", "#facc15", "#a3e635", "#4ade80", "#34d399", "#2dd4bf", 
    "#22d3ee", "#38bdf8", "#60a5fa", "#818cf8", "#a78bfa", "#c084fc", "#e879f9", "#f472b6"
  ];

  const patterns = ["none", "smiley", "gradient", "donut", "panda", "kitty", "frog", "soccer", "cupcake", "star", "stripes", "checks", "rings"];

  for (let i = 10; i < 100; i++) {
    const price = Math.floor(i * i * 2.5) + (i * 100);
    const color = colors[i % colors.length];
    const secondaryColor = colors[(i + 4) % colors.length];
    const pattern = patterns[i % patterns.length];
    
    let name = `Ball #${i + 1}`;
    if (pattern === "smiley") name = `Cheery ${name}`;
    else if (pattern === "donut") name = `Sweet Donut ${name}`;
    else if (pattern === "panda") name = `Panda Buddy ${name}`;
    else if (pattern === "kitty") name = `Kitty Face ${name}`;
    else if (pattern === "frog") name = `Froggy ${name}`;
    else if (pattern === "soccer") name = `Sports ${name}`;
    else if (pattern === "cupcake") name = `Cake ${name}`;
    else if (pattern === "star") name = `Starry ${name}`;
    else if (pattern === "stripes") name = `Zebra ${name}`;
    else if (pattern === "checks") name = `Pixel ${name}`;
    else if (pattern === "rings") name = `Circus ${name}`;
    else name = `Candy ${name}`;

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
