const express = require("express");

const router = express.Router();


const {
    getDashboard,
    getMyProjects,
    getMyTasks,
    updateTaskStatus,
    submitTask,
    submitFeedback
}=require("../controllers/team.controller");


const authenticate = require("../middleware/auth.middleware");

const authorize = require("../middleware/role.middleware");



router.get(
    "/dashboard",
    authenticate,
    authorize("TEAM_MEMBER"),
    getDashboard
);

router.get(
    "/projects",
    authenticate,
    authorize("TEAM_MEMBER"),
    getMyProjects
);

router.get(
    "/tasks",
    authenticate,
    authorize("TEAM_MEMBER"),
    getMyTasks
);

router.put(
    "/tasks/:taskId/status",
    authenticate,
    authorize("TEAM_MEMBER"),
    updateTaskStatus
);

router.post(
    "/tasks/:taskId/submit",
    authenticate,
    authorize("TEAM_MEMBER"),
    submitTask
);

router.post(
    "/tasks/:taskId/feedback",
    authenticate,
    authorize("TEAM_MEMBER"),
    submitFeedback
);



module.exports = router;