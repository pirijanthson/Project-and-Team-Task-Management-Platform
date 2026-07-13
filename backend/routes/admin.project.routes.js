const express=require("express");

const router=express.Router();


const {

getAllProjects,

updateProject,

deleteProject

}=require("../controllers/admin.project.controller");


const authenticate =
require("../middleware/auth.middleware");


const authorize =
require("../middleware/role.middleware");



router.get(
"/",
authenticate,
authorize("ADMIN"),
getAllProjects
);



router.put(
"/:id",
authenticate,
authorize("ADMIN"),
updateProject
);



router.delete(
"/:id",
authenticate,
authorize("ADMIN"),
deleteProject
);



module.exports=router;