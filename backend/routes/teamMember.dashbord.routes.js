const express = require("express");

const router = express.Router();


const {

getDashboardSummary

}=require("../controllers/teamMember.dashbord.controller");


const authenticate =
require("../middleware/auth.middleware");


const authorize =
require("../middleware/role.middleware");



router.get(

"/summary",

authenticate,

authorize("TEAM_MEMBER"),

getDashboardSummary

);



module.exports = router;