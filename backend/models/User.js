import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  coins: { type: Number, default: 0 },
  stars: { type: Number, default: 0 },
  starsForSpinner: { type: Number, default: 0 },
  currentLevel: { type: Number, default: 1 },
  ownedBalls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ball" }],
  selectedBall: { type: mongoose.Schema.Types.ObjectId, ref: "Ball" },
  coinHistory: [{
    level: Number,
    coinsEarned: Number,
    date: { type: Date, default: Date.now }
  }]
});

export default mongoose.model("User", userSchema);