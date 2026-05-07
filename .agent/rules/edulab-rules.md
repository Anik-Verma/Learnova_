# EduLab — Project Rules (Always Active)

## Project Identity
- App name: EduLab
- Audience: Class 9 and Class 10 NCERT science students (India), ages 14–16
- Purpose: Interactive science learning via animated labs, simulations, AI theory, and quizzes
- All language must be simple, friendly, and student-appropriate — never complex or academic

## Tech Stack (Never Deviate)
- Framework: React with functional components and hooks only
- Styling: Tailwind CSS utility classes only — no custom CSS files unless for canvas/animations
- Animation: Framer Motion for page transitions and UI animations
- Canvas: HTML5 Canvas or SVG for lab backgrounds and simulations
- Charts: Recharts for all data visualizations
- Routing: react-router-dom v6
- Storage: localStorage only — no backend, no database
- AI: Anthropic Claude API (claude-sonnet-4-20250514) for theory and quiz generation

## Claude API — Always Use This Pattern
```js
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }]
  })
});
const data = await response.json();
const raw = data.content.map(b => b.text || "").join("");
return JSON.parse(raw.replace(/```json|```/g, "").trim());
```

## Design Rules (Non-Negotiable)
- Background: Always #0a0f1e (dark navy/space theme)
- Physics accent: #00d4ff (electric blue)
- Chemistry accent: #39ff14 (neon green)
- Biology accent: #ff6b6b (coral red)
- Gold accent: #ffd700 (badges, highlights)
- All cards: frosted glass — `backdrop-filter: blur(12px)` + `background: rgba(255,255,255,0.05)`
- Display font: Orbitron (Google Fonts) — headings and lab titles only
- Body font: DM Sans (Google Fonts) — all paragraph and UI text
- Never use: Inter, Roboto, Arial, purple gradients on white, or generic card layouts

## Component Rules
- Never use HTML `<form>` tags — use onClick handlers only
- Every page transition must use Framer Motion AnimatePresence
- All simulations must have: a canvas/SVG area, a control panel with sliders, a Reset button, and a Run button
- All lab background animations must run on HTML5 Canvas using requestAnimationFrame
- Never hardcode topic lists — always filter from the topics.js data file based on student's stored standard (Class 9 or Class 10)

## State & Data Rules
- Student data (name, email, standard) stored in localStorage key: `edulab_student`
- Quiz progress stored in localStorage key: `edulab_progress`
- Always read student standard from localStorage before rendering any topic list
- Progress tracker must update after every quiz attempt

## Code Quality Rules
- Every component file must have a JSDoc comment at the top explaining its purpose
- No inline styles except for dynamic canvas values
- All Claude API calls must be wrapped in try/catch with a user-visible error state
- Every simulation must have a loading state while canvas initializes
