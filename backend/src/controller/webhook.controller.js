// webhook.controller.js

const Stripe = require("stripe");
const paymentModel = require("../models/payment.model");
const userModel = require("../models/user.model");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const transactionId = session.metadata.transactionId;
    const appId = session.metadata.appId;

    if (appId !== "MyGpt") {
      console.log("Ignored event from different app");
      return res.json({ received: true });
    }

    try {
      const transaction = await paymentModel.findOne({
        _id: transactionId,
        isPaid: false,
      });

      if (transaction) {
        // Add credits to user
        await userModel.updateOne(
          { _id: transaction.userId },
          { $inc: { credits: transaction.credits } }
        );

        // Mark as paid
        transaction.isPaid = true;
        await transaction.save();

        console.log(
          `Successfully added ${transaction.credits} credits to user ${transaction.userId}`
        );
      } else {
        console.log("Transaction not found or already paid");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  }

  // Always acknowledge receipt
  res.json({ received: true });
};

// Export with the correct name (singular)
module.exports = { stripeWebhook };