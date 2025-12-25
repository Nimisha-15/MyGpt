const express = require("express");
const {
  purchasePlan,
  verifyPayment,
  getPlans,
} = require("../controller/payment.controller");

const paymentRouter = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

paymentRouter.get("/plans", getPlans);
paymentRouter.post("/purchase", authMiddleware, purchasePlan); // 🔥 REQUIRED
paymentRouter.post("/verify", authMiddleware, verifyPayment);

module.exports = paymentRouter;