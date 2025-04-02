const helloRouter = require("./hello.route");
const movieRouter = require("./movie.route");
const userRouter = require("./user.route");
const adminRouter = require("./admin.route");

module.exports = async (app) => {
    app.use("/", helloRouter);
    app.use("/api/movies", movieRouter);
    app.use("/api/users", userRouter);
    app.use("/api/admin", adminRouter);
};