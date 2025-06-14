const User = require('../../models/User');
// const ExcelRecord = require('./models/ExcelRecord'); // just to show both models are loaded

exports.userExcelSummary = async (req, res) => {
    try {
        const summary = await User.aggregate([
            {
                $lookup: {
                    from: "excelRecord",          // exact collection name (as in MongoDB)
                    localField: "_id",            // user._id
                    foreignField: "user",         // ExcelRecord.user
                    as: "excelRecords"
                }
            },
            {
                $project: {
                    name: 1,
                    role: 1,
                    status: 1,
                    excelCount: { $size: "$excelRecords" }
                }
            }
        ]);

        res.status(200).json(summary);
    } catch (error) {
        res.status(500).json({ msg: "Failed to get summary", err: error });
    }
};
