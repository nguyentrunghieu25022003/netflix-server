const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StatusSchema = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  movies: [
    {
      movieId: {
        type: Schema.Types.ObjectId,
        ref: "MainModel",
        required: true,
      },
      status: {
        enum: ["liked", "disliked", "watched", "unwatched"],
        type: String,
        required: true,
        default: "unwatched",
      },
    },
  ],
});

const Status = mongoose.model("Status", StatusSchema);

module.exports = Status;
