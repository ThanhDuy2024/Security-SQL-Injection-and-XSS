import jwt from 'jsonwebtoken'
export const usersMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.usersToken;
        const verify = jwt.verify(token, process.env.JWT);
        if (!verify) {
            return res.status(400).json({
                code: "error",
                message: "error token",
            })
        };

        req.client = {
            id: verify.id,
        }
        next();
    } catch (error) {
        res.redirect("/");
    }
}