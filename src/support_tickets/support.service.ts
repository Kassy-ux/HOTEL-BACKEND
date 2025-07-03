import db from '../drizzle/db';
import { supportTickets, TSupportTicketsInsert, TSupportTicketsSelect } from "../drizzle/schema";
import { eq } from 'drizzle-orm';

export const getAllTicketsService = async (): Promise<TSupportTicketsSelect[] | null> => {
  return await db.query.supportTickets.findMany({
    with: {
      user: {
        columns: {
          firstName: true,
          lastName: true,
          email: true,
          contactPhone: true
        }
      }
    }
  });
};

export const getTicketByIdService = async (id: number): Promise<TSupportTicketsSelect | undefined> => {
  return await db.query.supportTickets.findFirst({
    where: eq(supportTickets.ticketId, id),
    with: {
      user: {
        columns: {
          firstName: true,
          lastName: true,
          email: true,
          contactPhone: true
        }
      }
    }
  });
};

export const createTicketService = async (ticket: TSupportTicketsInsert): Promise<string> => {
  await db.insert(supportTickets).values(ticket).returning();
  return "Ticket created successfully";
};

export const updateTicketService = async (ticket: TSupportTicketsInsert, id: number): Promise<string> => {
  await db.update(supportTickets).set(ticket).where(eq(supportTickets.ticketId, id)).returning();
  return "Ticket updated successfully";
};

export const deleteTicketService = async (id: number): Promise<string> => {
  await db.delete(supportTickets).where(eq(supportTickets.ticketId, id)).returning();
  return "Ticket deleted successfully";
};
