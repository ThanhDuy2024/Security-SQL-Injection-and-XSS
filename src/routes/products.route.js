import express from "express";
import { addProduct } from "../controllers/products.controller.js";
import multer from "multer";
import { storage } from "../helpers/cloudinary.helper.js";

const router = express.Router();
const upload = multer({
    storage: storage 
})

router.post('/create', upload.single('image'), addProduct);
export default router;