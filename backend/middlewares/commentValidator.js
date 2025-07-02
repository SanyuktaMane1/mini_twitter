const { body, validationResult } = require("express-validator");
const sanitizeHtml = require("sanitize-html");
const { Post } = require("../models");

const cleanInput = (value) => {
  const cleaned = sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();

  return cleaned; 
};


const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => e.msg)
      .join(", ");
    return res.status(400).json({ error: `Validation failed: ${message}` });
  }
  next();
};

const validateComment = [
  body("users_id").isInt({ gt: 0 }).withMessage("Valid user ID is required."),

  body("comment_text")
    .exists({ checkFalsy: true })
    .withMessage("Comment is required.")
    .customSanitizer(cleanInput)
    .isLength({ min: 2, max: 280 })
    .withMessage("Comment must be 2 to 280 characters."),

  body("posts_id")
    .isInt({ gt: 0 })
    .withMessage("Valid post ID required.")
    .bail()
    .custom(async (value) => {
      const post = await Post.findByPk(value);
      if (!post) return Promise.reject("Referenced post does not exist.");
    }),

  handleValidationErrors,
];

module.exports = { validateComment };
