const prisma = require("../config/prisma");


// Get All Tasks

exports.getAllTasks = async(req,res)=>{

    try{


        const {
            search,
            status,
            projectId,
            assignedTo
        } = req.query;



        let where={};



        // Search task title

        if(search){

            where.title={

                contains:search,

                mode:"insensitive"

            };

        }



        // Filter status

        if(status){

            where.status=status;

        }



        // Filter project

        if(projectId){

            where.projectId=Number(projectId);

        }



        // Filter member

        if(assignedTo){

            where.assignedTo=Number(assignedTo);

        }



        const tasks =
        await prisma.task.findMany({

            where,


            include:{


                project:{

                    select:{

                        id:true,

                        name:true,

                        projectCode:true

                    }

                },


                member:{

                    select:{

                        id:true,

                        fullName:true,

                        email:true

                    }

                },


                feedback:true

            },


            orderBy:{

                createdAt:"desc"

            }

        });



        res.json({

            total:tasks.length,

            tasks

        });



    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};

exports.updateTask = async(req,res)=>{

    try{


        const {id}=req.params;


        const {

            title,

            description,

            estimatedHours,

            assignedTo,

            status

        }=req.body;



        const task =
        await prisma.task.update({

            where:{

                id:Number(id)

            },


            data:{


                title,

                description,

                estimatedHours,

                assignedTo:Number(assignedTo),

                status


            }

        });



        res.json({

            message:
            "Task updated successfully",

            task

        });



    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};

exports.deleteTask = async(req,res)=>{

    try{


        const {id}=req.params;


        await prisma.task.delete({

            where:{

                id:Number(id)

            }

        });



        res.json({

            message:
            "Task deleted successfully"

        });


    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};