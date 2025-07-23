import { eq, desc } from "drizzle-orm";
import db from "../drizzle/db";
import { payments, bookings } from "../drizzle/schema";
import type { TPaymentsSelect, TPaymentsInsert , TBookingsSelect } from "../drizzle/schema";

// Create new payment
export const createHotelPaymentService = async (payment: TPaymentsInsert): Promise<TPaymentsSelect | undefined> => {
  const [newPayment] = await db.insert(payments).values(payment).returning();

  // Optional: Update booking status if payment is completed and bookingId exists
  if (payment.paymentStatus === "Completed" && payment.bookingId !== undefined && payment.bookingId !== null) {
    await db.update(bookings)
      .set({ bookingStatus: "Confirmed" }) 
      .where(eq(bookings.bookingId, payment.bookingId));
  }

  return newPayment;
};


// Get all payments with booking, user, and room
export const getAllHotelPaymentsService = async (page: number, pageSize: number): Promise<TPaymentsSelect[] | null> => {
  const list = await db.query.payments.findMany({
    with: {
      booking: {
        with: {
          user: { columns: { password: false } },
          room: true,
        },
      },
    },
    orderBy: desc(payments.paymentId),
    offset: (page - 1) * pageSize,
    limit: pageSize,
  });

  return list;
};

// Get a single payment by ID
export const getHotelPaymentByIdService = async (paymentId: number): Promise<TPaymentsSelect | undefined> => {
  return await db.query.payments.findFirst({
    where: eq(payments.paymentId, paymentId),
    with: {
      booking: {
        with: {
          user: { columns: { password: false } },
          room: true,
        },
      },
    },
  });
};

// Get all payments for a given user ID
export const getHotelPaymentsByUserIdService = async (
  userId: number,
  page: number,
  pageSize: number
): Promise<TBookingsSelect[] | null> => {
  return await db.query.bookings.findMany({
    where: eq(bookings.userId, userId),
    with: {
      payments: true,
      user: { columns: { password: false } },
      room: true,
    },
    orderBy: desc(bookings.bookingId),
    offset: (page - 1) * pageSize,
    limit: pageSize,
  });
};

// Delete a payment
export const deleteHotelPaymentService = async (paymentId: number): Promise<string> => {
  await db.delete(payments).where(eq(payments.paymentId, paymentId));
  return "Payment deleted successfully";
};



