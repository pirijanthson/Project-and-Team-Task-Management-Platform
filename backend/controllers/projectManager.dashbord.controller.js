const prisma = require("../config/prisma");


// Project Manager Dashboard Summary

exports.getDashboardSummary = async(req,res)=>{

    try{

        const managerId = req.user.id;


        // Total Projects

        const totalProjects = await prisma.project.count({

            where:{
                managerId:managerId,
                isDeleted:false
            }

        });



        // Active Projects

        const activeProjects = await prisma.project.count({

            where:{

                managerId:managerId,

                status:"ACTIVE",

                isDeleted:false

            }

        });



        // Completed Projects

        const completedProjects = await prisma.project.count({

            where:{

                managerId:managerId,

                status:"COMPLETED",

                isDeleted:false

            }

        });



        // Get Manager Projects

        const projects = await prisma.project.findMany({

            where:{

                managerId:managerId,

                isDeleted:false

            },

            select:{

                id:true

            }

        });


        const projectIds = projects.map(
            project=>project.id
        );



        // Total Tasks

        const totalTasks = await prisma.task.count({

            where:{

                projectId:{
                    in:projectIds
                }

            }

        });



        // Completed Tasks

        const completedTasks = await prisma.task.count({

            where:{

                projectId:{
                    in:projectIds
                },

                status:"COMPLETED"

            }

        });



        // Pending Tasks

        const pendingTasks = await prisma.task.count({

            where:{

                projectId:{
                    in:projectIds
                },

                status:"PENDING"

            }

        });



        // Team Members

        const totalTeamMembers = await prisma.projectMember.count({

            where:{

                project:{
                    
                    managerId:managerId

                }

            }

        });



        // Task Completion Rate

        let completionRate = 0;


        if(totalTasks > 0){

            completionRate = Math.round(

                (completedTasks / totalTasks) * 100

            );

        }



        res.json({

            dashboard:"Project Manager",


            summary:{


                totalProjects,

                activeProjects,

                completedProjects,


                totalTeamMembers,


                totalTasks,

                completedTasks,

                pendingTasks,


                taskCompletionRate:
                completionRate+"%"


            }


        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });


    }

};

// Project Manager Recent Activities

exports.getRecentActivities = async(req,res)=>{

    try{

        const managerId = req.user.id;


        // Manager Projects

        const projects = await prisma.project.findMany({

            where:{

                managerId:managerId,

                isDeleted:false

            },

            select:{

                id:true,

                name:true,

                createdAt:true

            },

            orderBy:{

                createdAt:"desc"

            },

            take:5

        });



        const projectIds = projects.map(
            project=>project.id
        );



        // Recent Tasks

        const tasks = await prisma.task.findMany({

            where:{

                projectId:{
                    in:projectIds
                }

            },

            select:{

                id:true,

                title:true,

                status:true,

                createdAt:true,


                project:{

                    select:{

                        name:true

                    }

                }

            },

            orderBy:{

                createdAt:"desc"

            },

            take:5

        });



        // Recent Member Assignments

        const members = await prisma.projectMember.findMany({

            where:{

                projectId:{
                    in:projectIds
                }

            },


            select:{

                joinedAt:true,


                user:{

                    select:{

                        fullName:true

                    }

                },


                project:{

                    select:{

                        name:true

                    }

                }

            },


            orderBy:{

                joinedAt:"desc"

            },


            take:5


        });



        res.json({

            activities:{


                projects,

                tasks,

                members


            }

        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });


    }

};

// Project Progress Overview

exports.getProjectProgress = async(req,res)=>{

    try{

        const managerId = req.user.id;


        const projects = await prisma.project.findMany({

            where:{

                managerId:managerId,

                isDeleted:false

            },


            select:{

                id:true,

                name:true,

                projectCode:true,


                tasks:{

                    select:{

                        id:true,

                        status:true

                    }

                }

            },


            orderBy:{

                createdAt:"desc"

            }

        });



        const progress = projects.map(project=>{


            const totalTasks = project.tasks.length;


            const completedTasks = project.tasks.filter(

                task=>task.status==="COMPLETED"

            ).length;



            const pendingTasks = project.tasks.filter(

                task=>task.status==="PENDING"

            ).length;



            const percentage = totalTasks === 0

            ? 0

            :

            Math.round(

                (completedTasks / totalTasks) * 100

            );



            return {


                projectId:project.id,

                projectName:project.name,

                projectCode:project.projectCode,


                totalTasks,


                completedTasks,


                pendingTasks,


                progress:
                percentage+"%"


            };


        });



        res.json({

            totalProjects:progress.length,

            projects:progress

        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });


    }

};

// Team Member Performance Summary

exports.getTeamPerformanceSummary = async(req,res)=>{

    try{

        const managerId = req.user.id;


        // Get manager projects

        const projects = await prisma.project.findMany({

            where:{

                managerId:managerId,

                isDeleted:false

            },

            select:{

                id:true

            }

        });


        const projectIds = projects.map(
            project=>project.id
        );



        // Get assigned members only

        const members = await prisma.projectMember.findMany({

            where:{

                projectId:{

                    in:projectIds

                }

            },


            select:{

                user:{

                    select:{

                        id:true,

                        fullName:true,

                        email:true,


                        assignedTasks:{

                            where:{

                                projectId:{

                                    in:projectIds

                                }

                            },


                            select:{

                                status:true,

                                actualHours:true

                            }

                        }

                    }

                }

            },


            distinct:["userId"]

        });



        const performance = members.map(item=>{


            const member = item.user;


            const tasks = member.assignedTasks;


            const totalTasks = tasks.length;


            const completedTasks = tasks.filter(

                task=>task.status==="COMPLETED"

            ).length;



            const pendingTasks = tasks.filter(

                task=>task.status==="PENDING"

            ).length;



            const totalHours = tasks.reduce(

                (sum,task)=>

                sum + (task.actualHours || 0),

                0

            );



            const completionRate = totalTasks===0

            ?0

            :

            Math.round(

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


                completionRate:
                completionRate+"%"


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

// Task Status Analytics

// Task Status Analytics

exports.getTaskStatusAnalytics = async(req,res)=>{

    try{

        const managerId = req.user.id;


        // Get Manager Projects

        const projects = await prisma.project.findMany({

            where:{

                managerId: managerId,

                isDeleted:false

            },

            select:{

                id:true

            }

        });


        const projectIds = projects.map(
            project => project.id
        );



        // Pending Tasks

        const pending = await prisma.task.count({

            where:{

                projectId:{
                    in:projectIds
                },

                status:"PENDING"

            }

        });



        // Active Tasks

        const active = await prisma.task.count({

            where:{

                projectId:{
                    in:projectIds
                },

                status:"ACTIVE"

            }

        });



        // Completed Tasks

        const completed = await prisma.task.count({

            where:{

                projectId:{
                    in:projectIds
                },

                status:"COMPLETED"

            }

        });



        res.json({

            analytics:{

                pending,

                active,

                completed,

                total:
                pending + active + completed

            }

        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });


    }

};