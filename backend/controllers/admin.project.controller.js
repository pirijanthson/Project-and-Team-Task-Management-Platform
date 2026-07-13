const prisma = require("../config/prisma");


// Get All Projects (Admin)

exports.getAllProjects = async(req,res)=>{

    try{

        const {
            search,
            status
        } = req.query;


        let where={};



        // Search Project

        if(search){

            where.OR=[

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

            where.status=status;

        }



        const projects =
        await prisma.project.findMany({

            where,


            include:{


                manager:{

                    select:{

                        id:true,

                        fullName:true,

                        email:true

                    }

                },


                members:{

                    include:{

                        user:{

                            select:{

                                id:true,

                                fullName:true,

                                email:true

                            }

                        }

                    }

                },


                tasks:true

            },


            orderBy:{

                createdAt:"desc"

            }


        });



        res.json({

            total:projects.length,

            projects

        });



    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};

exports.updateProject = async(req,res)=>{

    try{


        const {id}=req.params;


        const {

            name,

            description,

            status,

            startDate,

            endDate,

            estimatedHours

        }=req.body;



        const project =
        await prisma.project.update({

            where:{

                id:Number(id)

            },


            data:{

                name,

                description,

                status,

                startDate:new Date(startDate),

                endDate:endDate
                ?
                new Date(endDate)
                :
                null,

                estimatedHours

            }

        });



        res.json({

            message:"Project updated successfully",

            project

        });



    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};

exports.deleteProject = async(req,res)=>{

    try{

        const {id}=req.params;


        await prisma.project.delete({

            where:{

                id:Number(id)

            }

        });


        res.json({

            message:
            "Project deleted successfully"

        });



    }
    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};