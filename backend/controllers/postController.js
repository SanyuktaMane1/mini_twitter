
const { Post, User, Like } = require("../models");
const { Sequelize } = require("sequelize");

exports.createPost = async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json({ message: "Post created successfully.", post });
  } catch (err) {
    console.error("Create Error:", err);
    res.status(500).json({ error: "Failed to create post." });
  }
};



exports.getAllPosts = async (req, res) => {
  try {
    console.log("here");

    const posts = await Post.findAll({
      where: { disabled: 0 },
      include: [
        {
          model: User,
          attributes: ["usersname"],
          where: { disabled: 0 },
        },
        {
          model: Like,
          as: "Likes",
          required: false,
          attributes: [],
          where: {
            disabled: 0,
          },
        },
      ],
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("Likes.posts_id")), "likeCount"],
        ],
      },
      group: ["Post.posts_id", "User.users_id"],
      order: [["created_at", "DESC"]],
    });

    const postt = await Post.findAll({ where: { disabled: 0 } });

    const formattedPosts = posts.map((post) => {
      return {
        ...post.toJSON(),
        usersname: post.User?.usersname,
        likes: Number(post.get("likeCount")) || 0,
      };
    });
    console.log(posts);
    res.json(formattedPosts);
  } catch (error) {
    console.error("Error fetching posts with likes:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    console.log("Here");
    if (!post) return res.status(404).json({ error: "Post not found." });
    res.json(post);
  } catch (err) {
    console.error("Error retrieving post:", err);
    res.status(500).json({ error: "Error retrieving post." });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found." });

    await post.update(req.body);
    res.json({ message: "Post updated successfully.", post });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Failed to update post." });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found." });

    await post.update({ disabled: 1 });
    res.json({ message: "Post soft-deleted successfully." });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to delete post." });
  }
};
