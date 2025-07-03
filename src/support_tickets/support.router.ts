import { Router } from 'express';
import {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketsByStatus,
  resolveTicket
} from './support.controller';

const supportRouter = Router();

supportRouter.get('/ticket', getAllTickets);
supportRouter.get('/ticket/:id', getTicketById);
supportRouter.post('/ticket', createTicket);
supportRouter.put('/ticket/:id', updateTicket);
supportRouter.delete('/ticket/:id', deleteTicket);
supportRouter.get("/tickets/status/:status", getTicketsByStatus);
supportRouter.patch("/tickets/:id/resolve", resolveTicket);   //Resolve Ticket
export default supportRouter;
