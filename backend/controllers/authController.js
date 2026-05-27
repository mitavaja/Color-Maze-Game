import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  const { username, password } = req.body;

  if (password.length < 6)
    return res.json({ msg: "Password must be 6 chars" });

  const user = await User.create({ username, password });

  res.json(user);
};

export const login = async (req, res) => {
  const user = await User.findOne(req.body).populate("ownedBalls selectedBall");

  if (!user) return res.json({ msg: "Invalid" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);


  res.json({ token, user });
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).populate("ownedBalls selectedBall");
  res.json(user);
};