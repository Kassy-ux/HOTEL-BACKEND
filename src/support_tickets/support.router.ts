import { Router } from 'express';
import {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketsByStatus,
  resolveTicket,
  getTicketsByUserId,

} from './support.controller';

const supportRouter = Router();

supportRouter.get('/tickets/tickets', getAllTickets);

supportRouter.get('/ticket/:id', getTicketById);
supportRouter.get('/tickets/user/:userId', getTicketsByUserId);
supportRouter.post('/tickets', createTicket);
supportRouter.put('/tickets/:id', updateTicket);
supportRouter.delete('/tickets/:id', deleteTicket);
supportRouter.get("/tickets/status/:status", getTicketsByStatus);
supportRouter.patch("/tickets/:id/resolve", resolveTicket);   //Resolve Ticket
export default supportRouter;
