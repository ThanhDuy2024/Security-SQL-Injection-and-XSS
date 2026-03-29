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

export const addProduct = async (req, res) => {
    try {
        const product = {
            productName: req.body.productName,
            price: req.body.price,
            quantity: req.body.quantity,
            status: req.body.status,
            image: req.file ? req.file.path : null
        };

        const query = `INSERT INTO products (productName, image, status, price, quantity) 
        VALUES ('${product.productName}', '${product.image}', '${product.status}', '${product.price}', '${product.quantity}');`

        await db.query(query);
        res.status(200).json({
            code: "success",
            message: "Product create complete"
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: "error"
        });
    }
};

//function web
export const webProduct = async (req, res) => {
    try {
        const token = req.cookies.usersToken;
        if (token) {
            let query = `SELECT * FROM products LIMIT 8 OFFSET 0`

            if (req.query.search) {
                query += ` WHERE productName LIKE '${req.query.search}'`
            }
            const [rows] = await db.query(query);
            res.render("index", {
                name: "Duy",
                products: rows,
                user: token,
                search: req.query.search
            })
        } else {
            let query = `SELECT * FROM products`

            if (req.query.search) {
                query += ` WHERE productName LIKE '%${req.query.search}%'`
            }
            const [rows] = await db.query(query);
            res.render("index", {
                name: "Duy",
                products: rows,
                search: req.query.search
            })
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: "error",
            message: "server error"
        })
    }
}