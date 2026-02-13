const accountModel = require('../models/account.model');

const createAccountController = async (req, res) => {
  try {
    const user = req.user
    const account = await accountModel.create({ user: user._id });
    res.status(201).json({
      account
    })
  } catch (error) {
    console.error("Error in create account controller:", error);
    res.status(500).json({ message: "Server error during account creation" });
  }
}

module.exports = {
  createAccountController
}