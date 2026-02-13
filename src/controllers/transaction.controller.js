const transactionModel = require("../models/transaction.model");
const accountModel = require("../models/account.model");
const ledgerModel = require("../models/ledger.model");
const emailService = require("../services/email.service");
const mongoose = require("mongoose");

const createTransaction = async (req, res) => {
  try {
    /**`
     * 1. Validate request
     */
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
      return res.status(400).json({
        message:
          "Missing required fields: fromAccount, toAccount, amount, idempotencyKey",
      });
    }

    const fromUserAccount = await accountModel.findById({
      _id: fromAccount,
    });
    const toUserAccount = await accountModel.findById({
      _id: toAccount,
    });
    if (!fromUserAccount || !toUserAccount) {
      return res
        .status(404)
        .json({ message: "From account or to account not found" });
    }
    /**
     * 2. Validate idempotency key
     */
    const existingTransaction = await transactionModel.findOne({
      idempotencyKey,
    });

    if (!existingTransaction) {
      return next(); // continue creating transaction
    }

    switch (existingTransaction.status) {
      case "completed":
        return res.status(409).json({
          message: "Transaction already completed",
          transaction: existingTransaction,
        });

      case "pending":
        return res.status(200).json({
          message: "Transaction is already pending",
          transaction: existingTransaction,
        });

      case "failed":
      case "reversed":
        return res.status(409).json({
          message:
            "Previous transaction cannot be reused. Use a new idempotency key.",
          transaction: existingTransaction,
        });

      default:
        return res.status(400).json({
          message: "Invalid transaction state",
          transaction: existingTransaction,
        });
    }
    /**
     * 3. Check account status
     */
    if (
      fromUserAccount.status !== "active" ||
      toUserAccount.status !== "active"
    ) {
      return res
        .status(400)
        .json({
          message: "Both accounts must be active to perform a transaction",
        });
    }
    /**
     * 4. Derive sender balance from ledger
     */
    const balance = await fromUserAccount.getBalance();
    if (balance < amount) {
      return res
        .status(400)
        .json({ message: `Insufficient balance in from account. Current balance: ${balance}. Requested amount: ${amount}` });
    }

  } catch (error) {
    console.error("Error in create transaction controller:", error);
    res
      .status(500)
      .json({ message: "Server error during transaction creation" });
  }
};
