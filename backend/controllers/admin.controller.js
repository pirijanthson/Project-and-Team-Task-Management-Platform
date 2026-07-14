const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");


// Admin Create User

exports.createUser = async(req,res)=>{

    try{

        const {
            fullName,
            email,
            password,
            role
        } = req.body;

        // Role Validation

        const allowedRoles = [
            "PROJECT_MANAGER",
            "TEAM_MEMBER"
        ];


        if(!allowedRoles.includes(role)){

            return res.status(400).json({

                message:
                "Invalid role. Only PROJECT_MANAGER or TEAM_MEMBER allowed"

            });

        }


        // Check existing user

        const existingUser = await prisma.user.findUnique({
            where:{
                email:email
            }
        });


        if(existingUser){

            return res.status(400).json({
                message:"Email already exists"
            });

        }


        // Password Hash

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        const user = await prisma.user.create({

            data:{

                fullName,

                email,

                password:hashedPassword,

                role

            }

        });


        res.status(201).json({

            message:"User created successfully",

            user:{
                id:user.id,
                fullName:user.fullName,
                email:user.email,
                role:user.role
            }

        });


    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

// Get All Users

exports.getAllUsers = async(req,res)=>{

    try{

        const {search, role} = req.query;


        let filter = {};


        // Search by name or email

        if(search){

            filter.OR = [

                {
                    fullName:{
                        contains:search,
                        mode:"insensitive"
                    }
                },

                {
                    email:{
                        contains:search,
                        mode:"insensitive"
                    }
                }

            ];

        }


        // Filter by role

        if(role){

            filter.role = role;

        }



        const users = await prisma.user.findMany({

            where:filter,


            select:{

                id:true,

                fullName:true,

                email:true,

                role:true,

                createdAt:true

            },


            orderBy:{
                createdAt:"desc"
            }

        });



        res.json({

            total:users.length,

            users

        });



    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

// Update User

exports.updateUser = async(req,res)=>{

    try{

        const {email} = req.params;


        const {
            fullName,
            newEmail,
            password,
            role
        } = req.body;



        // Find user by email

        const existingUser = await prisma.user.findUnique({

            where:{
                email:email
            }

        });



        if(!existingUser){

            return res.status(404).json({

                message:"User not found"

            });

        }



        // Check new email duplicate

        if(newEmail && newEmail !== existingUser.email){


            const emailExists = await prisma.user.findUnique({

                where:{
                    email:newEmail
                }

            });


            if(emailExists){

                return res.status(400).json({

                    message:"Email already exists"

                });

            }

        }



        let updateData = {};



        if(fullName){

            updateData.fullName = fullName;

        }



        if(newEmail){

            updateData.email = newEmail;

        }



        if(role){

            updateData.role = role;

        }



        if(password){

            updateData.password = await bcrypt.hash(
                password,
                10
            );

        }



        const updatedUser = await prisma.user.update({

            where:{
                email:email
            },


            data:updateData

        });



        res.json({

            message:"User updated successfully",

            user:{

                fullName:updatedUser.fullName,

                email:updatedUser.email,

                role:updatedUser.role

            }

        });



    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};

// Delete User By Email

exports.deleteUser = async(req,res)=>{

    try{

        const {email}=req.params;


        // Find user

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



        // Prevent deleting own admin account

        if(user.id === req.user.id){

            return res.status(400).json({

                message:"You cannot delete your own account"

            });

        }



        await prisma.user.delete({

            where:{
                email:email
            }

        });



        res.json({

            message:"User deleted successfully"

        });



    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};

// User Performance Analysis

exports.getUserPerformance = async(req,res)=>{

    try{


        const users = await prisma.user.findMany({

            where:{

                role:{

                    in:[
                        "TEAM_MEMBER",
                        "PROJECT_MANAGER"
                    ]

                }

            },


            select:{

                id:true,

                fullName:true,

                email:true,

                role:true,


                assignedTasks:{

                    select:{

                        status:true,

                        submittedAt:true

                    }

                },


                createdProjects:{

                    select:{

                        status:true

                    }

                }

            }

        });



        const performance = users.map(user=>{


            // Team Member

            if(user.role==="TEAM_MEMBER"){


                const totalTasks =
                user.assignedTasks.length;


                const completedTasks =
                user.assignedTasks.filter(
                    task=>task.status==="COMPLETED"
                ).length;


                const activeTasks =
                user.assignedTasks.filter(
                    task=>task.status==="ACTIVE"
                ).length;


                const pendingTasks =
                user.assignedTasks.filter(
                    task=>task.status==="PENDING"
                ).length;


                const submittedTasks =
                user.assignedTasks.filter(
                    task=>task.submittedAt !== null
                ).length;



                return {

                    id:user.id,

                    name:user.fullName,

                    email:user.email,

                    role:user.role,

                    totalTasks,

                    completedTasks,

                    activeTasks,

                    pendingTasks,

                    submittedTasks,


                    completionRate:
                    totalTasks === 0
                    ? "0%"
                    :
                    `${Math.round(
                    (completedTasks/totalTasks)*100
                    )}%`

                };


            }



            // Project Manager

            if(user.role==="PROJECT_MANAGER"){


                const totalProjects =
                user.createdProjects.length;


                const activeProjects =
                user.createdProjects.filter(

                    project=>
                    project.status==="ACTIVE"

                ).length;



                const completedProjects =
                user.createdProjects.filter(

                    project=>
                    project.status==="COMPLETED"

                ).length;



                return {

                    id:user.id,

                    name:user.fullName,

                    email:user.email,

                    role:user.role,

                    totalProjects,

                    activeProjects,

                    completedProjects

                };

            }


        });



        res.json({

            performance

        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });


    }

};

// Assign Team Member to Project Manager

exports.assignManager = async (req, res) => {

    try {

        const { teamMemberId, managerId } = req.body;

        // Check Project Manager

        const manager = await prisma.user.findFirst({

            where: {

                id: managerId,

                role: "PROJECT_MANAGER"

            }

        });

        if (!manager) {

            return res.status(404).json({

                message: "Project Manager not found"

            });

        }

        // Check Team Member

        const member = await prisma.user.findFirst({

            where: {

                id: teamMemberId,

                role: "TEAM_MEMBER"

            }

        });

        if (!member) {

            return res.status(404).json({

                message: "Team Member not found"

            });

        }

        // Assign Manager

        await prisma.user.update({

            where: {

                id: teamMemberId

            },

            data: {

                managerId: managerId

            }

        });

        res.json({

            message: "Team Member assigned successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};