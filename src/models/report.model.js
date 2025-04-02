const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    movieId: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    movieStatus: {
        type: String,
        default: "Error / Unable to view."
    },
    processingStatus: {
        type: Boolean,
        default: false
    },
    message: {
        type: String,
        default: "We have processed your request."
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
});

const Report = mongoose.model("Report", ReportSchema);

module.exports = Report;