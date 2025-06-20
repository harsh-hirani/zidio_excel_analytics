const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const ExcelRecord = require('../models/ExcelRecord')
const router = express.Router();

// @set-up multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})
const upload = multer({ storage })

// @route   POST /app/upload
// @desc    upload a file 
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No File Uploaded" });

        const filePath = path.join(__dirname, "..", 'uploads/', req.file.filename);
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet);

        // save to mongo
        const newRecord = new ExcelRecord({
            user: req.user.id,
            fileName: req.file.originalname,
            data: jsonData
        })
        await newRecord.save()

        fs.unlinkSync(filePath);

        res.status(201).json({
            message: "excel file uploaded, ok",
            recordId: newRecord._id,
            rowCount: jsonData.length
        })


    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Server Error", Obj: error });
    }
})

// @route   GET /app/record/:id
// @desc    json data     
router.get('/record/:id', async (req, res) => {
    try {
        const record = await ExcelRecord.findOne({
            user: req.user.id,
            _id: req.params.id
        })
        if (!record) {
            return res.status(404).json({ error: "Record Not Found" })
        }
        res.status(200).json({
            message: 'Record Found',
            data: record.data
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Server Error", Obj: error });
    }
})

// GET /app/recent-uploads?page=1&limit=10
router.get('/recent-uploads', async (req, res, next) => {
    try {
        // const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get paginated records (only selected fields)
        const records = await ExcelRecord.find({ user: req.user.id })
            .sort({ uploadedAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('_id fileName uploadedAt data')
            .lean();

        // Map to include totalSize
        const mappedRecords = records.map(rec => ({
            _id: rec._id,
            fileName: rec.fileName,
            uploadedAt: rec.uploadedAt,
            totalSize: rec.data.length
        }));

        // Get total count separately
        const total = await ExcelRecord.countDocuments({ user: req.user._id });

        res.json({
            data: mappedRecords,
            pagination: {
                totalItems: total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                pageSize: limit
            }
        });
    } catch (err) {
        next(err);
    }
});
router.post('/recent-charts', async (req, res) => {
    try {
        res.status(200).json({
            data: [{
                title: "one",
                ffname: "one.xls",
                ffid: "zdjcvdgshvctdsfgkhdsvcu",
                id: "zdjcvdgshvctdsfgkhdsvcu"
            }, {
                title: "two",
                ffname: "one.xls",
                ffid: "zdjcvdgshvctdsfgkhdsv4u",
                id: "zdjcvdgshvctdsfgkhdsv44u"
            }, {
                title: "two",
                ffname: "one.xls",
                ffid: "zdjcvdgshvctdsfgkhdsvcu",
                id: "zdjcvdgshvctdsfgkhdsvcu"
            }, {
                title: "two",
                ffname: "one.xls",
                ffid: "zdjcvdgshvctdsfgkhdsvcu",
                id: "zdjcvdgshvctdsfgkhdsvcu"
            }, {
                title: "two",
                ffname: "one.xls",
                ffid: "zdjcvdgshvctdsfgkhdsvcu",
                id: "zdjcvdgshvctdsfgkhdsvcu"
            }, {
                title: "two",
                ffname: "one.xls",
                ffid: "zdjcvdgshvctdsfgkhdsvcu",
                id: "zdjcvdgshvctdsfgkhdsvcu"
            }]
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Server Error", Obj: error });
    }
})
router.post('/recent-uploads', async (req, res) => {
    try {
        res.status(200).json({
            data: [{
                title: "one.xls",
                id: "zdjcvdgshvctdsfgkhdsvcu",
                ncharts: 3
            }, {
                title: "one.xls",
                id: "zdjcvdgshvctdsfgkhdsvcu",
                ncharts: 3
            }, {
                title: "one.xls",
                id: "zdjcvdgshvctdsfgkhdsvcu",
                ncharts: 3
            }, {
                title: "one.xls",
                id: "zdjcvdgshvctdsfgkhdsvcu",
                ncharts: 3
            }, {
                title: "one.xls",
                id: "zdjcvdgshvctdsfgkhdsvcu",
                ncharts: 3
            }, {
                title: "one.xls",
                id: "zdjcvdgshvctdsfgkhdsvcu",
                ncharts: 3
            },]
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Server Error", Obj: error });
    }
})
//deletes
router.delete('/upload', async (req, res) => {
    try {
        res.status(200).json({
            "msg": "deleted",
            id: req.body?.id,
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error", Obj: err });
    }
})
router.delete('/chart', async (req, res) => {
    try {
        res.status(200).json({
            "msg": "deleted",
            id: req.body?.id,
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error", Obj: err });
    }
})
module.exports = router