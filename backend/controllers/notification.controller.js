const prisma = require("../config/prisma");


// Get My Notifications

exports.getMyNotifications = async(req,res)=>{

    try{

        const userId = req.user.id;


        const notifications = await prisma.notification.findMany({

            where:{
                userId:userId
            },

            orderBy:{
                createdAt:"desc"
            }

        });


        res.json({

            notifications

        });


    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};



// Mark Notification As Read

exports.markAsRead = async(req,res)=>{

    try{

        const userId=req.user.id;

        const {notificationId}=req.params;


        const notification =
        await prisma.notification.findUnique({

            where:{
                id:Number(notificationId)
            }

        });


        if(!notification){

            return res.status(404).json({

                message:"Notification not found"

            });

        }


        if(notification.userId !== userId){

            return res.status(403).json({

                message:"Access denied"

            });

        }



        const updated =
        await prisma.notification.update({

            where:{
                id:Number(notificationId)
            },

            data:{
                isRead:true
            }

        });


        res.json({

            message:"Notification marked as read",

            notification:updated

        });


    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};