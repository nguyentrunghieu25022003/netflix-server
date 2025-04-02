const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TotalScoreSchema = new Schema({
    movieId: {
        type: Schema.Types.ObjectId,
        ref: "MainModel",
        required: true
    },
    voteQuantity: {
        type: Number,
        required: true,
        default: 0
    },
    totalScore: {
        type: Number,
        required: true,
        default: 0
    }
});

const TotalScore = mongoose.model("TotalScore", TotalScoreSchema);

module.exports = TotalScore;