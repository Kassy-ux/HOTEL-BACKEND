import { Router } from 'express';
import {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket
} from './support.controller';

const supportRouter = Router();

supportRouter.get('/ticket', getAllTickets);
supportRouter.get('/ticket/:id', getTicketById);
supportRouter.post('/ticket', createTicket);
supportRouter.put('/ticket/:id', updateTicket);
supportRouter.delete('/ticket/:id', deleteTicket);

export default supportRouter;
