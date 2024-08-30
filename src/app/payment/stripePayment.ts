import config from "../config";

const stripe = require('stripe')(config.stripe_secret);

export const stripePayment = async(data:any)=>{
 
   const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: data.serviceName,
          },
          unit_amount:Math.round(data.amount*100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    // The URL of your payment completion page
        success_url:data.success_url+`?id=${data.tran_id}`,
        cancel_url:data.cancel_url
    });
      
  return session.url
  
}