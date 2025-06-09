const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { validatePost } = require("../middlewares/postValidator");

router.post("/", validatePost, postController.createPost);
router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.put("/:id", validatePost, postController.updatePost);
router.delete("/:id", postController.deletePost);

module.exports = router;
