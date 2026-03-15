import express from "express";
import usersRoute from "./users.route.js";
import productsRoute from "./products.route.js";
const router = express.Router();

router.use("/users", usersRoute);
router.use("/products", productsRoute);
export default router;