"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTicketService = exports.getTicketsByStatusService = exports.deleteTicketService = exports.updateTicketService = exports.createTicketService = exports.getTicketsByUserIdService = exports.getTicketByIdService = exports.getAllTicketsService = void 0;
const db_1 = __importDefault(require("../drizzle/db"));
const schema_1 = require("../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const getAllTicketsService = async () => {
    return await db_1.default.query.supportTickets.findMany({
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
exports.getAllTicketsService = getAllTicketsService;
const getTicketByIdService = async (id) => {
    return await db_1.default.query.supportTickets.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.supportTickets.ticketId, id),
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
exports.getTicketByIdService = getTicketByIdService;
const getTicketsByUserIdService = async (userId) => {
    return await db_1.default.query.supportTickets.findMany({
        where: (0, drizzle_orm_1.eq)(schema_1.supportTickets.userId, userId),
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
exports.getTicketsByUserIdService = getTicketsByUserIdService;
const createTicketService = async (ticket) => {
    await db_1.default.insert(schema_1.supportTickets).values(ticket).returning();
    return "Ticket created successfully";
};
exports.createTicketService = createTicketService;
const updateTicketService = async (ticket, id) => {
    await db_1.default.update(schema_1.supportTickets).set(ticket).where((0, drizzle_orm_1.eq)(schema_1.supportTickets.ticketId, id)).returning();
    return "Ticket updated successfully";
};
exports.updateTicketService = updateTicketService;
const deleteTicketService = async (id) => {
    await db_1.default.delete(schema_1.supportTickets).where((0, drizzle_orm_1.eq)(schema_1.supportTickets.ticketId, id)).returning();
    return "Ticket deleted successfully";
};
exports.deleteTicketService = deleteTicketService;
const getTicketsByStatusService = async (status) => {
    if (status !== "Open" && status !== "Resolved") {
        throw new Error("Invalid status. Must be 'Open' or 'Resolved'.");
    }
    return await db_1.default.query.supportTickets.findMany({
        where: (0, drizzle_orm_1.eq)(schema_1.supportTickets.status, status),
        with: {
            user: {
                columns: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    contactPhone: true,
                    address: true,
                    role: true
                }
            }
        }
    });
};
exports.getTicketsByStatusService = getTicketsByStatusService;
// Mark ticket as Resolved
const resolveTicketService = async (ticketId) => {
    const ticket = await db_1.default.query.supportTickets.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.supportTickets.ticketId, ticketId)
    });
    if (!ticket)
        return null;
    if (ticket.status === "Resolved")
        return "ALREADY_RESOLVED";
    await db_1.default
        .update(schema_1.supportTickets)
        .set({ status: "Resolved" })
        .where((0, drizzle_orm_1.eq)(schema_1.supportTickets.ticketId, ticketId));
    return "Ticket marked as resolved 🎉";
};
exports.resolveTicketService = resolveTicketService;
