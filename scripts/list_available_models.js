import dotenv from 'dotenv'
dotenv.config()

async function list() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    if (data.models) {
      data.models.forEach(m => console.log(m.name));
    } else {
      console.log("No models found. Response:", JSON.stringify(data));
    }
  } catch (e) {
    console.error("Error:", e.message);
  }
}

list()
