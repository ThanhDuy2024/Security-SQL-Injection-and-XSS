import { Op } from "sequelize";
import { db } from "../configs/database.config.js";
import { Products } from "../models/Product.model.js";
import { forceColor } from "../index.js";

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
            let query = `SELECT * FROM products`
            let query2 = `SELECT * FROM products`
            let query3 = `SELECT * FROM products LIMIT 4 OFFSET 4`
            if (req.query.search) {
                query += ` WHERE productName LIKE '%${req.query.search}%'`
            }
            query += " LIMIT 8 OFFSET 0"
            const [rows] = await db.query(query);
            const [rows2] = await db.query(query2);
            const [rows3] = await db.query(query3);
            res.render("index", {
                products: rows,
                products2: rows2,
                products3: rows3,
                user: req.cookies.usersToken,
                search: req.query.search
            })
        } else {
            let query = `SELECT * FROM products`
            let query2 = `SELECT * FROM products`
            let query3 = `SELECT * FROM products LIMIT 4 OFFSET 4`
            if (req.query.search) {
                query += ` WHERE productName LIKE '${req.query.search}'`
            }
            query += " LIMIT 8 OFFSET 0"
            const [rows] = await db.query(query);
            const [rows2] = await db.query(query2);
            const [rows3] = await db.query(query3);
            res.render("index", {
                products: rows,
                products2: rows2,
                products3: rows3,
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

//Product injection

export const productPage = async (req, res) => {
    try {
        let query = `SELECT image, productName, price FROM products`
        const search = req.query.search;
        if (search) {
            query += ` 
            where productName LIKE '%${search}%'`
        }
        query += ' order by updated_at desc'
        console.log(forceColor.blue(`Query product: ${query}`))
        const [rows] = await db.query(query);
        res.render("product", {
            products: rows,
            user: req.cookies.usersToken,
            search: req.query.search
        })
    } catch (error) {
        console.log(error);
        res.redirect("/product")
    }
}

// export const productPage = async (req, res) => {
//     try {
//         const query = {
//             nest: true,
//             where: {},
//             order: [
//                 ['updated_at', 'desc']
//             ]
//         }

//         if(req.query.search) {
//             query.where.productName = {
//                 [Op.like]: `%${req.query.search}%`
//             }
//         }
//         const data = await Products.findAll(query);

//         res.render("product", {
//             products: data,
//             user: req.cookies.usersToken,
//             search: req.query.search
//         })
//     } catch (error) {
//         console.log(error);
//         res.redirect("/product")
//     }
// }