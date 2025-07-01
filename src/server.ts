import express, { Application,Response } from 'express';
import dotenv from 'dotenv';
import { logger } from './middleware/logger';
import { rateLimiterMiddleware } from './middleware/rateLimiter';
import { authRouter } from './auth/auth.router';
import { userRouter } from './users/user.router';


dotenv.config();

const app: Application = express();
const cors = require('cors');

// Basic Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(rateLimiterMiddleware);

//default route
app.get('/', (req, res:Response) => {
  res.send("Welcome to Express API Backend WIth Drizzle ORM and PostgreSQL");
});

// Enable CORS for all routes
app.use(cors());

// Or configure specific origins
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


//import route

app.use('/api', authRouter);
app.use('/api',userRouter);

const PORT = process.env.PORT || 5000;




app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
 });
  
 