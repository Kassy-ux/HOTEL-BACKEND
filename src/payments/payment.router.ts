import { Router } from "express";
import { createPayment, deletePayment, getAllPayments, getPaymentById, createCheckoutSession,getPaymentsByUserId, getPaymentsOnlyByUserIdController } from "./payment.controller";
import { pagination } from "../middleware/pagination";

import { webhookHandler } from "./payment.webhook";
const paymentRouter = Router();

paymentRouter.get("/payments",pagination, getAllPayments);
paymentRouter.get("/hotel-payments/user/:userId",getPaymentsByUserId);
paymentRouter.get("/payments/simple/:userId", getPaymentsOnlyByUserIdController);

paymentRouter.get("/payments/:paymentId", getPaymentById);
paymentRouter.post("/payments", createPayment);
paymentRouter.delete("/payments/:paymentId", deletePayment);
paymentRouter.post("/payments/create-checkout-session", createCheckoutSession);
// paymentRouter.post("/payments/webhook", webhookHandler);


export default paymentRouter;