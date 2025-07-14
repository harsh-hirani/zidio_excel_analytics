const User = require('../../models/User');
// const ExcelRecord = require('./models/ExcelRecord'); // just to show both models are loaded

exports.userExcelSummary = async (req, res) => {
  try {
    // Parse query params with default fallbacks
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Count total users
    const totalItems = await User.countDocuments();

    // Main aggregation query with $lookup and $facet for pagination
    const result = await User.aggregate([
      {
        $lookup: {
          from: "excelRecord", // collection name in MongoDB (not model)
          localField: "_id",
          foreignField: "user",
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
      },
      {
        $sort: { name: 1 } // optional: sort alphabetically
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit);

    // Final response
    res.status(200).json({
      data: result,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit
      }
    });

  } catch (err) {
    console.error("Error in /admin/test:", err);
    res.status(500).json({ message: "Server Error" });
  }
};