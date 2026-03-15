import express from "express";
import { getProduct, productDetail } from "../controllers/products.controller.js";

const router = express.Router();

router.get("/list", getProduct);
router.get("/detail/:id", productDetail);
export default router;