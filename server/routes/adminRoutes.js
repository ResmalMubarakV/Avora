const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware");
const {admin} = require("../middleware/adminMiddleware")
const { 
    getUsers,
    approveUser,
    suspendUser,
} = require("../controllers/adminController");

router.get("/users" , protect , admin , getUsers);
router.patch("/users/:id/approve" , protect , admin , approveUser)
router.patch("/users/:id/suspend" , protect , admin , suspendUser);

module.exports = router;
