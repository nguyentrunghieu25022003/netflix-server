const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlacklistingSchema = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Blacklisting = mongoose.model("Blacklisting", BlacklistingSchema);

module.exports = Blacklisting;
