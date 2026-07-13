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