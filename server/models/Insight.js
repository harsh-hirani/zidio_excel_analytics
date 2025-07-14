const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
    user:{type: mongoose.Schema.Types.ObjectId, required:true},
    recordID:{type: mongoose.Schema.Types.ObjectId, required:true},
    insight:String,

},{timestamps:true});

module.exports = mongoose.models.Insight || mongoose.model('Insight',insightSchema,'insight')