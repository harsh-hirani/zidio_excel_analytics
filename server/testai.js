
const ExcelRecord = require('./models/ExcelRecord')
const mongoose = require('mongoose');
// const Chart = require('../models/Chart')
// const Insight = require('../models/Insight')
const OpenAI = require("openai");
const dotenv = require('dotenv');
dotenv.config();
mongoose.connect(process.env.MONGO_URI);
const openai = new OpenAI({
  apiKey:'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',
});
(async ()=>{
  try {
    const recordId  = '685659748f36de7c7f7e71ac';
    const record = await ExcelRecord.findById( recordId);
    if (!record) {console.log({ msg: "No record found" })}      
else{
    const sampleData = record.data.slice(0, 20);
    const prompt = `You are a data analyst. Give me 3 insights (20–25 words each) based on this data:\n${JSON.stringify(sampleData)}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 200
    });

    const insight = completion.choices[0].message.content.trim();

   

    console.log({
      msg: "Insight generated and saved",
      insight
    });
}
  } catch (error) {
    console.error(error);
    
  }
})();

