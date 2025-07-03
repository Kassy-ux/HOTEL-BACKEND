import Stripe from "stripe";
import dotenv from "dotenv";
import db from "../drizzle/db";
import { payments } from "../drizzle/schema";
import { decimalToFloat } from "../utils/helpers";
import { eq } from "drizzle-orm";

dotenv.config();

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil", // updated to match the expected type
});

export const createStripePaymentService = async ({
  bookingId,
  amount,
  paymentMethod = "card",
}: {
  bookingId: number;
  amount: number;
  paymentMethod?: string;
}) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    payment_method_options: {
      card: {
        request_three_d_secure: "any",
      },
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Hotel Booking Payment",
          },
          unit_amount: Math.round(amount * 100), // Stripe expects amount in cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/success`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,
    metadata: {
      bookingId: bookingId.toString(),
    },
  });

  await db.insert(payments).values({
    bookingId,
    amount: decimalToFloat(amount),
    paymentStatus: "Pending",
    transactionId: session.id,
    paymentMethod,
  });

  return { url: session.url };
};

export const handleStripeWebhookService = async (event: Stripe.Event) => {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Mark payment as complete in DB
    await db
      .update(payments)
      .set({
        paymentStatus: "Completed",
        paymentDate: new Date().toISOString(),
      })
      .where(eq(payments.transactionId, session.id));
// matching by session.id
  }

  // You can handle more events if needed
};
