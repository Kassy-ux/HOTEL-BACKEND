import { Request, Response } from "express";
import Stripe from "stripe";
import db from "../drizzle/db";
import { bookings, payments } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export const webhookHandler = async (req: Request, res: Response) => {

  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret);
  } catch (err: any) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const bookingId = session.metadata?.bookingId;
    const transactionId = session.payment_intent as string;
    const amount = session.amount_total;

    if (!bookingId || !transactionId || !amount) {
      console.error("❌ Missing required metadata in Stripe session");
      res.status(400).json({ error: "Missing required metadata" });
      return
    }

    // ✅ Convert Stripe status to valid enum value
    const stripeStatus = session.payment_status as Stripe.Checkout.Session.PaymentStatus;

    // Map Stripe status → your internal status enum
    let paymentStatus: "Pending" | "Completed" | "Failed" = "Pending";
    
    if (stripeStatus === "paid") {
      paymentStatus = "Completed";
    } else if (stripeStatus === "unpaid") {
      paymentStatus = "Failed";
    } else if (stripeStatus === "no_payment_required") {
      paymentStatus = "Pending"; // or "Completed" based on your business logic
    }
    
    

    try {
        // Save the payment
       await db.insert(payments).values({
          bookingId: parseInt(bookingId),
          amount: (amount / 100).toFixed(2),
          paymentStatus,
          transactionId,
        }).returning();

        // change status

      const res =   await db
      .update(bookings)
      .set({ bookingStatus: "Confirmed" }) // or use a variable like { bookingStatus }
      .where(eq(bookings.bookingId, parseInt(bookingId))) 
      .returning()
      
      console.log(res)


      console.log(`✅ Payment recorded for appointment ${bookingId}`);
    } catch (err) {
      console.error("❌ Failed to save payment in DB", err);
      res.status(500).json({ error: "Database insert failed" });
      return
    }
  }

  res.status(200).json({ received: true });
  return
};