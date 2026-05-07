import { useState, useEffect } from 'react'
import { QUIZ_DATA_MAP } from '../data/quizDataMap'

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function shuffleOptions(questions) {
  return questions.map(q => {
    const shuffled = shuffleArray(q.options)
    const correct = shuffled.find(o => o.isCorrect)
    return {
      ...q,
      options: shuffled,
      correctId: correct?.id || q.correctId
    }
  })
}

export function useQuiz(topicId) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [cached, setCached] = useState(false)

  useEffect(() => {
    if (!topicId) return

    const quizInfo = QUIZ_DATA_MAP[topicId]
    if (!quizInfo) {
      setError('No quiz available for this topic yet')
      return
    }

    const cacheKey = `sv_quiz_${topicId}`
    const cachedData = localStorage.getItem(cacheKey)

    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData)
        setQuestions(shuffleOptions(parsed))
        setCached(true)
        return
      } catch(e) {
        localStorage.removeItem(cacheKey)
      }
    }

    setLoading(true)
    setError(null)

    async function load() {
      try {
        console.log('Loading quiz from:', quizInfo.file)
        const response = await fetch(quizInfo.file)
        
        if (!response.ok) {
          throw new Error(
            `Quiz not found: ${quizInfo.file}`
          )
        }
        
        const contentType = response.headers.get('content-type')
        if (contentType?.includes('text/html')) {
          throw new Error('Quiz file not found on server')
        }
        
        const data = await response.json()
        const questions = Array.isArray(data) ? data : []
        
        localStorage.setItem(
          cacheKey, 
          JSON.stringify(questions)
        )
        
        setQuestions(shuffleOptions(questions))
        setCached(false)
      } catch(err) {
        console.error('Quiz load error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [topicId])

  const retry = () => {
    localStorage.removeItem(`sv_quiz_${topicId}`)
    setQuestions([])
    setCached(false)
    setError(null)
  }

  const reshuffle = () => {
    setQuestions(prev => shuffleOptions(prev))
  }

  return { 
    questions, 
    loading, 
    error, 
    cached,
    retry,
    reshuffle
  }
}

export function calculateResults(questions, answers) {
  let correct = 0
  const subtopicMap = {}
  const wrongQuestions = []

  questions.forEach((q, i) => {
    const userAnswer = answers[i]
    const isCorrect = userAnswer === q.correctId
    if (isCorrect) correct++
    else wrongQuestions.push({ question: q, userAnswer })

    const key = q.subtopic || 'General'
    if (!subtopicMap[key]) {
      subtopicMap[key] = { total: 0, correct: 0 }
    }
    subtopicMap[key].total++
    if (isCorrect) subtopicMap[key].correct++
  })

  const subtopicResults = Object.entries(subtopicMap)
    .map(([name, data]) => ({
      name,
      total: data.total,
      correct: data.correct,
      percentage: Math.round(
        (data.correct / data.total) * 100
      )
    }))

  return {
    totalQuestions: questions.length,
    correct,
    wrong: questions.length - correct,
    score: Math.round((correct / questions.length) * 100),
    subtopicResults,
    wrongQuestions
  }
}

export function getBadge(score, subject) {
  if (score === 100) return {
    emoji: '🏆',
    title: 'Perfect Score!',
    subtitle: 'Absolutely flawless!',
    color: '#ffd700'
  }
  if (score >= 80) return {
    emoji: subject === 'physics' ? '🚀'
         : subject === 'chemistry' ? '⚛️' : '🌿',
    title: subject === 'physics' ? 'Physics Pro'
         : subject === 'chemistry' ? 'Chem Ace'
         : 'Bio Expert',
    subtitle: 'Outstanding performance!',
    color: subject === 'physics' ? '#00d4ff'
         : subject === 'chemistry' ? '#ffdd4c'
         : '#39ff14'
  }
  if (score >= 55) return {
    emoji: '💪',
    title: 'Good Effort!',
    subtitle: 'Keep practicing!',
    color: '#a8e8ff'
  }
  return {
    emoji: '📚',
    title: 'Keep Studying',
    subtitle: 'Review the theory first',
    color: '#bbc9cf'
  }
}
