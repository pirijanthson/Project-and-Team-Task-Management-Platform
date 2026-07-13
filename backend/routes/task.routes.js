const express = require("express");

const router = express.Router();

const { 
    createTask,
    getProjectTasks,
    updateTask,
    deleteTask
 } = require("../controllers/task.controller");

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

router.post(
    "/projects/:projectId/tasks",
    authenticate,
    authorize("PROJECT_MANAGER"),
    createTask
);

router.get(
    "/projects/:projectId/tasks",
    authenticate,
    authorize("PROJECT_MANAGER"),
    getProjectTasks
);

router.put(
    "/tasks/:taskId",
    authenticate,
    authorize("PROJECT_MANAGER"),
    updateTask
);

router.delete(
    "/tasks/:taskId",
    authenticate,
    authorize("PROJECT_MANAGER"),
    deleteTask
);

module.exports = router;