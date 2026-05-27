import mongoose from "mongoose";

const ballSchema = new mongoose.Schema({
  name: String,
  color: String,
  price: Number,
  glow: { type: Boolean, default: false },
  border: { type: String, default: "none" },
  pattern: { type: String, default: "none" }, // none, stripes, checks, gradient, star
  secondaryColor: { type: String, default: null }
});

export default mongoose.model("Ball", ballSchema);