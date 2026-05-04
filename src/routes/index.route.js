import express from "express";
import productsRoute from "./products.route.js";
const router = express.Router();
router.use("/products", productsRoute);
export default router;