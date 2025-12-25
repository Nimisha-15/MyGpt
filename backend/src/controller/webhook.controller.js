
const Stripe = require("stripe");
const paymentModel = require("../models/payment.model");
const userModel = require("../models/user.model");

const stripeWebhooks = async (req , res)=>{
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const sig = req.headers["stripe-signature"]
    let event ;
    try {
        event=stripe.webhook.constructEvent(req.body ,sig , process.env.STRIPE_DEVHOOK_SECRET)
    } catch (error) {
        console.log("Error in webhooks controller ---->" , error)
        return res.status(404).json({
            message : "error in web hooks controller",
            error : error
        })
        
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded":{
                const paymentIntent = event.data.object;
                const sessionList = await stripe.checkout.session.list({
                    payment_intent : paymentIntent.id
                })
                const session = sessionList.data[0]
                const {transactionId , appId} = session.metadata;
                if(appId === "MyGpt"){
                    const transaction = await paymentModel.findOne({_id : transactionId , isPaid : false})

                    // Update credits in user account 
                    await userModel.updateOne({_id : transaction.userId } , {$inc : {credits : transaction.credits}})

                    // Update Credit payment status 
                    transaction.isPaid = true ;
                    await transaction.save()
                }
                else {
                    console.log("error in switch case")
                    return res.json({recieved : true , message: "Ignored Events : Invalid App"})}
            }
                
                break;
        
            default:
                console.log("unhandled event type " , event.type)
                break;
        }
        res.json({
            recieved : true ,

        })
    } catch (error) {
        console.log("error in web hooks ->" , error )
        res.status(400).json({
            message : "error in stripe web hooks "
        })
        
    }
}

module.exports={stripeWebhooks}