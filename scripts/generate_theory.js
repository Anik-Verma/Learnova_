import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const CHAPTERS = [
  {
    pdf: 'class9-motion.pdf',
    output: 'Motion_9.json',
    topic: 'Motion',
    standard: 9,
    subject: 'Physics'
  },
  {
    pdf: 'class9-laws-of-motion.pdf',
    output: 'Laws_of_Motion_9.json',
    topic: 'Laws of Motion',
    standard: 9,
    subject: 'Physics'
  },
  {
    pdf: 'class9-gravitation.pdf',
    output: 'Gravitation_9.json',
    topic: 'Gravitation',
    standard: 9,
    subject: 'Physics'
  },
  {
    pdf: 'class9-matter.pdf',
    output: 'Matter_9.json',
    topic: 'Matter in Our Surroundings',
    standard: 9,
    subject: 'Chemistry'
  },
  {
    pdf: 'class9-atoms-molecules.pdf',
    output: 'Atoms_Molecules_9.json',
    topic: 'Atoms and Molecules',
    standard: 9,
    subject: 'Chemistry'
  },
  {
    pdf: 'class9-structure-of-atoms.pdf',
    output: 'Structure_Atoms_9.json',
    topic: 'Structure of Atoms',
    standard: 9,
    subject: 'Chemistry'
  },
  {
    pdf: 'class9-cells.pdf',
    output: 'Cells_9.json',
    topic: 'Fundamental Unit of Life',
    standard: 9,
    subject: 'Biology'
  },
  {
    pdf: 'class9-tissues.pdf',
    output: 'Tissues_9.json',
    topic: 'Tissues',
    standard: 9,
    subject: 'Biology'
  },
  {
    pdf: 'class10-light.pdf',
    output: 'Light_10.json',
    topic: 'Light Reflection and Refraction',
    standard: 10,
    subject: 'Physics'
  },
  {
    pdf: 'class10-human-eye.pdf',
    output: 'Human_Eye_10.json',
    topic: 'Human Eye and Colourful World',
    standard: 10,
    subject: 'Physics'
  },
  {
    pdf: 'class10-acids-bases-salts.pdf',
    output: 'Acids_10.json',
    topic: 'Acids Bases and Salts',
    standard: 10,
    subject: 'Chemistry'
  },
  {
    pdf: 'class10-carbon-compounds.pdf',
    output: 'Carbon_10.json',
    topic: 'Carbon and Its Compounds',
    standard: 10,
    subject: 'Chemistry'
  },
  {
    pdf: 'class10-life-processes.pdf',
    output: 'Life_Processes_10.json',
    topic: 'Life Processes',
    standard: 10,
    subject: 'Biology'
  },
  {
    pdf: 'class10-control-coordination.pdf',
    output: 'Control_10.json',
    topic: 'Control and Coordination',
    standard: 10,
    subject: 'Biology'
  }
]

