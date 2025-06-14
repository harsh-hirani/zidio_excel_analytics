const mongoose = require('mongoose');

const ExcelRecordSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    fileName:{
        type:String,
        required:true
    },
    data:{
        type:Array,
        required:true
    },
    uploadedAt:{
        type:Date,
        default:Date.now
    },
    status:{
        type:Boolean,
        default:true
    }
})

module.exports = mongoose.models.ExcelRecord || mongoose.model('ExcelRecord',ExcelRecordSchema,'excelRecord')