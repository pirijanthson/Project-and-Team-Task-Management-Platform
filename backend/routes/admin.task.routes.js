const express=require("express");

const router=express.Router();


const {

getAllTasks,

updateTask,

deleteTask

}=require("../controllers/admin.task.controller");


const authenticate =
require("../middleware/auth.middleware");


const authorize =
require("../middleware/role.middleware");



router.get(
"/",
authenticate,
authorize("ADMIN"),
getAllTasks
);



router.put(
"/:id",
authenticate,
authorize("ADMIN"),
updateTask
);



router.delete(
"/:id",
authenticate,
authorize("ADMIN"),
deleteTask
);



module.exports=router;