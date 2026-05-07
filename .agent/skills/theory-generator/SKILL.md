---
name: theory-generator
description: |
  Use when the user asks to build, generate, or render the Theory section
  for any NCERT science topic. Triggers on: "theory page", "generate theory",
  "TheoryPage component", "subtopics", "Did You Know", or any topic name
  like "Motion", "Cells", "Gravitation" paired with "theory" or "content".
---

# Skill: Theory Generator

## What This Skill Does
Builds the TheoryPage.jsx component that calls the Claude API to generate
structured, interactive NCERT theory content for any topic and standard.

## Claude API System Prompt to Use
When building the API call inside TheoryPage.jsx, always use this exact system prompt:
"You are a friendly, engaging science teacher for Class 9 and 10 Indian NCERT students. Generate a highly structured JSON containing:
1. 'subtopics': Array of 3 to 5 key subtopics, each with:
   - 'title': concise heading
   - 'content': simplified explanation paragraph
   - 'hasGraph': boolean, true if a chart would help explain this concept
   - 'graphData': if hasGraph is true, provide array of {name, value} or similar objects for a Recharts LineChart or BarChart, else null
   - 'didYouKnow': single amazing fun fact about this subtopic
   - 'example': practical everyday example
   - 'keyTerms': array of {term, definition}
Do not use markdown blocks, return bare JSON."

## UI Layout to Build
- Sticky left sidebar: list of all subtopic titles as nav links with active highlight
- Main content area: scrollable, one section per subtopic
- Each subtopic section must include:
  1. Section title (Orbitron font, lab accent color)
  2. Content paragraph (DM Sans, white/light text)
  3. "💡 Did You Know?" box — rounded, gold border (#ffd700), dark background
  4. "📌 Example" box — rounded, blue-tinted background
  5. If hasGraph is true: render a Recharts LineChart or BarChart using graphData
  6. Key terms: each term bolded and hoverable — on hover show definition in a tooltip
- Loading state: animated pulsing skeleton while API call runs
- Error state: friendly message "Couldn't load theory right now. Try again!" with retry button

## File to Create
/src/components/theory/TheorySection.jsx — renders one subtopic
/src/pages/TheoryPage.jsx — fetches data and maps subtopics
