"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTicket = exports.getTicketsByStatus = exports.deleteTicket = exports.updateTicket = exports.createTicket = exports.getTicketsByUserId = exports.getTicketById = exports.getAllTickets = void 0;
const support_service_1 = require("./support.service");
const getAllTickets = async (req, res) => {
    try {
        const tickets = await (0, support_service_1.getAllTicketsService)();
        if (!tickets || tickets.length === 0) {
            res.status(404).json({ message: 'No tickets found' });
            return;
        }
        res.json(tickets);
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Failed to retrieve tickets' });
    }
};
exports.getAllTickets = getAllTickets;
const getTicketById = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id))
        res.status(400).json({ error: 'Invalid ticket ID' });
    try {
        const ticket = await (0, support_service_1.getTicketByIdService)(id);
        if (!ticket)
            res.status(404).json({ message: 'Ticket not found' });
        res.json(ticket);
        return;
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Failed to retrieve ticket' });
    }
};
exports.getTicketById = getTicketById;
const getTicketsByUserId = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        console.log(userId);
        if (isNaN(userId)) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
        }
        const tickets = await (0, support_service_1.getTicketsByUserIdService)(userId);
        if (!tickets || tickets.length === 0) {
            res.status(404).json({ message: 'No tickets found for this user' });
            return;
        }
        res.status(200).json(tickets);
        return;
    }
    catch (error) {
        console.error('Error fetching tickets by user ID:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
exports.getTicketsByUserId = getTicketsByUserId;
const createTicket = async (req, res) => {
    try {
        const ticket = req.body;
        if (!ticket || !ticket.userId || !ticket.subject || !ticket.description) {
            res.status(400).json({ error: 'Missing required ticket fields' });
            return;
        }
        const message = await (0, support_service_1.createTicketService)(ticket);
        res.status(201).json({ message });
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Failed to create ticket' });
    }
};
exports.createTicket = createTicket;
const updateTicket = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id))
        res.status(400).json({ error: 'Invalid ticket ID' });
    try {
        const ticket = req.body;
        if (!ticket)
            res.status(400).json({ error: 'Missing ticket data to update' });
        const updated = await (0, support_service_1.updateTicketService)(ticket, id);
        if (!updated) {
            res.status(404).json({ message: 'Ticket not found or not updated' });
            return;
        }
        res.json({ message: 'Ticket updated successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Failed to update ticket' });
    }
};
exports.updateTicket = updateTicket;
const deleteTicket = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id))
        res.status(400).json({ error: 'Invalid ticket ID' });
    try {
        const deleted = await (0, support_service_1.deleteTicketService)(id);
        if (!deleted)
            res.status(404).json({ message: 'Ticket not found' });
        res.json({ message: 'Ticket deleted successfully' });
        return;
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Failed to delete ticket' });
    }
};
exports.deleteTicket = deleteTicket;
const getTicketsByStatus = async (req, res) => {
    const status = req.params.status;
    if (status !== "Open" && status !== "Resolved") {
        res.status(400).json({
            message: "Invalid status. Use either 'Open' or 'Resolved'."
        });
        return;
    }
    try {
        const tickets = await (0, support_service_1.getTicketsByStatusService)(status);
        if (!tickets || tickets.length === 0) {
            res.status(404).json({ message: `No '${status}' tickets found` });
            return;
        }
        res.status(200).json({
            message: `Tickets with status '${status}' retrieved successfully ✅`,
            tickets
        });
        return;
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to filter tickets" });
        return;
    }
};
exports.getTicketsByStatus = getTicketsByStatus;
const resolveTicket = async (req, res) => {
    const ticketId = parseInt(req.params.id);
    if (isNaN(ticketId)) {
        res.status(400).json({ message: "Invalid ticket ID" });
        return;
    }
    try {
        const result = await (0, support_service_1.resolveTicketService)(ticketId);
        if (result === null) {
            res.status(404).json({ message: "Ticket not found" });
            return;
        }
        if (result === "ALREADY_RESOLVED") {
            res.status(409).json({ message: "Ticket is already resolved" });
            return;
        }
        res.status(200).json({ message: result });
        return;
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to resolve ticket" });
        return;
    }
};
exports.resolveTicket = resolveTicket;
