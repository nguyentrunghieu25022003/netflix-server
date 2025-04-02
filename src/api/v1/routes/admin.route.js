const express = require("express");
const router = express.Router();

const controller = require("../controllers/admin.controller");
const authenticateToken = require("../../../middlewares/authenticate");
const checkRole = require("../../../middlewares/role");

router.get("/dashboard", authenticateToken, checkRole, controller.getDashboard);
router.post("/create-movie", authenticateToken, checkRole, controller.addMovie);
router.delete("/delete/:movieId", authenticateToken, checkRole, controller.deleteMovie);
router.get("/edit/:movieId", authenticateToken, checkRole, controller.editMoviePage);
router.put("/edit/:movieId/upload", controller.handleEditMovie);
router.get("/users", controller.getUsers);
router.patch("/users/lock", controller.lockUser);
router.patch("/users/unlock", authenticateToken, checkRole, controller.unlockUser);
router.post("/report/send",authenticateToken, checkRole, controller.receiveReport);
router.get("/all-report",authenticateToken, checkRole, controller.getAllReport);

module.exports = router;