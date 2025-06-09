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
    });

    res.status(201).json({
      message: created ? "Post liked" : "Already liked",
      like,
    });
  } catch (error) {
    console.error("🔥 Error in addLike:", error);
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
    const like = await Like.findOne({ where: { users_id, posts_id } });

    if (!like) {
      return res.status(404).json({ error: "Like not found." });
    }

    await like.destroy();
    res.json({ message: "Post unliked." });
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).json({ error: "Failed to unlike post." });
  }
};
