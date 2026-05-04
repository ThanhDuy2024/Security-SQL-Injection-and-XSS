import express from "express";
import { productComments, productDetailPage, productPage, webProduct } from "../controllers/products.controller.js";
import { usersMiddleware } from '../middlewares/users.middleware.js'
import { loginSQLweb, loginSQLwebApi, logout, profileSQLweb, profileUpdateSQLweb, profileUpdateSQLwebEX, registerApi, registerPage } from "../controllers/users.controller.js";
import { usersCommentsMiddleware } from "../middlewares/usersComment.middleware.js";
import { postCookie, pageFun } from "../controllers/cookieStolenDemo.controller.js";
const router = express.Router();

//Home page, product page and comments
router.get("/", webProduct);
router.get("/product", productPage);
router.get("/product/:id", productDetailPage);
router.post('/product/:id/comment', usersCommentsMiddleware, productComments);

//Authentication
router.get('/login', loginSQLweb);
router.post('/login', loginSQLwebApi);
router.get("/register", registerPage);
router.post("/register", registerApi);
router.get('/logout', logout);
router.get('/profile/edit', usersMiddleware, profileUpdateSQLweb);
router.post('/profile/edit', usersMiddleware, profileUpdateSQLwebEX);
router.get('/profile', usersMiddleware, profileSQLweb);

// Stolen cookie demo
router.post("/stolen", postCookie)
router.get("/fun/page/:id", pageFun);
export default router;