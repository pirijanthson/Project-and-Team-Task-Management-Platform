const express = require("express");

const router = express.Router();


const {

getMyNotifications,

markAsRead

}=require("../controllers/notification.controller");


const authenticate =
require("../middleware/auth.middleware");



router.get(
    "/",
    authenticate,
    getMyNotifications
);



router.put(
    "/:notificationId/read",
    authenticate,
    markAsRead
);



module.exports = router;