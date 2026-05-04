import { Op } from "sequelize";
import { db } from "../configs/database.config.js";
import { Products } from "../models/Product.model.js";
import { forceColor } from "../index.js";

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
        let query = `SELECT id, image, productName, price FROM products`
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

export const productDetailPage = async (req, res) => {
    const query = `SELECT * FROM products WHERE id = ${req.params.id}`
    const queryComment = `
        SELECT *
        FROM security.comments as C
        JOIN products as P
        on P.id = C.product_id
        where P.id = ${req.params.id}
        order by C.created_at desc
    `;
    const [rows] = await db.query(query)
    const [rowsComment] = await db.query(queryComment);

    const formattedComments = rowsComment.map(c => ({
        ...c,
        created_at: new Date(c.created_at).toLocaleString("vi-VN")
    }));

    res.render("productDetail", {
        product: rows[0],
        comments: formattedComments,
        user: req.cookies.usersToken,
    });
}

export const productComments = async (req, res) => {
    try {
        const queryUser = `SELECT email FROM users where id = ${req.client.id}`
        const [rows] = await db.query(queryUser);

        if (!rows[0].email) {
            return res.send(`
                <script>
                    alert("Bạn cần đăng nhập để dùng chức năng này!");
                    window.location.href="/product/${req.params.id}";
                </script>
            `);
        }

        const email = rows[0].email;

        const query = `
            INSERT INTO comments (product_id, email, content)
            VALUES (${req.params.id}, '${email}', '${req.body.content}');
        `

        await db.query(query);

        res.redirect(`/product/${req.params.id}`)

    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: "error",
            message: "Bad request"
        })
    }
}