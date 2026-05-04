import { db } from "../configs/database.config.js";
import jwt from "jsonwebtoken";
import { Users } from "../models/Users.model.js";
import bcrypt from "bcryptjs";
import { forceColor } from "../index.js";

// Register
export const registerPage = async (req, res) => {
    const message = req.query.message;
    res.render("register", {
        message: message,
    })
}

export const registerApi = async (req, res) => {
    try {
        const account = await Users.findOne({
            where: {
                email: req.body.email,
            }
        });

        if (account) {
            return res.send(`
                <script>
                    alert("Tài khoản của bạn đã tồn tại!");
                    window.location.href="/register";
                </script>
            `);
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        await Users.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        })
        return res.send(`
                <script>
                    alert("Đăng ký tài khoản thành công!");
                    window.location.href="/login";
                </script>
            `);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: "error",
            message: "Register error!"
        })
    }
}
// End register

// Login 
export const loginSQLweb = async (req, res) => {
    const message = req.query.message
    res.render('login', {
        message: message,
    });
};

export const loginSQLwebApi = async (req, res) => {
    try {

        const { email, password } = req.body;

        if(!email || !password) {
           return res.redirect("/login?message=Please fill in the form");
        }

        const query = `SELECT * FROM users WHERE email = '${email}' AND password='${password}'`;


        console.log(forceColor.blue(`Query: ${query}`));
        const [rows] = await db.query(query);



        if (rows.length === 0) {
            return res.send(`
                <script>
                    alert("Tài khoản hoặc mật khẩu của bạn không đúng!");
                    window.location.href="/login";
                </script>
            `)
        }

        const data = rows[0];

        const token = jwt.sign({
            id: data.id,
            username: data.username,
        }, String(process.env.JWT));

        res.cookie('usersToken', token, {
            // httpOnly: true,
            maxAge: 2 * 60 * 60 * 1000,
            secure: false,
            sameSite: "lax",
        });

        return res.send(`
            <script>
                alert("Đăng nhập thành công!");
                window.location.href="/";
            </script>
        `);

    } catch (error) {

        console.log(error);

        res.status(400).json({
            code: "error",
            message: error
        });

    }
};

// export const loginSQLwebApi = async (req, res) => {
//     try {

//         const rawData = await Users.findOne({
//             where: {
//                 email: req.body.email,
//                 password: req.body.password
//             }
//         });
//         if (!rawData) {
//             return res.send(`
//                 <script>
//                     alert("Tài khoản hoặc mật khẩu của bạn không đúng!");
//                     window.location.href="/login";
//                 </script>
//             `);
//         }

//         const data = rawData.dataValues;

//         const token = jwt.sign({
//             id: data.id,
//             username: data.username,
//         }, String(process.env.JWT));

//         res.cookie('usersToken', token, {
//             httpOnly: true,
//             maxAge: 2 * 60 * 60 * 1000,
//             secure: false,
//             sameSite: "lax",
//         });

//         return res.send(`
//                 <script>
//                     alert("Đăng nhập thành công!");
//                     window.location.href="/";
//                 </script>
//             `);

//     } catch (error) {

//         console.log(error);

//         res.status(400).json({
//             code: "error",
//             message: "bad request"
//         });

//     }
// };

//End Login

export const logout = async (req, res) => {
    res.clearCookie('usersToken');
    res.redirect('/');
}

export const profileSQLweb = async (req, res) => {
    const { id } = req.client;

    const query = `SELECT id, username, email, phone, address, created_At, updated_At FROM users WHERE id = ${id}`
    const [rows] = await db.query(query);
    const data = rows[0]
    res.render('profile', {
        user: data
    })
}

export const profileUpdateSQLweb = async (req, res) => {
    const { id } = req.client;

    const query = `SELECT id, username, email, phone, address, created_At, updated_At FROM users WHERE id = ${id}`
    const [rows] = await db.query(query);
    const data = rows[0]
    res.render("profile-edit", {
        user: data
    });
}

export const profileUpdateSQLwebEX = async (req, res) => {
    const { id } = req.client;
    const { username, email, address, phone } = req.body;
    const queryCheck = `SELECT * FROM users WHERE email = '${email}' AND id != ${id}`;
    const [rows] = await db.query(queryCheck);
    if (rows[0]) {
        return res.status(400).json({
            code: "error",
            message: "Your email is existed!"
        })
    };

    const query = `UPDATE users SET username = '${username}', email = '${email}', address = '${address}', phone = ${phone} WHERE id = ${id}`
    await db.query(query);

    res.redirect('/profile');
}