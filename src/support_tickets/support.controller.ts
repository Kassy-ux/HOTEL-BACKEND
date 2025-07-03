import { Request, Response } from 'express';
import {
  getAllTicketsService,
  getTicketByIdService,
  createTicketService,
  updateTicketService,
  deleteTicketService
} from './support.service';
import { TSupportTicketsInsert } from '../drizzle/schema';

export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await getAllTicketsService();
    if (!tickets || tickets.length === 0) {
       res.status(404).json({ message: 'No tickets found' });
       return
    }
    res.json(tickets);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to retrieve tickets' });
  }
};

export const getTicketById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id))  res.status(400).json({ error: 'Invalid ticket ID' });
  
  try {
    const ticket = await getTicketByIdService(id);
    if (!ticket)  res.status(404).json({ message: 'Ticket not found' });

    res.json(ticket);return
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to retrieve ticket' });
  }
};

export const createTicket = async (req: Request, res: Response) => {
  try {
    const ticket = req.body as TSupportTicketsInsert;

    if (!ticket || !ticket.userId || !ticket.subject || !ticket.description) {
       res.status(400).json({ error: 'Missing required ticket fields' });return
    }

    const message = await createTicketService(ticket);
    res.status(201).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to create ticket' });
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id))  res.status(400).json({ error: 'Invalid ticket ID' });

  try {
    const ticket = req.body as TSupportTicketsInsert;
    if (!ticket)  res.status(400).json({ error: 'Missing ticket data to update' });

    const updated = await updateTicketService(ticket, id);
    if (!updated) {
       res.status(404).json({ message: 'Ticket not found or not updated' });return
    }

    res.json({ message: 'Ticket updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update ticket' });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id))  res.status(400).json({ error: 'Invalid ticket ID' });

  try {
    const deleted = await deleteTicketService(id);
    if (!deleted) res.status(404).json({ message: 'Ticket not found' });

    res.json({ message: 'Ticket deleted successfully' });return
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete ticket' });
  }
};
