import { Router } from "express";
import {
	addCart,
	getCarts,
	getCartById,
	addProduct,
	addProducts,
	deleteProduct,
	deleteProducts,
	updateProductQuantity,
	handlePurchase,	
} from "../controllers/cart.controller.js";
import { checkUser } from "../middlewares/auth.js";

const router = Router();

router.post("/", addCart);
router.get("/", getCarts);
router.get("/:cid", getCartById);
router.post("/:cid/product/:pid", addProduct);
router.post("/:cid", addProducts);
router.put("/:cid/product/:pid", updateProductQuantity);
router.delete("/:cid/product/:pid", deleteProduct);
router.delete("/:cid", deleteProducts);
router.post("/:cid/purchase", checkUser, handlePurchase);


export default router;
