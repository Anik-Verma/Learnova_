import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const modelList = await genAI.listModels();
    console.log("Full model list:");
    for (const model of modelList.models) {
      console.log(model.name);
    }
  } catch (e) {
    console.error("Error listing models:", e);
  }
}
listModels();
