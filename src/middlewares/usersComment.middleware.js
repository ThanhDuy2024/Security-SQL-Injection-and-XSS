import jwt from 'jsonwebtoken'
export const usersCommentsMiddleware = async (req, res, next) => {
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
        console.log(error);
        res.send(`
                <script>
                    alert("Bạn cần đăng nhập để dùng chức năng này!");
                    window.location.href="/product/${req.params.id}";
                </script>
            `)
    }
}