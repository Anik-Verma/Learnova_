import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleAIFileManager } from '@google/generative-ai/server'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
)

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash'
})

const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY)

const CLASS9_CHAPTERS = [
  { id: 'Motion_9', name: 'Motion', pdf: 'class9-motion.pdf' },
  { id: 'Laws_of_Motion_9', name: 'Laws of Motion', pdf: 'class9-laws-of-motion.pdf' },
  { id: 'Gravitation_9', name: 'Gravitation', pdf: 'class9-gravitation.pdf' },
  { id: 'Matter_9', name: 'Matter in Our Surroundings', pdf: 'class9-matter.pdf' },
  { id: 'Atoms_Molecules_9', name: 'Atoms and Molecules', pdf: 'class9-atoms-molecules.pdf' },
  { id: 'Structure_Atoms_9', name: 'Structure of Atoms', pdf: 'class9-structure-of-atoms.pdf' },
  { id: 'Cells_9', name: 'Fundamental Unit of Life', pdf: 'class9-cells.pdf' },
  { id: 'Tissues_9', name: 'Tissues', pdf: 'class9-tissues.pdf' }
]

const EXTRACTION_PROMPT = (chapterName) => `
You are an expert NCERT Science teacher.
Read the provided PDF for the chapter "${chapterName}" and generate at least 15 high-quality MCQs.
These questions should test conceptual understanding of Class 9 students.

Format your response as a PURE JSON array of objects.
Do not include markdown or explanations outside the JSON.
Each object MUST look exactly like this:
{
  "id": 1,
  "question": "Clear, conceptual question text",
  "subtopic": "Specific sub-topic name from the chapter",
  "difficulty": "easy/medium/hard",
  "type": "mcq",
  "options": [
    { "id": "A", "text": "Option text", "isCorrect": false },
    { "id": "B", "text": "Option text", "isCorrect": true },
    { "id": "C", "text": "Option text", "isCorrect": false },
    { "id": "D", "text": "Option text", "isCorrect": false }
  ],
  "correctId": "B",
  "explanation": {
    "main": "Detailed explanation of why the answer is correct.",
    "whyOthersWrong": "Brief explanation of why the other options are incorrect."
  },
  "hint": "A helpful nudge to guide the student.",
  "marks": 1
}

RULES:
1. Every single question must be strictly derived from the provided PDF.
2. Ensure options are distinct and plausible.
3. Use simple language for 14-year-olds.
4. Include calculations if relevant (e.g., speed, force, mass).
`;

async function generateWithRetry(model, content, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await model.generateContent(content)
      return result
    } catch (error) {
      if ((error.message.includes('429') || error.message.includes('500') || error.message.includes('503')) && i < maxRetries - 1) {
        const waitTime = (i + 1) * 30000
        console.log(`⚠️  Error: ${error.message}. Retrying in ${waitTime/1000}s...`)
        await new Promise(r => setTimeout(r, waitTime))
        continue
      }
      throw error
    }
  }
}

async function generateQuiz() {
  console.log('🚀 SciVerse Premium Quiz Generator (Gemini 1.5 Flash)')
  console.log('====================================================')
  
  const pdfDir = path.join(__dirname, '..', 'public', 'pdfs')
  const outputDir = path.join(__dirname, '..', 'public', 'questions')

  for (const chapter of CLASS9_CHAPTERS) {
    const fileName = `${chapter.id}_quiz.json`
    const filePath = path.join(outputDir, fileName)
    const pdfPath = path.join(pdfDir, chapter.pdf)

    // Skip logic: If file exists and has >= 15 questions, skip
    if (fs.existsSync(filePath)) {
      try {
        const existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        if (Array.isArray(existingData) && existingData.length >= 15) {
          console.log(`⏭️  Skipping ${chapter.name} (Already complete with ${existingData.length} questions)`)
          continue
        }
      } catch (e) {
        console.log(`🔄 Repairing corrupted file: ${fileName}`)
      }
      console.log(`🔄 Re-generating ${chapter.name} (Incomplete or missing)`)
    }

    if (!fs.existsSync(pdfPath)) {
      console.error(`  ❌ PDF not found: ${chapter.pdf}`)
      continue
    }

    console.log(`🤖 Processing ${chapter.name} using ${chapter.pdf}...`)
    
    try {
      const pdfBuffer = fs.readFileSync(pdfPath)
      const pdfBase64 = pdfBuffer.toString('base64')

      const result = await generateWithRetry(model, [
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: pdfBase64
          }
        },
        { text: EXTRACTION_PROMPT(chapter.name) }
      ])

      const text = result.response.text().trim()
      let jsonText = text
      
      // Extract JSON from markdown
      if (text.includes('```')) {
        const match = text.match(/```(?:json)?\s*([\s\S]*?)```/)
        if (match) jsonText = match[1].trim()
      }
      
      const start = jsonText.indexOf('[')
      const end = jsonText.lastIndexOf(']')
      if (start !== -1 && end !== -1) {
        jsonText = jsonText.slice(start, end + 1)
      }

      const questions = JSON.parse(jsonText)
      
      fs.writeFileSync(filePath, JSON.stringify(questions, null, 2))
      console.log(`  ✅ Saved ${questions.length} questions to ${fileName}`)
      
      // Cooling down to avoid rate limits
      console.log('  ⏳ cooling down (20s)...')
      await new Promise(r => setTimeout(r, 20000))

    } catch (err) {
      console.error(`  ❌ Failed to generate ${chapter.name}:`, err)
    }
  }
  
  console.log(`\n🎉 Process Complete!`)
}

generateQuiz()
