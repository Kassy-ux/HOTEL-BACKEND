"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentsOnlyByUserIdController = exports.deletePayment = exports.getPaymentsByUserId = exports.getPaymentById = exports.getAllPayments = exports.handleStripeWebhook = exports.createCheckoutSession = exports.createPayment = void 0;
const payment_service_1 = require("../payments/payment.service");
const stripe_1 = __importDefault(require("stripe"));
const booking_service_1 = require("../bookings/booking.service");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-06-30.basil',
});
// ✅ CREATE PAYMENT RECORD (not Stripe, just internal)
const createPayment = async (req, res) => {
    try {
        const payment = await (0, payment_service_1.createHotelPaymentService)(req.body);
        res.status(201).json(payment);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create payment", error });
    }
};
exports.createPayment = createPayment;
// ✅ STRIPE CHECKOUT SESSION
const createCheckoutSession = async (req, res) => {
    console.log("💬 Request Body:", req.body);
    const { amount, bookingId } = req.body;
    if (!amount || isNaN(amount)) {
        res.status(400).json({ error: 'Invalid input' });
        return;
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
};
exports.createCheckoutSession = createCheckoutSession;
// ✅ HANDLE STRIPE WEBHOOK
const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        const rawBody = req.rawBody || req.body; // Ensure rawBody middleware or buffer
        event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        console.error('Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const bookingId = session.metadata?.bookingId;
        if (bookingId) {
            try {
                await (0, booking_service_1.updateBookingStatusToConfirmedService)(parseInt(bookingId));
                console.log(`✅ Booking ${bookingId} confirmed.`);
            }
            catch (err) {
                console.error(`❌ Failed to confirm booking ${bookingId}:`, err);
            }
        }
    }
    res.status(200).json({ received: true });
};
exports.handleStripeWebhook = handleStripeWebhook;
// ✅ OTHER CONTROLLERS
const getAllPayments = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    try {
        const payments = await (0, payment_service_1.getAllHotelPaymentsService)(page, pageSize);
        res.json(payments);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching payments", error });
    }
};
exports.getAllPayments = getAllPayments;
const getPaymentById = async (req, res) => {
    const paymentId = parseInt(req.params.paymentId);
    try {
        const payment = await (0, payment_service_1.getHotelPaymentByIdService)(paymentId);
        if (!payment)
            res.status(404).json({ message: "Payment not found" });
        res.json(payment);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching payment", error });
        return;
    }
};
exports.getPaymentById = getPaymentById;
const getPaymentsByUserId = async (req, res) => {
    const userId = parseInt(req.params.userId);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    try {
        const payments = await (0, payment_service_1.getHotelPaymentsByUserIdService)(userId, page, pageSize);
        res.json(payments);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user payments", error });
    }
};
exports.getPaymentsByUserId = getPaymentsByUserId;
const deletePayment = async (req, res) => {
    const paymentId = parseInt(req.params.paymentId);
    try {
        const result = await (0, payment_service_1.deleteHotelPaymentService)(paymentId);
        res.json({ message: result });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete payment", error });
    }
};
exports.deletePayment = deletePayment;
const getPaymentsOnlyByUserIdController = async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (!userId)
        res.status(400).json({ error: "Invalid userId" });
    try {
        const payments = await (0, payment_service_1.getPaymentsOnlyByUserIdService)(userId);
        res.json(payments);
        return;
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch payments" });
        return;
    }
};
exports.getPaymentsOnlyByUserIdController = getPaymentsOnlyByUserIdController;
