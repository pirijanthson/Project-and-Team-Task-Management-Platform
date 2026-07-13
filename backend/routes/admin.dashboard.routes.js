const express=require("express");

const router=express.Router();


const {
    getDashboardSummary
}=require("../controllers/admin.dashboard.controller");


const authenticate =
require("../middleware/auth.middleware");


const authorize =
require("../middleware/role.middleware");



router.get(

"/summary",

authenticate,

authorize("ADMIN"),

getDashboardSummary

);



module.exports=router;