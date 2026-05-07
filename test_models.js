import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });
const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";

const ai = new GoogleGenerativeAI(apiKey);
const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-2.0-flash', 'gemini-2.0-flash-exp', 'gemini-pro', 'gemini-1.5-pro'];

async function run() {
  for (let m of models) {
    try {
      await ai.getGenerativeModel({model: m}).generateContent('hi');
      console.log(m, 'SUCCESS');
    } catch(e) {
      console.log(m, 'FAILED', e.status, e.message);
    }
  }
}
run();
