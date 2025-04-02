const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const http = require("http");
const path = require("path");
require("dotenv").config();
require("./middlewares/passport-google");
const app = express();
const port = 3000;
const server = http.createServer(app);
const database = require("../config/connect");
const router = require("./api/v1/routes/index.route");
const corsHelper = require("./helper/cors");
const initSocket = require("./middlewares/socket");
const io = initSocket(server);
const corsOptions = {
  origin: corsHelper.options,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
};
const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    path: "/",
  },
};
database.connect();
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
app.set("socketio", io);
router(app);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});