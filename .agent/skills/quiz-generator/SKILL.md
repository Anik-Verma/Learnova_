---
name: quiz-generator
description: |
  Use when the user asks to build the Quiz section, quiz component, questions,
  MCQ, scoring, results screen, or progress tracking. Triggers on: "quiz",
  "questions", "MCQ", "score", "results", "explanation", "wrong answer",
  "progress", or any topic name paired with "test" or "quiz".
---

# Skill: Quiz Generator

## What This Skill Does
Builds the QuizPage.jsx component that fetches AI-generated questions via the
Claude API and handles answering, scoring, explanations, and results.

## Claude API System Prompt to Use
"Generate exactly 15 interactive questions for the selected NCERT science topic. Return a pure JSON array of objects. 
Each object must have: 
- 'type': 'mcq' or 'true_false'
- 'question': the prompt text
- 'options': array of string options (or ['True', 'False'])
- 'correctAnswer': the exact string from options
- 'explanation': a simple, encouraging explanation for why it's correct.
Do not use academic jargon. Ensure the tone is very accessible. The response must be pure JSON."

## Quiz UI Flow to Build

### Question Screen
- Progress bar at top: "Question 3 of 15" with animated fill
- Question card (frosted glass, centered)
- For MCQ: 4 option buttons in a 2×2 grid
- For True/False: 2 large buttons
- No "Submit" button — selecting an option triggers immediate feedback

### Feedback States
- Correct: selected option turns green, confetti particle burst animation (use canvas), 1.5s delay then next question
- Wrong: selected option turns red, correct option highlighted green, ExplanationCard slides up from bottom with full explanation, "Next Question →" button appears

### Results Screen (after question 15)
- Large score display: "12 / 15" in gold, animated counter
- Performance breakdown table: subtopic | questions | correct | score%
- Achievement badges (show if earned):
  - 🏆 "Perfect Score!" — 15/15
  - 🚀 "Physics Pro" / ⚛️ "Chem Ace" / 🌿 "Bio Expert" — 12+/15
  - 💪 "Good Effort!" — 8–11/15
  - 📚 "Keep Practicing" — below 8
- Two buttons: "Try Again 🔄" | "Explore More Topics 🔬"
- Save result to localStorage under `edulab_progress` key

## Progress Tracking (localStorage Schema)
```js
// Key: edulab_progress
{
  "Motion_9": { attempts: 2, bestScore: 13, lastScore: 11, lastDate: "2026-04-06" },
  "Cells_9":  { attempts: 1, bestScore: 9,  lastScore: 9,  lastDate: "2026-04-05" }
}
// Key format: "{TopicName}_{Standard}"
```

## Files to Create
/src/pages/QuizPage.jsx
/src/components/quiz/QuizCard.jsx
/src/components/quiz/ExplanationCard.jsx
/src/components/quiz/ResultScreen.jsx
/src/pages/ProgressPage.jsx — reads edulab_progress, renders Recharts BarChart
