import { productsRepository } from "../repositories/product.repository.js";
import { ticketsRepository } from "../repositories/tickets.repository.js";
import { cartsRepository } from "../repositories/cart.repository.js";

class TicketsService {
	constructor() {}

createTicket = (userId, amount) => {
	const code = Math.floor(Math.random() * 1000000);
	const createdAt = new Date();
	const purchaser = userId;
	const ticket = {
		code,
		createdAt,
		amount,
		purchaser,
	};
	this.addTicket(ticket);
};
addTicket = async (ticket) => {
	const result = await ticketsRepository.addTicket(ticket);
	return result;
};
getTickets = async () => {
	const tickets = await ticketsRepository.getTickets();
	return tickets;
};
getTicketById = async (ticketId) => {
	const ticket = await ticketsRepository.getTicketById(ticketId);
	return ticket;
};
handlePurchase = async (cartId, userId) => {
	const cart = await cartsRepository.getCartById(cartId);
	const productsInCart = cart.products.map((product) => {
		const prd = {
			_id: product.product._id,
			quantity: product.quantity,
		};
		return prd;
	});
	const productInStorePromise = [];
	productsInCart.forEach(async (product) => {
		productInStorePromise.push(
			new Promise((resolve, reject) => {
				resolve(productsRepository.getProductById(product._id));
			})
		);
	});
	const productsInStore = await Promise.all(productInStorePromise).then(
		(res) =>
			res.map((product) => {
				const prd = {
					_id: product._id,
					quantity: product.stock,
					price: product.price,
				};
				return prd;
			})
	);
	const productsPurchased = productsInCart.map((product, i) => {
		return {
			_id: product._id,
			quantity: Math.min(
				productsInCart[i].quantity,
				productsInStore[i].quantity
			),
			price: productsInStore[i].price,
		};
	});
	const productsRemaining = productsInCart.map((product, i) => {
		return {
			_id: product._id,
			quantity: productsInStore[i].quantity - productsPurchased[i].quantity,
		};
	});
	const productsOutOfStock = productsInCart
		.map((product, i) => {
			const quantity =
				productsInCart[i].quantity - productsPurchased[i].quantity;
			if (!quantity) return;
			return {
				_id: product._id,
				quantity,
			};
		})
		.filter((element) => element !== undefined);
	console.log({
		productsInCart,
		productsInStore,
		productsPurchased,
		productsRemaining,
		productsOutOfStock,
	});
	
	const amount = productsPurchased.reduce((acc, product) => {
		return acc + parseFloat(product.price) * parseFloat(product.quantity);
	}, 0);

	if (!amount) {
		const result = {
			status: "Error",
			message: "All products out of stock",
		};
		console.log(result);
		return result;
	} else {
		
		productsRemaining.forEach((product) => {
			productsRepository.updateProduct(product._id, {
				stock: product.quantity,
			});
		});
		
		const productsNewCart = productsOutOfStock.map((product) => {
			return {
				product: product._id,
				quantity: product.quantity,
			};
		});
		cartsRepository.updateCart(cartId, productsNewCart);
	
		this.createTicket(userId, amount);
		const result = {
			status: "Success",
			message: "Successful purchase",
		};
		console.log(result);
		return result;
	}
	};
}
    

export const ticketsService = new TicketsService();