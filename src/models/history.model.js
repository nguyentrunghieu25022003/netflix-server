const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  movieList: [
    {
      origin_name: {
        type: String,
        required: true
      },
      poster_url: {
        type: String,
        required: true
      },
      slug: {
        type: String,
        required: true
      },
      time: {
        type: String,
        required: true
      },
      year: {
        type: String,
        required: true
      },
      episode: {
        type: Number,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const History = mongoose.model("History", HistorySchema);

module.exports = History;
