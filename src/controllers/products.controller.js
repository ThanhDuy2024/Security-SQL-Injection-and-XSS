import { db } from "../configs/database.config.js";

export const getProduct = async (req, res) => {
    try {
        let query = `SELECT * FROM products`

        if (req.query.search) {
            query += ` WHERE productName LIKE '%${req.query.search}%'`
        }
        const [rows] = await db.query(query);
        res.status(200).json({
            code: "ok",
            data: rows,
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: "error",
            message: "server error"
        })
    }
}

export const productDetail = async (req, res) => {
    try {
        const query = `SELECT * FROM products WHERE id = ${req.params.id}`
        const [rows] = await db.query(query);
        res.status(200).json({
            code: "Ok",
            data: rows[0]
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: "error",
            message: "Server error"
        })
    }
}