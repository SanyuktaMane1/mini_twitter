const { body, validationResult } = require("express-validator");
const sanitizeHtml = require("sanitize-html");

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

const validatePost = [
  body("posts_title")
    .optional()
    .customSanitizer(cleanInput)
    .isLength({ min: 2, max: 50 })
    .withMessage("Title must be 2 to 50 characters."),

  body("posts_content")
    .exists({ checkFalsy: true })
    .withMessage("Content is required.")
    .customSanitizer(cleanInput)
    .isLength({ min: 5, max: 280 })
    .withMessage("Content must be 5 to 280 characters."),

  body("users_id").isInt({ gt: 0 }).withMessage("Valid user ID required."),

  handleValidationErrors,
];

module.exports = { validatePost };
