export async function fetchPDFAsBase64(pdfPath) {
  const response = await fetch(pdfPath)
  if (!response.ok) {
    throw new Error(`Could not load PDF: ${pdfPath}`)
  }
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export async function generateTheoryFromPDF(pdfBase64, topicName, standard) {
  const systemPrompt = `You are an expert NCERT science 
teacher creating interactive digital theory content 
for Class ${standard} students aged 14-16 in India.

You will receive an NCERT chapter PDF. Read the ENTIRE 
chapter carefully and extract ALL subtopics covered.

Generate a complete, structured theory breakdown.

STRICT RULES:
- Base ALL content strictly on what is in the PDF
- Never add information not present in the chapter
- Use simple language a 14-16 year old understands
- Make examples relatable to Indian students daily life
- Every subtopic MUST have all 5 sections filled

Return ONLY valid JSON. No markdown. No explanation.
No preamble. Start response with { and end with }

JSON FORMAT:
{
  "chapterTitle": "exact chapter name from PDF",
  "subject": "Physics or Chemistry or Biology",
  "standard": ${standard},
  "totalReadTime": "estimated minutes to read",
  "subtopics": [
    {
      "id": "unique_id_snake_case",
      "title": "Subtopic Title from chapter",
      "order": 1,
      "summary": "2-3 sentence simple summary of this subtopic.",
      "theory": "Detailed explanation in 4-6 sentences. Explain concepts clearly. Define all technical terms used.",
      "didYouKnow": "One genuinely fascinating or surprising fact directly related to this subtopic. Make it wow the student.",
      "example": {
        "title": "Real world example title",
        "description": "A relatable real-world example Indian students can connect with. Mention cricket, chai, bikes, trains, or everyday Indian life where relevant.",
        "visual": "ice_melting or ball_rolling or graph_line or chemical_reaction or cell_diagram — pick one that fits"
      },
      "keyTerms": [
        {
          "term": "Technical Term",
          "definition": "Simple one-sentence definition"
        }
      ],
      "hasGraph": true,
      "graph": {
        "type": "line or bar or scatter or none",
        "title": "Graph title",
        "xLabel": "X axis label with units",
        "yLabel": "Y axis label with units",
        "description": "What this graph shows and what student should observe",
        "dataPoints": [
          {"x": 0, "y": 0, "label": "optional point label"},
          {"x": 1, "y": 2},
          {"x": 2, "y": 4},
          {"x": 3, "y": 6}
        ],
        "annotations": [
          {
            "x": 2, "y": 4,
            "text": "Important point to notice here"
          }
        ]
      },
      "formula": {
        "exists": true,
        "latex": "v = u + at",
        "plain": "Final velocity = Initial velocity + (Acceleration × Time)",
        "variables": [
          {"symbol": "v", "meaning": "Final velocity", "unit": "m/s"},
          {"symbol": "u", "meaning": "Initial velocity", "unit": "m/s"},
          {"symbol": "a", "meaning": "Acceleration", "unit": "m/s²"},
          {"symbol": "t", "meaning": "Time", "unit": "s"}
        ]
      },
      "quickCheck": {
        "question": "One simple question to check understanding",
        "answer": "The correct answer with brief explanation"
      }
    }
  ],
  "chapterSummary": "3-4 sentence overall summary of the entire chapter",
  "importantFormulas": [
    {
      "formula": "F = ma",
      "meaning": "Force equals mass times acceleration"
    }
  ],
  "connectsTo": [
    "Name of another chapter or concept this connects to"
  ]
}`

  const response = await fetch(
    'https://api.anthropic.com/v1/messages',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: pdfBase64
                }
              },
              {
                type: 'text',
                text: `Generate complete interactive theory 
for this NCERT chapter: ${topicName} (Class ${standard}).
Cover every single subtopic present in this PDF chapter.
Return only the JSON as specified.`
              }
            ]
          }
        ]
      })
    }
  )

  const data = await response.json()
  
  if (data.error) {
    throw new Error(`Claude API error: ${data.error.message}`)
  }

  const raw = data.content
    .map(block => block.text || '')
    .join('')
    .trim()

  try {
    return JSON.parse(raw)
  } catch (e) {
    const match = raw.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
    throw new Error('Invalid JSON response from Claude')
  }
}
