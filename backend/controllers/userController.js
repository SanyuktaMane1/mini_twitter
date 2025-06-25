const User = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
  try {
    console.log("REQUEST BODY:", req.body);

    const { usersname, password } = req.body;

    const existingUser = await User.findOne({ where: { usersname } });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken." });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({ usersname, password_hash });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        users_id: newUser.users_id,
        usersname: newUser.usersname,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { usersname, password } = req.body;

    const user = await User.findOne({ where: { usersname } });

    if (!user) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid username or password." });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        users_id: user.users_id,
        usersname: user.usersname,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { disabled: 0 },
      attributes: ["users_id", "usersname", "created_at", "updated_at"],
    });

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id, {
      attributes: ["users_id", "usersname", "created_at", "updated_at"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
