import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });
const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";
console.log("Key extracted:", apiKey.substring(0, 10) + "...");
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent("Hello World");
      console.log(result.response.text());
  } catch(e) {
      console.log("ERROR:", e);
  }
}
run();
