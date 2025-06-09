const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
} = require("../controllers/userController");

const { validateUser } = require("../middlewares/userValidator");

router.post("/register", validateUser, registerUser);
router.post("/login", validateUser, loginUser);

router.get("/", getAllUsers);
router.get("/:id", getUserById);

module.exports = router;
