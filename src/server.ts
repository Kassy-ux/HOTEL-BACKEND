import express, {  Application , Response} from 'express';
import dotenv from 'dotenv';
import { logger } from './middleware/logger';
// import { rateLimiterMiddleware } from './middleware/rateLimiter';
import { authRouter } from './auth/auth.router';
import { userRouter } from './users/user.router';
import { hotelRouter } from './hotels/hotel.router';
import roomRouter from './rooms/room.router';
import BookingRouter from './bookings/booking.router';
import supportRouter from './support_tickets/support.router';
import paymentRouter from './payments/payment.router';
import cors from 'cors';
import { webhookHandler } from './payments/payment.webhook';
import { handleStripeWebhook } from './payments/payment.controller';




const app = express();
dotenv.config();
// Basic Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.post('/webhook',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);
//default route
app.get('/', (req, res:Response) => {
  res.send("Welcome to Express API Backend WIth Drizzle ORM and PostgreSQL");
});
// Or configure specific origins
app.use(cors({
  origin: ['http://localhost:5173', 'https://stayluxe.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


//import route

app.use('/api', authRouter);
app.use('/api',userRouter);
app.use('/api',hotelRouter);
app.use ('/api',roomRouter);
app.use ('/api',BookingRouter);
app.use('/api',supportRouter);
app.use("/api", paymentRouter);

const PORT = process.env.PORT || 5000;




app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
 });
  

 