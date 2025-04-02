const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  googleId: { type: String },
  avatar: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
  role: { type: String, required: true, default: "user" },
  isLocked: { type: Boolean, required: true, default: false },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;