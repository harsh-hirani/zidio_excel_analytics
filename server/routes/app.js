const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const ExcelRecord = require('../models/ExcelRecord')
const Chart = require('../models/Chart')
const Insight = require('../models/Insight')
const router = express.Router(); const OpenAI = require("openai");
// @set-up multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
})
// @set-up openAI
// const openai = new OpenAIApi(new Configuration({
//     apiKey: process.env.OPENAI_KEY
// }))
const openai = new OpenAI({
    apiKey: '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',
});
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

// @route   GET /app/chart/:id
// gets 
router.get("/chart/:id", async (req, res, next) => {
    try {

        const record = await Chart.findOne({
            user: req.user.id,
            _id: req.params.id,
            
        })
        const title =  await ExcelRecord.findOne({
            _id:record.upload,
            user:req.user.id
        })

        if (!record) {
            return res.status(404).json({ error: "Record Not Found" })
        }
        res.status(200).json({
            message: 'Record Found',
            filename: record.fileName,
            data: record.data,
            title:record.title,
            chartType : record.chartType,
            x : record.labels,
            y : record.values,
            fname:title.filename,
            fid:record.upload

        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving chart', });
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
            filename: record.fileName,
            data: record.data,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Server Error", Obj: error });
    }
})

// GET /app/dashboard 
router.get('/dashboard', async (req, res, next) => {
    try {
        // Get paginated records (only selected fields)
        const records1 = await ExcelRecord.find({ user: req.user.id })
            .sort({ uploadedAt: -1 })
            .skip(0)
            .limit(8)
            .select('_id fileName uploadedAt')
            .lean();
        const records2 = await Chart.find({ user: req.user.id })
            .sort({ uploadedAt: -1 })
            .skip(0)
            .limit(8)
            .select('_id title createdAt chartType')
            .lean();

        // Map to include totalSize
        const mappedRecords1 = records1.map(rec => ({
            id: rec._id,
            fname: rec.fileName,
            sec: rec.uploadedAt,
        }));
        const mappedRecords2 = records2.map(rec => ({
            id: rec._id,
            type: rec.chartType,
            fname: rec.title,
            sec: rec.createdAt,
        }));

        // Get total count separately
        const total1 = await ExcelRecord.countDocuments({ user: req.user.id });
        const total2 = await Chart.countDocuments({ user: req.user.id });

        res.json({
            uploads: mappedRecords1,
            totalU: total1,
            charts: mappedRecords2,
            totalC: total2
        });
    } catch (err) {
        next(err);
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
            .select('_id fileName uploadedAt')
            .lean();

        // Map to include totalSize
        const mappedRecords = records.map(rec => ({
            id: rec._id,
            fname: rec.fileName,
            sec: rec.uploadedAt,
        }));

        // Get total count separately
        const total = await ExcelRecord.countDocuments({ user: req.user.id });

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
router.get('/recent-charts', async (req, res) => {
    try {
        // const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get paginated records (only selected fields)
        const records = await Chart.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('_id title createdAt chartType')
            .lean();

        // Map to include totalSize
        const mappedRecords = records.map(rec => ({
            id: rec._id,
            type: rec.chartType,
            fname: rec.title,
            sec: rec.createdAt,
        }));

        // Get total count separately
        const total = await Chart.countDocuments({ user: req.user.id });

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
})



//deletes
// DELETE /app/upload
router.delete('/upload', async (req, res) => {
    try {
        const rec = await ExcelRecord.findOne({ _id: req.body?.id, user: req.user.id })
        if (!rec) {
            return res.status(400).json({
                msg: "no record found"
            })
        }
        await ExcelRecord.deleteOne({ _id: req.body?.id, user: req.user.id })
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
        const rec = await Chart.findOne({ _id: req.body?.id, user: req.user.id })
        if (!rec) {
            return res.status(400).json({
                msg: "no record found"
            })
        }
        await Chart.deleteOne({ _id: req.body?.id, user: req.user.id })
        res.status(200).json({
            "msg": "deleted",
            id: req.body?.id,
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error", Obj: err });
    }
})

// POST /app/ai-insight

router.post('/ai-insight', async (req, res, next) => {
    try {
        const { recordId } = req.body;
        const record = await ExcelRecord.findOne({
            user: req.user.id,
            _id: recordId
        });
        if (!record) return res.status(400).json({ msg: "No record found" });

        const sampleData = record.data.slice(0, 20);
        const prompt = `You are a data analyst. Give me 3 insights (20–25 words each) based on this data:\n${JSON.stringify(sampleData)}`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.5,
            max_tokens: 200
        });

        const insight = completion.choices[0].message.content.trim();

        await Insight.create({
            user: req.user.id,
            recordId,
            insight
        });

        res.status(201).json({
            msg: "Insight generated and saved",
            insight
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
});

// charts

// POST /app/chart/save
router.post('/chart/save', async (req, res, next) => {
    try {
        const { upload, title, chartType, labels, values } = req.body;

        if (!title || !chartType || !labels || !values) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newChart = new Chart({
            user: req.user.id,
            upload,
            title,
            chartType,
            labels,
            values
        });

        await newChart.save();
        res.status(201).json({ message: 'Chart saved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving chart', });
    }
});
module.exports = router