const express = require("express");

const router = express.Router();


const {
    createProject,
    getMyProjects,
    getMyAssignedMembers,
    assignMembers
}=require("../controllers/project.controller");


const authenticate = require("../middleware/auth.middleware");

const authorize = require("../middleware/role.middleware");



// Create Project

router.post(
    "/",
    authenticate,
    authorize("PROJECT_MANAGER"),
    createProject
);

router.get(
    "/my-projects",
    authenticate,
    authorize("PROJECT_MANAGER"),
    getMyProjects
);

router.get(
    "/team-members",
    authenticate,
    authorize("PROJECT_MANAGER"),
    getMyAssignedMembers
);

router.post(
    "/:projectId/members",
    authenticate,
    authorize("PROJECT_MANAGER"),
    assignMembers
);



module.exports = router;