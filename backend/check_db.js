import mongoose from "mongoose";
import Level from "./models/Level.js";
import Ball from "./models/Ball.js";
import dotenv from "dotenv";

dotenv.config();

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const levelCount = await Level.countDocuments();
    const ballCount = await Ball.countDocuments();
    console.log(`Levels: ${levelCount}`);
    console.log(`Balls: ${ballCount}`);
    
    if (levelCount > 0) {
        const levels = await Level.find().sort({ levelNumber: 1 });
        levels.forEach(l => console.log(`Level ${l.levelNumber}: ${l._id}`));
    }
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkDB();
