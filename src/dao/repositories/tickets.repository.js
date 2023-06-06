import { ticketsModel } from "../models/tickets.js";
import productsModel from "../models/products.js";
import cartsModel from "../models/carts.js";
import { ObjectId } from "mongodb";

class TicketsRepository {
    constructor () {}

addTicket = async (ticket) => {
	try {
		const createdTicket = ticketsModel.create(ticket);
		return createdTicket;
	} catch (error) {
		console.log(error);
		return error;
	}
};


getTicketById = async (ticketId) => {
    try {
        const ticket = await ticketsModel
            .findOne({ _id: new ObjectId(ticketId) })
            .lean();
        return ticket;
    } catch (error) {
        console.log(error);
        return error;
    }
};

getTickets = async () => {
    try {
        const tickets = await ticketsModel.find();
        return tickets;
    } catch (error) {
        console.log(error);
        return error;
    }
};
}

export const ticketsRepository = new TicketsRepository();
