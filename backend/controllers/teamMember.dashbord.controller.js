const prisma = require("../config/prisma");


// Team Member Dashboard Summary

exports.getDashboardSummary = async(req,res)=>{

    try{

        const memberId = req.user.id;



        // Assigned Projects Count

        const totalProjects = await prisma.projectMember.count({

            where:{

                userId:memberId

            }

        });



        // Get Assigned Tasks

        const tasks = await prisma.task.findMany({

            where:{

                assignedTo:memberId

            },

            select:{

                status:true,

                actualHours:true

            }

        });



        const totalTasks = tasks.length;



        const completedTasks = tasks.filter(

            task=>task.status==="COMPLETED"

        ).length;



        const activeTasks = tasks.filter(

            task=>task.status==="ACTIVE"

        ).length;



        const pendingTasks = tasks.filter(

            task=>task.status==="PENDING"

        ).length;



        // Total Worked Hours

        const totalHours = tasks.reduce(

            (sum,task)=>

            sum + (task.actualHours || 0),

            0

        );



        // Completion Percentage

        let completionRate = 0;


        if(totalTasks > 0){

            completionRate = Math.round(

                (completedTasks / totalTasks) * 100

            );

        }



        res.json({

            dashboard:"Team Member",


            summary:{


                totalProjects,


                totalTasks,


                completedTasks,


                activeTasks,


                pendingTasks,


                totalHours,


                completionRate:
                completionRate+"%"


            }


        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });


    }

};