const PROMPT = (topic, standard, subject) => `
You are an expert NCERT science teacher.
Read this NCERT chapter PDF completely and 
generate structured interactive theory content.

Topic: ${topic}
Class: ${standard}
Subject: ${subject}

Return ONLY valid JSON. No markdown. No explanation.
Start with { and end with }

{
  "chapterTitle": "exact chapter name",
  "subject": "${subject}",
  "standard": ${standard},
  "totalReadTime": "X minutes",
  "chapterSummary": "3-4 sentence summary in simple language for 14-16 year old Indian students",
  "subtopics": [
    {
      "id": "unique_snake_case_id",
      "title": "Subtopic title from chapter",
      "order": 1,
      "summary": "2-3 sentence simple overview",
      "theory": "5-7 sentence detailed explanation with all terms defined simply",
      "didYouKnow": "One genuinely fascinating fact that surprises students",
      "example": {
        "title": "Example title",
        "description": "Real world example relatable to Indian students. Use cricket, trains, chai, bikes, auto-rickshaws where relevant."
      },
      "keyTerms": [
        {
          "term": "Technical Term",
          "definition": "Simple one sentence definition"
        }
      ],
      "hasGraph": false,
      "graph": {
        "type": "line",
        "title": "Graph title",
        "xLabel": "X axis label",
        "yLabel": "Y axis label",
        "description": "What this graph shows",
        "dataPoints": [
          {"x": 0, "y": 0},
          {"x": 1, "y": 2},
          {"x": 2, "y": 4}
        ]
      },
      "formula": {
        "exists": false,
        "latex": "v = u + at",
        "plain": "Final Velocity = Initial Velocity + Acceleration x Time",
        "variables": [
          {
            "symbol": "v",
            "meaning": "Final velocity",
            "unit": "m/s"
          }
        ]
      },
      "quickCheck": {
        "question": "Simple question to test understanding",
        "answer": "Correct answer with brief explanation"
      }
    }
  ],
  "importantFormulas": [
    {
      "formula": "F = ma",
      "meaning": "Force equals mass times acceleration",
      "unit": "Newton (N)"
    }
  ],
  "connectsTo": ["related chapter or concept"]
}

RULES:
- Cover EVERY subtopic in the chapter
- Set hasGraph true only for subtopics that 
  naturally have graphs (motion graphs etc)
- Set formula.exists true only when there is
  a real mathematical formula in that subtopic
- All content must be strictly from the PDF
- Language must be simple for Class ${standard}
- Indian context examples are mandatory
- didYouKnow must be genuinely interesting
`

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function processChapter(chapter, index, total) {
  console.log(`\nProcessing ${index + 1}/${total}: ${chapter.topic}...`)

  const pdfPath = path.join(
    process.cwd(), 'public', 'pdfs', chapter.pdf
  )
  const outputPath = path.join(
    process.cwd(), 'public', 'theory', chapter.output
  )

  if (!fs.existsSync(pdfPath)) {
    console.log(`  ❌ PDF not found: ${chapter.pdf}`)
    return false
  }

  if (fs.existsSync(outputPath)) {
    console.log(`  ⏭  Already exists, skipping: ${chapter.output}`)
    return 'skipped'
  }

  const pdfBuffer = fs.readFileSync(pdfPath)
  const pdfBase64 = pdfBuffer.toString('base64')

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash'
  })

  const prompt = PROMPT(
    chapter.topic,
    chapter.standard,
    chapter.subject
  )

  try {
    console.log(`  📖 Reading PDF and generating content...`)

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: pdfBase64
        }
      },
      { text: prompt }
    ])

    const response = await result.response
    const text = response.text().trim()

    let jsonText = text
    if (text.includes('```')) {
      const match = text.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (match) jsonText = match[1].trim()
    }

    const jsonStart = jsonText.indexOf('{')
    const jsonEnd = jsonText.lastIndexOf('}')
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('No valid JSON found in response')
    }
    jsonText = jsonText.slice(jsonStart, jsonEnd + 1)

    const parsed = JSON.parse(jsonText)

    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), 
        { recursive: true })
    }

    fs.writeFileSync(
      outputPath,
      JSON.stringify(parsed, null, 2),
      'utf8'
    )

    console.log(`  ✅ Saved: ${chapter.output}`)
    console.log(`  📚 Subtopics found: ${parsed.subtopics?.length || 0}`)
    return true

  } catch (error) {
    console.log(`  ❌ Failed: ${error.message}`)
    
    // Check if it's a quota issue and wait longer
    if (error.message && error.message.includes('429')) {
       console.log(`  ⏳ Quota exceeded. Waiting 60 seconds before retry...`)
       await sleep(60000)
    } else {
       console.log(`  🔄 Retrying once after 10 seconds...`)
       await sleep(10000)
    }

    try {
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: pdfBase64
          }
        },
        { text: prompt }
      ])

      const response = await result.response
      const text = response.text().trim()
      let jsonText = text

      if (text.includes('```')) {
        const match = text.match(/```(?:json)?\s*([\s\S]*?)```/)
        if (match) jsonText = match[1].trim()
      }

      const jsonStart = jsonText.indexOf('{')
      const jsonEnd = jsonText.lastIndexOf('}')
      jsonText = jsonText.slice(jsonStart, jsonEnd + 1)

      const parsed = JSON.parse(jsonText)

      fs.writeFileSync(
        outputPath,
        JSON.stringify(parsed, null, 2),
        'utf8'
      )

      console.log(`  ✅ Retry succeeded: ${chapter.output}`)
      return true

    } catch (retryError) {
      console.log(`  💥 Retry also failed: ${retryError.message}`)
      return false
    }
  }
}

async function main() {
  console.log('🚀 SciVerse Theory Generator')
  console.log('================================')
  console.log(`📁 Processing ${CHAPTERS.length} chapters`)
  console.log('🤖 Model: gemini-2.0-flash (free tier)')
  console.log('⏱  Estimated time: 15-20 minutes')
  console.log('================================\n')

  const outputDir = path.join(
    process.cwd(), 'public', 'theory'
  )
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
    console.log('📂 Created /public/theory/ folder\n')
  }

  const results = { success: 0, failed: 0, skipped: 0 }
  const failedList = []

  for (let i = 0; i < CHAPTERS.length; i++) {
    const success = await processChapter(
      CHAPTERS[i], i, CHAPTERS.length
    )

    if (success === true) {
      results.success++
    } else if (success === 'skipped') {
      results.skipped++
    } else {
      results.failed++
      failedList.push(CHAPTERS[i].topic)
    }

    if (i < CHAPTERS.length - 1 && success !== 'skipped') {
      console.log('  ⏳ Waiting 30 seconds before next chapter to avoid quota issues...')
      await sleep(30000)
    }
  }

  console.log('\n================================')
  console.log('📊 FINAL SUMMARY')
  console.log('================================')
  console.log(`✅ Successful: ${results.success}/14`)
  console.log(`❌ Failed: ${results.failed}/14`)

  if (failedList.length > 0) {
    console.log('\nFailed chapters:')
    failedList.forEach(f => console.log(`  - ${f}`))
    console.log('\nTo retry failed chapters run:')
    console.log('node scripts/generate_theory.js')
  } else {
    console.log('\n🎉 All chapters generated successfully!')
    console.log('Your theory JSON files are ready in /public/theory/')
  }
}

main().catch(console.error)
