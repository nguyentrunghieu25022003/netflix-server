const jwt = require("jsonwebtoken");
const Blacklisting = require("../models/blacklist.model");

const authenticateToken = async (req, res, next) => {
  const userToken = req.cookies.userToken;
  let token = userToken;
  if (!token) {
    return res.status(401).send("Token not found in the authorization header");
  }
  const blacklistedToken = await Blacklisting.findOne({ token: token });
  if (blacklistedToken) {
    return res.status(403).json({ error: "Token is invalid" });
  }
  const secret = process.env.JWT_SECRET || "fallback_secret";
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: err.message });
    }
    console.log("Checked Token");
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;