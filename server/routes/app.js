const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const ExcelRecord = require('../models/ExcelRecord')
const router = express.Router();

// @set-up multer
const storage = multer.diskStorage({
    destination : (req,file,cb)=>cb(null,'uploads/'),
    filename: (req,file,cb)=>cb(null,Date.now()+path.extname(file.originalname))
})
const upload = multer({storage})

// @route   POST /app/upload
// @desc    upload a file 
router.post('/upload',upload.single('file') ,async (req,res)=>{
try {
    if(!req.file) return res.status(400).json({error:"No File Uploaded"});

    const filePath  = path.join(__dirname,"..",'uploads/',req.file.filename);
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    // save to mongo
    const newRecord = new ExcelRecord({
        user:req.user.id,
        fileName:req.file.originalname,
        data:jsonData
    })
    await newRecord.save()

    fs.unlinkSync(filePath);

    res.status(201).json({
        message: "excel file uploaded, ok",
        recordId:newRecord._id,
        rowCount:jsonData.length
    })


} catch (error) {
    console.error(error)
     res.status(500).json({ error: "Server Error" ,Obj:error});
}
})

// @route   GET /app/record/:id
// @desc    json data     
router.get('/record/:id',async(req,res)=>{
try {
    const record = await ExcelRecord.findOne({
        user:req.user.id,
        _id:req.params.id
    })
    if(!record){
        return res.status(404).json({error:"Record Not Found"})
    }
    res.status(200).json({
        message: 'Record Found',
        data: record.data
    })
} catch (error) {
    console.error(error)
     res.status(500).json({ error: "Server Error" ,Obj:error});
}
})
module.exports = router