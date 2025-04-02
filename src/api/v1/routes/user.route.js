const express = require("express");
const router = express.Router();

const controller = require("../controllers/user.controller");
const authenticateToken = require("../../../middlewares/authenticate");
const upload = require("../../../middlewares/multer");

router.get("/auth/check-token", authenticateToken, controller.checkToken);
router.get("/auth/refresh-token", authenticateToken, controller.releaseAccessToken);
router.get("/auth/google", controller.authenticateGoogle);
router.get("/auth/google/callback", controller.googleCallback);
router.get("/login-success/:token/:email/:avatar", controller.handleLoginSuccess);
router.get("/profile", authenticateToken, controller.getUserProfile);
router.patch("/profile/edit", authenticateToken, controller.editUserProfile);
router.post("/auth/register", upload.single("avatar"), controller.userRegister);
router.post("/auth/login", controller.userLogin);
router.get("/auth/logout", authenticateToken, controller.userLogout);
router.post("/contact/send", controller.handleFeedback);
router.post("/forgot-password/send-mail", controller.handleForgotPassword);
router.post("/forgot-password/confirm-code", controller.userConfirm);
router.patch("/forgot-password/new-password", controller.resetPassword);
router.get("/history", authenticateToken, controller.getHistory);
router.post("/history/update", authenticateToken, controller.updateHistory);

module.exports = router;
