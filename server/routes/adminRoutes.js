const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware");
const {admin} = require("../middleware/adminMiddleware")
const { 
    getUsers,
    approveUser,
    rejectUser
} = require("../controllers/adminController");

router.get("/users" , protect , admin , getUsers);
router.patch("/users/:id/approve" , protect , admin , approveUser)
router.patch("/users/:id/reject" , protect , admin , rejectUser);

module.exports = router;
