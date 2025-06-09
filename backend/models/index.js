const User = require("./userModel");
const Post = require("./postModel");
const Comment = require("./commentModel");
const Like = require("./likeModel");

User.hasMany(Post, { foreignKey: "users_id" });
Post.belongsTo(User, { foreignKey: "users_id" });

User.hasMany(Comment, { foreignKey: "users_id" });
Comment.belongsTo(User, { foreignKey: "users_id" });

Post.hasMany(Comment, { foreignKey: "posts_id" });
Comment.belongsTo(Post, { foreignKey: "posts_id" });

Post.hasMany(Like, { foreignKey: "posts_id", as: "Likes" });
Like.belongsTo(Post, { foreignKey: "posts_id", as: "Post" });

User.hasMany(Like, { foreignKey: "users_id", as: "UserLikes" });
Like.belongsTo(User, { foreignKey: "users_id", as: "User" });

module.exports = { User, Post, Comment, Like };
