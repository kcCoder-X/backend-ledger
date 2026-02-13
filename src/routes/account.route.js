const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const accountController = require("../controllers/account.controller");

const router = express.Router();

/**
 * - POST /api/accounts/
 * - Create a new account
 * - protected route, requires authentication
 */

router.post(
  "/",
  authMiddleware,
  accountController.createAccountController,
);

module.exports = router;
