"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("./middleware/logger");
// import { rateLimiterMiddleware } from './middleware/rateLimiter';
const auth_router_1 = require("./auth/auth.router");
const user_router_1 = require("./users/user.router");
const hotel_router_1 = require("./hotels/hotel.router");
const room_router_1 = __importDefault(require("./rooms/room.router"));
const booking_router_1 = __importDefault(require("./bookings/booking.router"));
const support_router_1 = __importDefault(require("./support_tickets/support.router"));
const payment_router_1 = __importDefault(require("./payments/payment.router"));
const cors_1 = __importDefault(require("cors"));
const payment_webhook_1 = require("./payments/payment.webhook");
const app = (0, express_1.default)();
app.post("/api/payments/webhook", express_1.default.raw({ type: 'application/json' }), (req, res, next) => {
    (0, payment_webhook_1.webhookHandler)(req, res).catch(next);
});
dotenv_1.default.config();
// Basic Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(logger_1.logger);
//default route
app.get('/', (req, res) => {
    res.send("Welcome to Express API Backend WIth Drizzle ORM and PostgreSQL");
});
// Or configure specific origins
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
//import route
app.use('/api', auth_router_1.authRouter);
app.use('/api', user_router_1.userRouter);
app.use('/api', hotel_router_1.hotelRouter);
app.use('/api', room_router_1.default);
app.use('/api', booking_router_1.default);
app.use('/api', support_router_1.default);
app.use("/api", payment_router_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
