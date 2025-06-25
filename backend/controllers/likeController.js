const Like = require("../models/likeModel");

exports.addLike = async (req, res) => {
  const { users_id, posts_id } = req.body;

  if (!users_id || !posts_id) {
    return res
      .status(400)
      .json({ error: "users_id and posts_id are required" });
  }

  try {
    const [like, created] = await Like.findOrCreate({
      where: { users_id, posts_id },
      defaults: { disabled: 0 },
    });

    if (!created && like.disabled === 1) {
      await like.update({ disabled: 0 });
      return res.status(200).json({ message: "Post re-liked", like });
    }

    res.status(201).json({
      message: created ? "Post liked" : "Already liked",
      like,
    });
  } catch (error) {
    console.error(" Error in addLike:", error);
    res.status(500).json({ error: "Failed to like post." });
  }
};

exports.removeLike = async (req, res) => {
  const { users_id, posts_id } = req.body;
  if (!users_id || !posts_id) {
    return res
      .status(400)
      .json({ error: "users_id and posts_id are required." });
  }

  try {
    const like = await Like.findOne({
      where: {
        users_id,
        posts_id,
        disabled: 0,
      },
    });

    if (!like) {
      console.warn("Like not found or already unliked");
      return res
        .status(404)
        .json({ error: "Like not found or already unliked." });
    }

    await like.update({ disabled: 1 });

    res.json({ message: "Post unliked." });
  } catch (error) {
    console.error("Error in removeLike:", error.message, error.stack);
    res.status(500).json({ error: "Failed to unlike post." });
  }
};
