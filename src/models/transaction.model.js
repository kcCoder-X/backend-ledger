const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({

  fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account",
    required: [true, "From account is required"],
    index: true
  },
  toAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account",
    required: [true, "To account is required"],
    index: true
  },
  status: {
    type: String,
    enum: {
      values: ["pending", "completed", "failed", "reversed"],
      message: "Status must be either pending, completed, failed or reversed"
    }, 
    default: "pending"
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0, "Amount must be a positive number"]
  },
  idempotencyKey: {
    type: String,
    required: [true, "Idempotency key is required"],
    unique: [true, "Idempotency key must be unique"],
    index: true
  }
}, {
  timestamps: true
})

const transactionModel = mongoose.model("transaction", transactionSchema);

module.exports = transactionModel;