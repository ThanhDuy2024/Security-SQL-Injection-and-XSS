import express from "express";
import { webProduct } from "../controllers/products.controller.js";
import { usersMiddleware } from '../middlewares/users.middleware.js'
import { loginSQLweb, loginSQLwebApi, logout, profileSQLweb, profileUpdateSQLweb, profileUpdateSQLwebEX } from "../controllers/users.controller.js";
const router = express.Router();

router.get("/", webProduct);
router.get('/login', loginSQLweb);
router.post('/login', loginSQLwebApi);
router.get('/logout', logout);
router.get('/profile/edit', usersMiddleware, profileUpdateSQLweb);
router.post('/profile/edit', usersMiddleware, profileUpdateSQLwebEX);
router.get('/profile', usersMiddleware, profileSQLweb);
export default router;