const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConfirmCodeSchema = Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ConfirmCode = mongoose.model("ConfirmCode", ConfirmCodeSchema);

module.exports = ConfirmCode;