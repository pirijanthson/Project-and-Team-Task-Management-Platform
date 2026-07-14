const express = require("express");

const router = express.Router();


const {
    createUser,
    getAllUsers,
    updateUser,
    deleteUser,
    getUserPerformance,
    assignManager
}=require("../controllers/admin.controller");


const authenticate = require("../middleware/auth.middleware");

const authorize = require("../middleware/role.middleware");



// Create User

router.post(
    "/users",
    authenticate,
    authorize("ADMIN"),
    createUser
);

router.get(
    "/users",
    authenticate,
    authorize("ADMIN"),
    getAllUsers
);

router.put(
 "/users/:email",
 authenticate,
 authorize("ADMIN"),
 updateUser
);

router.delete(
    "/users/:email",
    authenticate,
    authorize("ADMIN"),
    deleteUser
);

router.get(
    "/users/performance",
    authenticate,
    authorize("ADMIN"),
    getUserPerformance
);

router.put(
    "/assign-manager",
    authenticate,
    authorize("ADMIN"),
    assignManager
);



module.exports = router;