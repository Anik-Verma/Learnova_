import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function list() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Model initialized");
    // Just try a simple prompt
    const result = await model.generateContent("test");
    console.log("Result:", result.response.text());
  } catch (e) {
    console.error("Error:", e.message);
  }
}

list()
