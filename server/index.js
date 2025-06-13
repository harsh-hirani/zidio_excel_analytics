const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const authMiddleware = require('./middlewares/auth');
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

app.get("/running",(req,res)=>{
    res.status(200).json({"running":"ok"})
})

app.use('/auth', require('./routes/auth'));
app.use('/app',authMiddleware, require('./routes/app'))
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
