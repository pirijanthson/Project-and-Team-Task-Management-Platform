const prisma = require("../config/prisma");


// Team Member Dashboard

exports.getDashboard = async (req, res) => {

    try {

        const userId = req.user.id;


        // Count projects

        const projectCount = await prisma.projectMember.count({

            where: {

                userId: userId

            }

        });


        // Count all tasks

        const totalTasks = await prisma.task.count({

            where: {

                assignedTo: userId,

                isDeleted: false

            }

        });


        // Pending tasks

        const pendingTasks = await prisma.task.count({

            where: {

                assignedTo: userId,

                status: "PENDING",

                isDeleted: false

            }

        });


        // Active tasks

        const activeTasks = await prisma.task.count({

            where: {

                assignedTo: userId,

                status: "ACTIVE",

                isDeleted: false

            }

        });


        // Completed tasks

        const completedTasks = await prisma.task.count({

            where: {

                assignedTo: userId,

                status: "COMPLETED",

                isDeleted: false

            }

        });



        res.json({

            projects: projectCount,

            tasks: totalTasks,

            pendingTasks,

            activeTasks,

            completedTasks

        });



    } catch(error) {


        res.status(500).json({

            message:error.message

        });


    }

};

// View Assigned Projects

exports.getMyProjects = async (req, res) => {

    try {

        const userId = req.user.id;


        const projects = await prisma.projectMember.findMany({

            where: {

                userId: userId

            },

            include: {

                project: {

                    include: {

                        manager: {

                            select: {

                                id: true,
                                fullName: true,
                                email: true

                            }

                        }

                    }

                }

            }

        });


        const result = projects.map((item)=>({

            projectId: item.project.id,

            projectCode: item.project.projectCode,

            name: item.project.name,

            description: item.project.description,

            status: item.project.status,

            startDate: item.project.startDate,

            endDate: item.project.endDate,

            estimatedHours: item.project.estimatedHours,

            manager: item.project.manager,

            joinedAt: item.joinedAt

        }));


        res.json({

            projects: result

        });


    } catch(error) {


        res.status(500).json({

            message:error.message

        });


    }

};

// View My Assigned Tasks

exports.getMyTasks = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            search,
            status
        } = req.query;


        let where = {

            assignedTo: userId,

            isDeleted: false

        };


        // Search task

        if(search){

            where.title = {

                contains: search,

                mode: "insensitive"

            };

        }


        // Filter status

        if(status){

            where.status = status;

        }


        const tasks = await prisma.task.findMany({

            where,

            include: {

                project: {

                    select: {

                        id:true,

                        projectCode:true,

                        name:true,

                        status:true

                    }

                }

            },

            orderBy: {

                createdAt:"desc"

            }

        });


        res.json({

            tasks

        });



    } catch(error){


        res.status(500).json({

            message:error.message

        });


    }

};

// Update Task Status

exports.updateTaskStatus = async (req, res) => {

    try {

        const userId = req.user.id;

        const { taskId } = req.params;

        const { status } = req.body;


        // Find task

        const task = await prisma.task.findUnique({

            where: {

                id: Number(taskId)

            }

        });


        if(!task){

            return res.status(404).json({

                message:"Task not found"

            });

        }


        // Check ownership

        if(task.assignedTo !== userId){

            return res.status(403).json({

                message:"You can update only your assigned tasks"

            });

        }



        // Status flow validation

        const allowedFlow = {

            PENDING:"ACTIVE",

            ACTIVE:"COMPLETED"

        };


        if(allowedFlow[task.status] !== status){

            return res.status(400).json({

                message:
                `Invalid status change. Current status ${task.status} can only move to ${allowedFlow[task.status]}`

            });

        }



        const updatedTask = await prisma.task.update({

            where:{

                id:Number(taskId)

            },

            data:{

                status:status

            }

        });



        res.json({

            message:"Task status updated successfully",

            task:updatedTask

        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });


    }

};

// Submit Completed Task

exports.submitTask = async(req,res)=>{

    try{

        const userId = req.user.id;

        const {taskId}=req.params;


        const task = await prisma.task.findUnique({

            where:{
                id:Number(taskId)
            },

            include:{
                project:true
            }

        });



        if(!task){

            return res.status(404).json({

                message:"Task not found"

            });

        }



        if(task.assignedTo !== userId){

            return res.status(403).json({

                message:"You can submit only your tasks"

            });

        }



        if(task.status !== "COMPLETED"){

            return res.status(400).json({

                message:
                "Only completed tasks can be submitted"

            });

        }



        const updatedTask = await prisma.task.update({

            where:{
                id:Number(taskId)
            },

            data:{

                completedAt:new Date(),

                submittedAt:new Date()

            }

        });



        // Create notification for manager

        await prisma.notification.create({

            data:{

                title:"Task Submitted",

                message:
                `${task.memberId} completed task ${task.title}`,

                userId:task.project.managerId

            }

        });



        res.json({

            message:
            "Task submitted successfully",

            task:updatedTask

        });



    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};

exports.submitFeedback = async(req,res)=>{

    try{

        const userId = req.user.id;

        const {taskId}=req.params;

        const {message}=req.body;


        const task = await prisma.task.findUnique({

            where:{
                id:Number(taskId)
            },

            include:{
                project:true
            }

        });


        if(!task){

            return res.status(404).json({

                message:"Task not found"

            });

        }


        if(task.assignedTo !== userId){

            return res.status(403).json({

                message:"You can only feedback your tasks"

            });

        }


        if(task.submittedAt === null){

            return res.status(400).json({

                message:
                "Submit task before giving feedback"

            });

        }


        const feedback = await prisma.feedback.create({

            data:{

                message,

                taskId:Number(taskId)

            }

        });



        // Notify Project Manager

        await prisma.notification.create({

            data:{

                title:"Task Feedback Submitted",

                message:
                `Feedback submitted for task ${task.title}`,

                userId:task.project.managerId

            }

        });


        // Notify Admins

        const admins = await prisma.user.findMany({

            where:{
                role:"ADMIN"
            }

        });


        for(const admin of admins){

            await prisma.notification.create({

                data:{

                    title:"Task Feedback Submitted",

                    message:
                    `Feedback submitted for task ${task.title}`,

                    userId:admin.id

                }

            });

        }


        res.json({

            message:"Feedback submitted successfully",

            feedback

        });



    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};