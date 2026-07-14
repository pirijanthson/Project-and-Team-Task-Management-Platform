const prisma = require("../config/prisma");


// Team Member Performance Analysis

exports.getTeamPerformance = async(req,res)=>{

    try{


        const managerId = req.user.id;


        // Get only manager assigned members

        const members = await prisma.user.findMany({

            where:{

                role:"TEAM_MEMBER",

                managerId:managerId

            },


            select:{

                id:true,

                fullName:true,

                email:true,


                assignedTasks:{

                    select:{

                        id:true,

                        status:true,

                        actualHours:true,

                        estimatedHours:true

                    }

                }

            }


        });



        const performance = members.map(member=>{


            const tasks = member.assignedTasks;


            const totalTasks = tasks.length;


            const completedTasks = tasks.filter(

                task=>task.status==="COMPLETED"

            ).length;


            const pendingTasks = tasks.filter(

                task=>task.status==="PENDING"

            ).length;



            const totalHours = tasks.reduce(

                (sum,task)=>sum+(task.actualHours || 0),

                0

            );



            const completionRate = totalTasks === 0

                ? 0

                : Math.round(

                    (completedTasks / totalTasks) * 100

                );



            return {


                memberId:member.id,

                name:member.fullName,

                email:member.email,


                totalTasks,

                completedTasks,

                pendingTasks,

                totalHours,

                completionRate:`${completionRate}%`


            };


        });



        res.json({

            totalMembers:performance.length,

            performance

        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });


    }

};