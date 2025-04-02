const express = require("express");
const router = express.Router();

const controller = require("../controllers/movie.controller");
const authenticateToken = require("../../../middlewares/authenticate");

router.get("/", authenticateToken, controller.getAllMovies);
router.get("/search-results", controller.handleSearchResult);
router.get("/search-films", authenticateToken, controller.searchFilms);
router.get("/thumbnail", controller.getAllThumbnails);
router.get("/categories", controller.getAllCategories);
router.get("/countries", controller.getAllCountries);
router.get("/series", authenticateToken, controller.getAllSeries);
router.get("/feature-films",authenticateToken, controller.getAllFeatureFilms);
router.get("/tv-shows", authenticateToken, controller.getAllTVShows);
router.get("/animated", authenticateToken, controller.getAllAnimatedMovies);
router.get("/my-list", authenticateToken, controller.getAllMyList);
router.post("/my-list/add/:slug", authenticateToken, controller.addMovieToMyList);
router.delete("/my-list/delete", authenticateToken, controller.removeFromMyList);
router.get("/detail/:slug", authenticateToken, controller.getMovieDetailsWithComments);
router.post("/detail/:slug/comment/create", controller.createComment);
router.patch("/detail/:slug/status-video", controller.handleStatusVideo);
router.delete("/detail/:slug/comment/:commentId", controller.removeComment);
router.get("/ranking", controller.getRanking);
router.get("/notifications", authenticateToken, controller.getNotifications);
router.post("/notifications/read", authenticateToken, controller.handleNotifications);

module.exports = router;