const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/jwt");


exports.login = async(req,res)=>{

    try{

        const {email,password}=req.body;


        const user = await prisma.user.findUnique({
            where:{
                email:email
            }
        });


        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }


        const isPasswordValid =
        await bcrypt.compare(password,user.password);


        if(!isPasswordValid){

            return res.status(401).json({
                message:"Invalid password"
            });

        }


        const token = generateToken(user);

        await prisma.session.create({

            data:{

                token:token,

                userId:user.id,

                expiresAt:new Date(
                    Date.now() + 60 * 60 * 1000
                )

            }

        });


        res.json({

            message:"Login successful",

            token,

            user:{
                id:user.id,
                name:user.fullName,
                role:user.role
            }

        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

exports.logout = async(req,res)=>{

    try{

        const authHeader =
        req.headers.authorization;


        if(!authHeader){

            return res.status(401).json({

                message:"Token required"

            });

        }


        const token =
        authHeader.split(" ")[1];


        await prisma.session.deleteMany({

            where:{
                token:token
            }

        });


        res.json({

            message:"Logout successful"

        });


    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};