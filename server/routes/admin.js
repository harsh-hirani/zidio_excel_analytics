const express = require('express');
const router = express.Router();
const User = require('../models/User')
const ExcelRecord = require('../models/ExcelRecord');
const t= require('../controllers/admin/actions')
router.get('/users', async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json({ data: users })
    } catch (error) {
        res.status(500).json({ "msg": "", "err": error })
    }
})
router.get('/test',t.userExcelSummary)

router.patch('/:action/:id', async (req, res) => {
    const { action, id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        if (action === 'promote') {
            if (user.role === 'admin') {
                return res.status(200).json({ msg: `${user.name} is already an Admin` });
            }
            user.role = 'admin';
            await user.save();
            return res.status(200).json({ msg: `${user.name} has been promoted to Admin` });

        } else if (action === 'demote') {
            if (user.role !== 'admin') {
                return res.status(200).json({ msg: `${user.name} is not an Admin` });
            }
            user.role = 'user'; // or your default role
            await user.save();
            return res.status(200).json({ msg: `${user.name} has been demoted to User` });

        } else {
            return res.status(400).json({ msg: "Invalid action. Use 'promote' or 'demote'" });
        }

    } catch (error) {
        res.status(500).json({ msg: "Server error", err: error });
    }
});

module.exports = router