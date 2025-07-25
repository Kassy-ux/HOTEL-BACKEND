import { Request, Response } from "express";
import Stripe from "stripe";
import db from "../drizzle/db";
import { bookings, payments } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Initialize Stripe
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
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const bookingId = session.metadata?.bookingId;
    const transactionId = session.payment_intent as string;
    const amount = session.amount_total;

    if (!bookingId || !transactionId || !amount) {
      console.error("❌ Missing bookingId, amount, or transactionId");
      return res.status(400).json({ error: "Missing Stripe metadata" });
    }

    // Convert Stripe status to internal enum
    let paymentStatus: "Pending" | "Completed" | "Failed" = "Pending";

    switch (session.payment_status) {
      case "paid":
        paymentStatus = "Completed";
        break;
      case "unpaid":
        paymentStatus = "Failed";
        break;
      case "no_payment_required":
        paymentStatus = "Pending";
        break;
    }

    try {
      // Save payment to DB
      await db.insert(payments).values({
        bookingId: parseInt(bookingId),
        paymentMethod: 'Card',
        amount: (amount / 100).toFixed(2), // Convert cents to dollars
        transactionId,
        paymentStatus,
      });

      // Update booking status if payment completed
      if (paymentStatus === "Completed") {
        await db.update(bookings)
          .set({ bookingStatus: "Confirmed" })
          .where(eq(bookings.bookingId, parseInt(bookingId)));
      }

      console.log(`✅ Payment recorded for booking #${bookingId}`);
    } catch (error) {
      console.error("❌ Database operation failed:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(200).json({ received: true });
};
