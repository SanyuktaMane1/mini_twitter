const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Like = sequelize.define(
  "Like",
  {
    like_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    users_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    posts_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    disabled: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "likes",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [{ unique: true, fields: ["users_id", "posts_id"] }],

    id: false,
  }
);

module.exports = Like;
