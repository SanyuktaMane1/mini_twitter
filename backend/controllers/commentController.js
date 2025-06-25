const { Comment, User } = require("../models");

exports.createComment = async (req, res) => {
  try {
    const { posts_id, users_id, comment_text } = req.body;

    if (!posts_id || !users_id || !comment_text || comment_text.trim() === "") {
      return res.status(400).json({ error: "All fields are required." });
    }

    const comment = await Comment.create({ posts_id, users_id, comment_text });
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.findAll({
      where: { posts_id: postId },
      include: [
        {
          model: User,
          attributes: ["usersname"],
        },
      ],
      order: [["created_at", "ASC"]],
    });

    res.json(comments);
  } catch (err) {
    console.error("Failed to fetch comments:", err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};


exports.updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { comment_text } = req.body;

    if (!comment_text || comment_text.trim() === "") {
      return res.status(400).json({ error: "Comment text cannot be empty." });
    }

    const [updated] = await Comment.update(
      { comment_text, updated_at: new Date() },
      { where: { comment_id: commentId } }
    );

    if (updated === 0) {
      return res.status(404).json({ error: "Comment not found." });
    }

    res.json({ message: "Comment updated successfully." });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    await comment.update({ disabled: 1 });
    res.json({ message: "Comment soft-deleted successfully." });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
