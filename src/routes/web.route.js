import express from "express";
import { productPage, webProduct } from "../controllers/products.controller.js";
import { usersMiddleware } from '../middlewares/users.middleware.js'
import { loginSQLweb, loginSQLwebApi, logout, profileSQLweb, profileUpdateSQLweb, profileUpdateSQLwebEX, registerApi, registerPage } from "../controllers/users.controller.js";
const router = express.Router();

router.get("/", webProduct);
router.get("/product", productPage);
router.get('/login', loginSQLweb);
router.post('/login', loginSQLwebApi);
router.get("/register", registerPage);
router.post("/register", registerApi);
router.get('/logout', logout);
router.get('/profile/edit', usersMiddleware, profileUpdateSQLweb);
router.post('/profile/edit', usersMiddleware, profileUpdateSQLwebEX);
router.get('/profile', usersMiddleware, profileSQLweb);
export default router;