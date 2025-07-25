"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const support_controller_1 = require("./support.controller");
const supportRouter = (0, express_1.Router)();
supportRouter.get('/tickets/tickets', support_controller_1.getAllTickets);
supportRouter.get('/ticket/:id', support_controller_1.getTicketById);
supportRouter.get('/tickets/user/:userId', support_controller_1.getTicketsByUserId);
supportRouter.post('/tickets', support_controller_1.createTicket);
supportRouter.put('/tickets/:id', support_controller_1.updateTicket);
supportRouter.delete('/tickets/:id', support_controller_1.deleteTicket);
supportRouter.get("/tickets/status/:status", support_controller_1.getTicketsByStatus);
supportRouter.patch("/tickets/:id/resolve", support_controller_1.resolveTicket); //Resolve Ticket
exports.default = supportRouter;
