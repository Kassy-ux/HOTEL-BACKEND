import { Request, Response } from "express";
import { createStripePaymentService, stripe } from "./payment.service";
import Stripe from "stripe";
import { payments } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import db from "../drizzle/db";


interface RawRequest extends Request {
  rawBody: Buffer;
}

export const createPayment = async (req: Request, res: Response) => {
  try {
    const result = await createStripePaymentService(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  try {
    const event = stripe.webhooks.constructEvent(
      req.body as Buffer, // 👈 cast to Buffer
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      await db
        .update(payments)
        .set({ paymentStatus: "Completed", paymentDate: new Date().toISOString() })
        .where(eq(payments.transactionId, session.id));
    }

    res.status(200).send("Webhook received");
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
