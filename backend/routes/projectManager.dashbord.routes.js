const express = require("express");

const router = express.Router();


const {
    getDashboardSummary,
    getRecentActivities,
    getProjectProgress,
    getTeamPerformanceSummary,
    getTaskStatusAnalytics
}=require("../controllers/projectManager.dashbord.controller");


const authenticate =
require("../middleware/auth.middleware");


const authorize =
require("../middleware/role.middleware");



router.get(

    "/summary",

    authenticate,

    authorize("PROJECT_MANAGER"),

    getDashboardSummary

);

router.get(

    "/summary/activity",

    authenticate,

    authorize("PROJECT_MANAGER"),

    getRecentActivities

);

router.get(

    "/summary/projects-progress",

    authenticate,

    authorize("PROJECT_MANAGER"),

    getProjectProgress

);

router.get(

"/summary/team-performance",

authenticate,

authorize("PROJECT_MANAGER"),

getTeamPerformanceSummary

);

router.get(

"/summary/task-analytics",

authenticate,

authorize("PROJECT_MANAGER"),

getTaskStatusAnalytics

);



module.exports = router;