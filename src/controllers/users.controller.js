import { db } from "../configs/database.config.js";
import jwt from "jsonwebtoken";
import { Users } from "../models/Users.model.js";
import bcrypt from "bcryptjs";
import { forceColor } from "../index.js";

export const register = async (req, res) => {
    try {
        const queryCheck = `SELECT * FROM users WHERE email = '${req.body.email}'`
        const [rows] = await db.query(queryCheck)
        if (rows[0]) {
            return res.status(400).json({
                code: "error",
                message: "Your email is existed!"
            });
        }

        const { username, email, password } = req.body;
        const query = `INSERT INTO users(username,email,password) VALUES('${username}','${email}','${password}')`

        db.query(query);
        res.status(200).json({
            code: "success",
            message: "Accout is created"
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: "error",
            message: "bad request"
        })
    }
}

export const loginSQL = async (req, res) => {
    try {

        const { email, password } = req.body;

        const query = `
        SELECT * FROM users 
        WHERE email = '${email}' 
        AND password = '${password}'
        `;

        const [rows] = await db.query(query);

        if (rows.length === 0) {
            return res.status(404).json({
                code: "error",
                message: "email or password is incorrect!"
            });
        }

        const data = rows[0];

        const token = jwt.sign({
            id: data.id,
            username: data.username,
        }, String(process.env.JWT));

        res.cookie('usersToken', token, {
            httpOnly: true,
            maxAge: 2 * 60 * 60 * 1000,
            secure: false,
            sameSite: "lax",
        });

        res.status(200).json({
            code: "success",
            message: "Login complete"
        });

    } catch (error) {

        console.log(error);

        res.status(400).json({
            code: "error",
            message: "bad request"
        });

    }
};

export const profileSQL = async (req, res) => {
    try {
        const { id } = req.client;

        const query = `SELECT id, username, email, phone, address, created_At, updated_At FROM users WHERE id = ${id}`
        const [rows] = await db.query(query);
        const data = rows[0]
        res.status(200).json({
            code: "success",
            data: {
                id: data.id,
                username: data.username,
                email: data.email,
                phone: "0" + data.phone,
                address: data.address,
            }
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: "error",
            message: "bad request"
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
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
        res.status(200).json({
            code: "success",
            message: "Profile is updated!"
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: "error",
            message: "bad request"
        })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { id } = req.client;
        const { oldPassword, newPassword } = req.body;
        const queryCheck = `SELECT * FROM users WHERE password = '${oldPassword}' AND id = ${id}`
        const [rows] = await db.query(queryCheck);
        if (!rows[0]) {
            return res.status(400).json({
                code: "error",
                message: "Your old password incorrected!"
            })
        };
        const query = `UPDATE users SET password = '${newPassword}' WHERE id = ${id}`

        await db.query(query);
        res.status(200).json({
            code: "success",
            message: "Profile is updated!"
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: "error",
            message: "bad request"
        })
    }
}

//func web

// Register
export const registerPage = async (req, res) => {
    res.render("register")
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
    res.render('login');
};

export const loginSQLwebApi = async (req, res) => {
    try {

        const { email, password } = req.body;

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
            httpOnly: true,
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

// END Login


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