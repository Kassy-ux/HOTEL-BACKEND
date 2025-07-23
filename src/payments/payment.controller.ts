import { Request, Response } from "express";
import {
  createHotelPaymentService,
  getAllHotelPaymentsService,
  getHotelPaymentByIdService,
  getHotelPaymentsByUserIdService,
  deleteHotelPaymentService,
} from "../payments/payment.service";

import Stripe from "stripe";
import { updateBookingStatusToConfirmedService } from "../bookings/booking.service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

// ✅ CREATE PAYMENT RECORD (not Stripe, just internal)
export const createPayment = async (req: Request, res: Response) => {
  try {
    const payment = await createHotelPaymentService(req.body);
    
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Failed to create payment", error });
  }
};

// ✅ STRIPE CHECKOUT SESSION
export const createCheckoutSession = async (req: Request, res: Response) => {
  console.log("💬 Request Body:", req.body);
  const { amount, bookingId } = req.body;

  if (!amount || isNaN(amount)) {
     res.status(400).json({ error: 'Invalid input' }); return
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: amount,
            product_data: {
              name: 'Booking Payment',
              description: 'Room booking payment',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: bookingId?.toString() || '', // ✅ Pass it correctly
      },
      success_url: 'http://localhost:5173/dashboard/Bookings',
      cancel_url: 'http://localhost:5173/payment-cancelled',
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

// ✅ HANDLE STRIPE WEBHOOK
export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const rawBody = (req as any).rawBody || req.body; // Ensure rawBody middleware or buffer
    event = stripe.webhooks.constructEvent(rawBody, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      try {
        await updateBookingStatusToConfirmedService(parseInt(bookingId));
        console.log(`✅ Booking ${bookingId} confirmed.`);
      } catch (err) {
        console.error(`❌ Failed to confirm booking ${bookingId}:`, err);
      }
    }
  }

  res.status(200).json({ received: true });
};

// ✅ OTHER CONTROLLERS

export const getAllPayments = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  try {
    const payments = await getAllHotelPaymentsService(page, pageSize);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error });
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  const paymentId = parseInt(req.params.paymentId);

  try {
    const payment = await getHotelPaymentByIdService(paymentId);
    if (!payment) res.status(404).json({ message: "Payment not found" })

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment", error });return
  }
};

export const getPaymentsByUserId = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  try {
    const payments = await getHotelPaymentsByUserIdService(userId, page, pageSize);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user payments", error });
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  const paymentId = parseInt(req.params.paymentId);

  try {
    const result = await deleteHotelPaymentService(paymentId);
    res.json({ message: result });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete payment", error });
  }
};
