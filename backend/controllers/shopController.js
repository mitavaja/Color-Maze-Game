export const buyBall = async (req, res) => {
  const user = await User.findById(req.user.id);
  const ball = await Ball.findById(req.params.id);

  if (user.coins < ball.price)
    return res.json({ msg: "Not enough coins" });

  user.coins -= ball.price;
  user.ownedBalls.push(ball._id);

  await user.save();

  res.json(user);
};