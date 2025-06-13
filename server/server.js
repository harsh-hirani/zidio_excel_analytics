const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
// not this one
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/running",(req,res)=>{
    res.status(200).json({"running":"ok"})
})
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
