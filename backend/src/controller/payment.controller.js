const paymentModel = require("../models/payment.model")  
const userModel = require("../models/user.model");
const Stripe = require("stripe")
 

const plans = [{
        _id: "basic",
        name: "Basic",
        price: 10,
        credits: 100,
        features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models']
    },
    {
        _id: "pro",
        name: "Pro",
        price: 20,
        credits: 500,
        features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time']
    },
    {
        _id: "premium",
        name: "Premium",
        price: 30,
        credits: 1000,
        features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager']
    }]

// api controller for getting all plans 

const getPlans = async (req, res)=>{
    try {
        res.status(200).json({
            message : "Plans fetched successfully",
            success : true ,
            plans : plans
        })
    } catch (error) {
        console.log("error in get plans ->" , error )
        res.status(404).json({
            message : error.message,
            message : "ERROR FOUND "
        })
        
    }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
// api controller for purchasing the plan 

const purchasePlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id;
    
    console.log(req.user._id)
    const plan = plans.find(plan => plan._id === planId);
    if (!plan) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan",
      });
    }  
    // Save transaction
    const transaction = await paymentModel.create({
      userId : userId,
      planId: plan._id,
      amount: plan.price *100,
      credits: plan.credits,
      isPaid: false,
    });
    console.log("ORIGIN HEADER:", req.headers.origin);

    
   const origin =
  req.headers.origin ||
  req.headers.referer ||
  "http://localhost:5173";

const session = await stripe.checkout.sessions.create({

  line_items: [
    {
      price_data :{
        currency : "usd",
        unit_amount : plan.price*100 ,
        product_data : {
          name : plan.name

        }
      } ,
      quantity: 1,
    },
  ],
  mode: 'payment',
  success_url : `${origin}/loading` ,
  cancel_url : `${origin}`,
  metadata : {transactionId : transaction._id.toString() , appId :'MyGpt'} ,
  expires_at : Math.floor(Date.now() / 1000) +30 *60,
});

    res.status(200).json({
      success: true,
      url : session.url, 
      transactionId: transaction._id,
    });

  } catch (error) {
    console.error("purchasePlan error →", error);
    res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Add credits to user
    await userModel.findByIdAndUpdate(transaction.userId, {
      $inc: { credits: transaction.credits },
    });

    res.status(200).json({
      success: true,
      message: 'Payment successful',
    });
  } catch (error) {
    console.log('verify payment error ->', error);
    res.status(500).json({
      error : error,
      success: false,
      message: 'Payment verification failed',
    });
  }
};

module.exports = {
  verifyPayment,
  purchasePlan,
  getPlans
}