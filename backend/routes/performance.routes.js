const express = require("express");

const router = express.Router();

const {
    getTeamPerformance
}=require("../controllers/performance.controller");


const authenticate=require("../middleware/auth.middleware");

const authorize=require("../middleware/role.middleware");


router.get(

    "/team",

    authenticate,

    authorize("PROJECT_MANAGER"),

    getTeamPerformance

);


module.exports=router;