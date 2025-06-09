const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { validateComment } = require("../middlewares/commentValidator");
router.post("/", validateComment, commentController.createComment);
router.get("/posts/:postId", commentController.getCommentsByPost);
router.put("/:id", commentController.updateComment);
router.delete("/:id", commentController.deleteComment);

module.exports = router;
