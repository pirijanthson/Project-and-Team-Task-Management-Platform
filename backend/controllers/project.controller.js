const prisma = require("../config/prisma");


// Generate Project Code

const generateProjectCode = () => {

    const random = Math.floor(
        1000 + Math.random() * 9000
    );

    return `PRJ-${random}`;

};



// Create Project

exports.createProject = async(req,res)=>{

    try{


        const {
            name,
            description,
            startDate,
            endDate,
            estimatedHours
        } = req.body;



        const projectCode = generateProjectCode();



        const project = await prisma.project.create({

            data:{

                projectCode,

                name,

                description,

                startDate:new Date(startDate),

                endDate:endDate 
                    ? new Date(endDate)
                    : null,

                estimatedHours,

                managerId:req.user.id

            }

        });



        // Notify Admin

        const admins = await prisma.user.findMany({

            where:{
                role:"ADMIN"
            }

        });



        await prisma.notification.createMany({

            data:admins.map(admin=>({

                title:"New Project Created",

                message:`${project.name} project created by ${req.user.fullName}`,

                userId:admin.id

            }))

        });



        res.status(201).json({

            message:"Project created successfully",

            project

        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });


    }

};

// Get Project Manager Own Projects

exports.getMyProjects = async(req,res)=>{

    try{

        const {search,status}=req.query;


        let filter={

            managerId:req.user.id,

            isDeleted:false

        };



        // Search

        if(search){

            filter.OR=[

                {
                    name:{
                        contains:search,
                        mode:"insensitive"
                    }
                },

                {
                    projectCode:{
                        contains:search,
                        mode:"insensitive"
                    }
                }

            ];

        }



        // Filter Status

        if(status){

            filter.status=status;

        }



        const projects = await prisma.project.findMany({

            where:filter,


            include:{


                members:{

                    include:{

                        user:{

                            select:{

                                id:true,

                                fullName:true,

                                email:true,

                                role:true

                            }

                        }

                    }

                },


                _count:{

                    select:{

                        tasks:true,

                        members:true

                    }

                }


            },


            orderBy:{

                createdAt:"desc"

            }


        });



        res.json({

            total:projects.length,

            projects

        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });


    }

};

// Get Team Members

exports.getTeamMembers = async(req,res)=>{

    try{


        const {search}=req.query;



        let filter={

            role:"TEAM_MEMBER",

            isActive:true

        };



        if(search){

            filter.OR=[

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



        const members = await prisma.user.findMany({

            where:filter,


            select:{

                id:true,

                fullName:true,

                email:true,

                role:true,


                projectMembers:{

                    select:{

                        projectId:true

                    }

                }

            },


            orderBy:{

                fullName:"asc"

            }

        });



        const result = members.map(member=>({

            id:member.id,

            fullName:member.fullName,

            email:member.email,

            role:member.role,

            assignedProjects:
                member.projectMembers.length

        }));



        res.json({

            total:result.length,

            members:result

        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });


    }

};

// Assign Team Members To Project

exports.assignMembers = async(req,res)=>{

    try{


        const {projectId}=req.params;


        const {memberIds}=req.body;



        // Check project belongs to manager

        const project = await prisma.project.findFirst({

            where:{

                id:Number(projectId),

                managerId:req.user.id,

                isDeleted:false

            }

        });



        if(!project){

            return res.status(404).json({

                message:"Project not found or access denied"

            });

        }



        const assignments=[];



        for(const userId of memberIds){


            // Check user

            const member = await prisma.user.findFirst({

                where:{

                    id:userId,

                    role:"TEAM_MEMBER",

                    isActive:true

                }

            });



            if(!member){

                continue;

            }



            // Check duplicate

            const existing = await prisma.projectMember.findFirst({

                where:{

                    projectId:Number(projectId),

                    userId:userId

                }

            });



            if(!existing){


                assignments.push({

                    projectId:Number(projectId),

                    userId:userId

                });



                // Notification

                await prisma.notification.create({

                    data:{

                        title:"Project Assignment",

                        message:`You have been assigned to ${project.name}`,

                        userId:userId

                    }

                });


            }

        }



        if(assignments.length > 0){

            await prisma.projectMember.createMany({

                data:assignments

            });

        }



        res.json({

            message:"Team members assigned successfully",

            assignedCount:assignments.length

        });



    }catch(error){


        res.status(500).json({

            message:error.message

        });


    }

};