import Stripe from "stripe";
import dotenv from "dotenv";
import db from "../drizzle/db";
import { payments } from "../drizzle/schema";
import { decimalToFloat } from "../utils/helpers";

dotenv.config();

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-06-30.basil"

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
          unit_amount: Math.round(amount * 100),
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
