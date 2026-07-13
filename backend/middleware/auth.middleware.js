const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");


const authenticate = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;


        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization token required"
            });
        }


        const token = authHeader.split(" ")[1];


        if (!token) {
            return res.status(401).json({
                message: "Invalid token format"
            });
        }


        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        });


        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        req.user = user;


        next();


    } catch(error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }

};


module.exports = authenticate;