import express from "express";
import { createPayment } from "./payment.controller";

const paymentRouter = express.Router();

paymentRouter.post("/create-checkout-session", createPayment);

export default paymentRouter;
