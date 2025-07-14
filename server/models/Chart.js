const mongoose = require('mongoose');


const ChartSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId },
upload: { type: mongoose.Schema.Types.ObjectId },
title: String,
chartType: String,
labels: [String],
values: [Number],
createdAt:{
        type:Date,
        default:Date.now
    },
});

module.exports = mongoose.models.Chart || mongoose.model('Chart',ChartSchema,'chart')