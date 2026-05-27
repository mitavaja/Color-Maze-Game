import mongoose from "mongoose";

const levelSchema = new mongoose.Schema({
  levelNumber: Number,
  grid: [[Number]], // 0: empty, 1: wall
  startPos: { x: Number, y: Number },
  endPos: { x: Number, y: Number },
  boundaryColor: { type: String, default: "#6366f1" },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard", "Pro"], default: "Easy" },
  timeLimit: { type: Number, default: 30 },
  bombs: [{ x: Number, y: Number }]
});

export default mongoose.model("Level", levelSchema);