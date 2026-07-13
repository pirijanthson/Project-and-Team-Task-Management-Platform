const prisma = require("../config/prisma");


// Admin Dashboard Summary

exports.getDashboardSummary = async(req,res)=>{

    try{


        // User Count

        const totalUsers =
        await prisma.user.count();



        const totalManagers =
        await prisma.user.count({

            where:{
                role:"PROJECT_MANAGER"
            }

        });



        const totalMembers =
        await prisma.user.count({

            where:{
                role:"TEAM_MEMBER"
            }

        });



        // Project Count

        const totalProjects =
        await prisma.project.count();



        const activeProjects =
        await prisma.project.count({

            where:{
                status:"ACTIVE"
            }

        });



        const completedProjects =
        await prisma.project.count({

            where:{
                status:"COMPLETED"
            }

        });



        // Task Count

        const totalTasks =
        await prisma.task.count();



        const completedTasks =
        await prisma.task.count({

            where:{
                status:"COMPLETED"
            }

        });



        const activeTasks =
        await prisma.task.count({

            where:{
                status:"ACTIVE"
            }

        });



        const pendingTasks =
        await prisma.task.count({

            where:{
                status:"PENDING"
            }

        });



        res.json({

            users:{

                total:totalUsers,

                projectManagers:totalManagers,

                teamMembers:totalMembers

            },


            projects:{

                total:totalProjects,

                active:activeProjects,

                completed:completedProjects

            },


            tasks:{

                total:totalTasks,

                completed:completedTasks,

                active:activeTasks,

                pending:pendingTasks

            }


        });



    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};