const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: " userModel",
      required: true,
    },

    planId: { type: String, required: true },
    amount: { type: Number, required: true },
    credits: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);