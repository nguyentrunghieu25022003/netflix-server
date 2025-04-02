const bcrypt = require("bcryptjs");
const User = require("../../../models/user.model");
const MainModel = require("../../../models/movie.model");
const Blacklisting = require("../../../models/blacklist.model");
const ConfirmCode = require("../../../models/confirm-code.model");
const Feedback = require("../../../models/feedback.model");
const History = require("../../../models/history.model");
const Token = require("../../../models/refresh-token.model");
const { createAccessToken, createRefreshToken } = require("../../../middlewares/jwt");
const mailOptions = require("../../../helper/mail");
const createRandomFourDigit = require("../../../helper/confirm");
const nodemailer = require("nodemailer");
const passport = require("passport");
const jwt = require("jsonwebtoken");

module.exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findOne({ _id: userId });
    res.json(user);
  } catch (error) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.authenticateGoogle = (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })(req, res, next);
};

module.exports.googleCallback = (req, res, next) => {
  passport.authenticate(
    "google",
    {
      failureRedirect: "/auth/login?error=google-login-failed",
    },
    async (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (!user) {
        return res.redirect("/auth/login?error=google-login-failed");
      }
      const token = createAccessToken(user._id);
      const refreshToken = createRefreshToken(user._id);
      const newToken = new Token({
        token: refreshToken,
        userId: user._id,
      });
      await newToken.save();
      res.cookie("userToken", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        path: "/",
      });
      res.redirect(
        `${process.env.CLIENT_URL}/login-success/${encodeURIComponent(
          token
        )}/${encodeURIComponent(user.email)}/${encodeURIComponent(user.avatar)}`
      );
    }
  )(req, res, next);
};

module.exports.handleLoginSuccess = async (req, res) => {
  try {
    const { token, email, avatar } = req.params;
    if (!token || !email || !avatar) {
      res.status(403).json({ message: "Invalid credentials" });
    }
    res.json({ message: "Login success !" });
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.editUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { userName, userEmail } = req.body;
    const updateData = {};
    if (userName) {
      updateData.name = userName;
    }
    if (userEmail) {
      updateData.email = userEmail;
    }
    if (Object.keys(updateData).length > 0) {
      await User.findByIdAndUpdate(userId, updateData, { new: true });
      res.json({ message: "Edit user profile successful!" });
    } else {
      res.status(400).json({ message: "No valid fields to update" });
    }
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.userRegister = async (req, res) => {
  try {
    const checkUser = await User.find({ email: req.body.email });
    if (checkUser.length > 0) {
      return res.status(500).json({ message: "Error registering user", error });
    }
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await new User({
      avatar: req.file.path,
      name: name,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();
    const users = await User({});
    res.json(users);
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Email not found." });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Password invalid." });
    }
    if (user.isLocked) {
      return res.status(401).json({ message: "Account locked !" });
    }
    const token = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);
    const newToken = new Token({
      token: refreshToken,
      userId: user._id,
    });
    await newToken.save();
    res.cookie("userToken", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      path: "/",
    });
    res.json({ message: "Success !", user: user });
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.checkToken = async (req, res) => {
  try {
    const token = req.cookies.userToken;
    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }
    res.json({ message: "Success" });
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.releaseAccessToken = async (req, res) => {
  try {
    const userId = req.user.userId;
    const refreshTokenDoc = await Token.findOne({ userId: userId });
    if (!refreshTokenDoc) {
      return res.status(403).json({ message: "Refresh token not found!" });
    }
    const refreshToken = refreshTokenDoc.token;
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Invalid refresh token!" });
        }
        const newAccessToken = createAccessToken(decoded.userId);
        res.cookie("userToken", newAccessToken, {
          httpOnly: true,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          secure: process.env.NODE_ENV === "production",
          sameSite: "None",
          path: "/",
        });
        res.json({ message: "Access token refreshed" });
      }
    );
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.userLogout = async (req, res) => {
  try {
    const userId = req.user.userId;
    let token = req.cookies.userToken;
    if (token) {
      const newBlacklist = await new Blacklisting({
        userId: userId,
        token: token,
        expiresAt: new Date(Date.now() + 7200000),
      });
      await newBlacklist.save();
      await Token.findOneAndDelete({ userId: userId });
      res.clearCookie("userToken");
    }
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.handleFeedback = async (req, res) => {
  try {
    const { name, email, text } = req.body;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "Error" });
    }
    let feedback = await Feedback.findOne({ userId: user.id });
    if (feedback) {
      feedback.feedbackList.push({
        text: text,
        sendingTime: new Date(),
      });
    } else {
      feedback = new Feedback({
        userId: user.id,
        feedbackList: [
          {
            text: text,
            sendingTime: new Date(),
          },
        ],
        createdAt: new Date(),
      });
    }
    await feedback.save();
    const subject = `Dear ${name}. Thank you for your contribution`;
    const message = `Your contribution has been recognized by us.`;
    const userMailOptions = mailOptions(email, subject, message);
    await transporter.sendMail(userMailOptions);
    res.json({ message: "Success !" });
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.handleForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "Error !" });
    }
    const randomFourDigit = createRandomFourDigit();
    const newConfirmCode = new ConfirmCode({
      email: email,
      code: randomFourDigit.toString(),
    });
    await newConfirmCode.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    const subject = `You have submitted a password reset request.`;
    const message = `This is your confirmation code ${randomFourDigit}. Please do not share this code with anyone.`;
    const userMailOptions = mailOptions(email, subject, message);
    await transporter.sendMail(userMailOptions);
    res.json({ message: "Success" });
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.userConfirm = async (req, res) => {
  try {
    const { code } = req.body;
    const confirmCode = await ConfirmCode.findOne({ code: code });
    if (!confirmCode || confirmCode.status === true) {
      return res.status(404).send({ message: "Invalid code !" });
    }
    await ConfirmCode.findOneAndUpdate({ code: code }, { status: true });
    res.json({ message: "Success" });
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    res.json({ message: "Success" });
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const histories = await History.findOne({ userId });
    res.json(histories);
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.updateHistory = async (req, res) => {
  try {
    const { movieId, episode } = req.body;
    const userId = req.user.userId;
    let history = await History.findOne({ userId: userId });
    const movie = await MainModel.findOne({ "movie._id": movieId });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found." });
    }
    if (history) {
      const movieIndex = history.movieList.findIndex(
        (item) => item.slug === movie.movie.slug
      );
      if (movieIndex !== -1) {
        history.movieList[movieIndex].episode = episode;
      } else {
        history.movieList.push({
          origin_name: movie.movie.origin_name,
          poster_url: movie.movie.poster_url,
          slug: movie.movie.slug,
          time: movie.movie.time,
          year: movie.movie.year,
          episode: episode,
        });
      }
    } else {
      history = new History({
        userId: userId,
        movieList: [
          {
            origin_name: movie.movie.origin_name,
            poster_url: movie.movie.poster_url,
            slug: movie.movie.slug,
            time: movie.movie.time,
            year: movie.movie.year,
            episode: episode,
          },
        ],
      });
    }
    await history.save();
    res.json({ message: "History updated successfully!" });
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};
