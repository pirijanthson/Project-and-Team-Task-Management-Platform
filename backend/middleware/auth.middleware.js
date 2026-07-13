const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");


const authMiddleware = async(req,res,next)=>{

    try{


        const authHeader =
        req.headers.authorization;


        if(!authHeader){

            return res.status(401).json({

                message:"Authorization token required"

            });

        }


        const token =
        authHeader.split(" ")[1];


        if(!token){

            return res.status(401).json({

                message:"Invalid token format"

            });

        }



        // Verify JWT

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );



        // Check active session

        const session =
        await prisma.session.findUnique({

            where:{
                token:token
            }

        });



        if(!session){

            return res.status(401).json({

                message:"Session expired or logged out"

            });

        }



        // Check session expiry

        if(
            new Date() > session.expiresAt
        ){

            await prisma.session.delete({

                where:{
                    id:session.id
                }

            });


            return res.status(401).json({

                message:"Session expired"

            });

        }



        // Attach user

        req.user = decoded;


        next();


    }
    catch(error){


        return res.status(401).json({

            message:"Invalid or expired token"

        });


    }

};



module.exports = authMiddleware;