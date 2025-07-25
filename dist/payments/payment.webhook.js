"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookHandler = void 0;
const stripe_1 = __importDefault(require("stripe"));
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
// Initialize Stripe
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-06-30.basil",
});
const webhookHandler = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
    catch (err) {
        console.error("❌ Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const bookingId = session.metadata?.bookingId;
        const transactionId = session.payment_intent;
        const amount = session.amount_total;
        if (!bookingId || !transactionId || !amount) {
            console.error("❌ Missing bookingId, amount, or transactionId");
            return res.status(400).json({ error: "Missing Stripe metadata" });
        }
        // Convert Stripe status to internal enum
        let paymentStatus = "Pending";
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
            await db_1.default.insert(schema_1.payments).values({
                bookingId: parseInt(bookingId),
                paymentMethod: 'Card',
                amount: (amount / 100).toFixed(2), // Convert cents to dollars
                transactionId,
                paymentStatus,
            });
            // Update booking status if payment completed
            if (paymentStatus === "Completed") {
                await db_1.default.update(schema_1.bookings)
                    .set({ bookingStatus: "Confirmed" })
                    .where((0, drizzle_orm_1.eq)(schema_1.bookings.bookingId, parseInt(bookingId)));
            }
            console.log(`✅ Payment recorded for booking #${bookingId}`);
        }
        catch (error) {
            console.error("❌ Database operation failed:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    return res.status(200).json({ received: true });
};
exports.webhookHandler = webhookHandler;
