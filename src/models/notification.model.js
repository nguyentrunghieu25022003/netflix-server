const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messages: [
    {
      poster_url: {
        type: String,
        required: true,
      },
      slug: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ["unread", "read"],
        default: "unread",
      },
    }
  ],
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
