import express from "express";
import { createPayment, stripeWebhook } from "./payment.controller";

const paymentRouter = express.Router();

paymentRouter.post("/payments/create-checkout-session", createPayment);

// Stripe webhook route must receive raw body
paymentRouter.post("/payments/webhook", express.raw({ type: "application/json" }), stripeWebhook);

export default paymentRouter;
