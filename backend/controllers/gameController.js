import User from "../models/User.js";
import Ball from "../models/Ball.js";
import Level from "../models/Level.js";
import { generateLevel } from "../utils/levelGenerator.js";

export const completeLevel = async (req, res) => {
  const { timeTaken, starCollected } = req.body;
  let coins = 20;

  if (timeTaken < 10) coins = 100;
  else if (timeTaken < 20) coins = 70;
  else if (timeTaken < 40) coins = 40;

  const user = await User.findById(req.user.id);

  if (user.gameMode === "Toddler") {
    coins = coins * 2;
  }

  user.coins += coins;
  user.coinHistory.push({
    level: user.currentLevel,
    coinsEarned: coins
  });
  
  if (starCollected) {
    const starReward = user.gameMode === "Toddler" ? 2 : 1;
    user.stars += starReward;
    user.starsForSpinner += starReward;
  }

  user.currentLevel += 1;

  await user.save();
  await user.populate("ownedBalls selectedBall");

  // Get next level if exists
  const nextLevel = await Level.findOne({ levelNumber: user.currentLevel });

  res.json({ coins, user, nextLevel });
};

export const getShop = async (req, res) => {
  const balls = await Ball.find();
  const user = await User.findById(req.user.id).populate("ownedBalls selectedBall");

  res.json({ balls, user });
};

export const buyBall = async (req, res) => {
  const { ballId } = req.params;

  const ball = await Ball.findById(ballId);
  const user = await User.findById(req.user.id);

  if (!ball) return res.status(404).json({ msg: "Ball not found" });
  if (user.coins < ball.price)
    return res.status(400).json({ msg: "Not enough coins" });
  if (user.ownedBalls.includes(ballId))
    return res.status(400).json({ msg: "Already owned" });

  user.coins -= ball.price;
  user.ownedBalls.push(ballId);
  user.selectedBall = ballId;

  await user.save();
  await user.populate("ownedBalls selectedBall");

  res.json({ user });
};

export const selectBall = async (req, res) => {
  const { ballId } = req.params;
  const user = await User.findById(req.user.id);

  if (!user.ownedBalls.includes(ballId))
    return res.status(400).json({ msg: "Not owned" });

  user.selectedBall = ballId;
  await user.save();
  await user.populate("ownedBalls selectedBall");

  res.json({ user });
};

export const getLevel = async (req, res) => {
  const user = await User.findById(req.user.id);
  let level = await Level.findOne({ levelNumber: user.currentLevel });
  
  // Re-generate if legacy level data (missing bombs or time limit)
  if (!level || (user.currentLevel > 1 && (!level.bombs || level.bombs.length === 0)) || !level.timeLimit) {
    if (level) await Level.deleteOne({ _id: level._id });
    const newLevelData = generateLevel(user.currentLevel);
    level = await Level.create(newLevelData);
  }

  res.json(level);
};

export const collectStar = async (req, res) => {
  const user = await User.findById(req.user.id);
  user.stars += 1;
  user.starsForSpinner += 1;
  await user.save();
  await user.populate("ownedBalls selectedBall");
  res.json({ user });
};

export const spinWheel = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user.starsForSpinner < 5) {
    return res.status(400).json({ msg: "Not enough stars" });
  }

  // Deduct 5 stars from the spinner balance
  user.starsForSpinner -= 5;
  user.stars -= 5; // Also deduct from total stars if they are used as currency

  // Reward segments (0-7):
  // 1: random ball, 2: 5 skip level, 3: 1 star, 4: random ball, 
  // 5: 200 coins, 6: 3 level skip, 7: 500 coins, 8: random ball
  const rewardIndex = Math.floor(Math.random() * 8);
  let reward = {};

  switch (rewardIndex) {
    case 0: // 1: Random ball
    case 3: // 4: Random ball
    case 7: // 8: Random ball
      const allBalls = await Ball.find();
      const availableBalls = allBalls.filter(b => !user.ownedBalls.some(ob => ob.toString() === b._id.toString()));
      if (availableBalls.length > 0) {
        const ball = availableBalls[Math.floor(Math.random() * availableBalls.length)];
        user.ownedBalls.push(ball._id);
        reward = { type: "ball", value: ball };
      } else {
        user.coins += 1000; 
        reward = { type: "coins", value: 1000, msg: "All balls owned! 1000 coins rewarded." };
      }
      break;
    case 1: // 2: 5 skip level
      user.currentLevel += 5;
      reward = { type: "skip", value: 5 };
      break;
    case 2: // 3: 1 star
      user.stars += 1;
      user.starsForSpinner = 1; 
      reward = { type: "star", value: 1 };
      break;
    case 4: // 5: 200 coins
      user.coins += 200;
      reward = { type: "coins", value: 200 };
      break;
    case 5: // 6: 3 level skip
      user.currentLevel += 3;
      reward = { type: "skip", value: 3 };
      break;
    case 6: // 7: 500 coins
      user.coins += 500;
      reward = { type: "coins", value: 500 };
      break;
  }

  await user.save();
  await user.populate("ownedBalls selectedBall");
  res.json({ user, reward, rewardIndex });
};

export const buyPowerup = async (req, res) => {
  const { type } = req.params;
  const prices = { shield: 150, timeFreeze: 100, hint: 200 };
  const price = prices[type];

  if (!price) return res.status(400).json({ msg: "Invalid powerup type" });

  const user = await User.findById(req.user.id);
  if (user.coins < price) {
    return res.status(400).json({ msg: "Not enough coins!" });
  }

  user.coins -= price;
  user.powerups = user.powerups || { shield: 0, timeFreeze: 0, hint: 0 };
  user.powerups[type] = (user.powerups[type] || 0) + 1;

  await user.save();
  await user.populate("ownedBalls selectedBall");

  res.json({ user, msg: `${type} purchased successfully!` });
};

export const usePowerup = async (req, res) => {
  const { type } = req.params;
  const user = await User.findById(req.user.id);
  
  user.powerups = user.powerups || { shield: 0, timeFreeze: 0, hint: 0 };
  if (!user.powerups[type] || user.powerups[type] <= 0) {
    return res.status(400).json({ msg: `No ${type} powerup available!` });
  }

  user.powerups[type] -= 1;
  await user.save();
  await user.populate("ownedBalls selectedBall");

  res.json({ user, msg: `Used ${type}!` });
};

export const setGameMode = async (req, res) => {
  const { mode } = req.body;
  if (!["Toddler", "Junior", "SuperKid"].includes(mode)) {
    return res.status(400).json({ msg: "Invalid game mode" });
  }

  const user = await User.findById(req.user.id);
  user.gameMode = mode;
  await user.save();
  await user.populate("ownedBalls selectedBall");

  res.json({ user, msg: `Game mode set to ${mode}` });
};