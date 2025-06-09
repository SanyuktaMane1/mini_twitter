const { body, validationResult } = require("express-validator");
const sanitizeHtml = require("sanitize-html");

const cleanInput = (value) => {
  const cleaned = sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();
  if (!cleaned) throw new Error("Invalid input.");
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

const validateUser = [
  body("usersname")
    .exists({ checkFalsy: true })
    .withMessage("Username is required.")
    .customSanitizer(cleanInput)
    .isLength({ min: 2, max: 50 })
    .withMessage("Username must be 2 to 50 characters.")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      "Username can only contain letters, numbers, and underscores."
    ),

  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required.")
    .customSanitizer(cleanInput)
    .isLength({ min: 6, max: 100 })
    .withMessage("Password must be 6 to 100 characters.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must include lowercase, uppercase, and number."),

  handleValidationErrors,
];

module.exports = { validateUser };
