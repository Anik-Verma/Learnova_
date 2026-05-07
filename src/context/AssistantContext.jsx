import { createContext, useContext, useState, useCallback, useRef } from 'react';

const AssistantContext = createContext();

/*
TO GET MORE QUOTA:
1. Go to aistudio.google.com
2. Click your profile → "New Project" 
   (important: NEW PROJECT not new key in same project)
3. Create a new API key in the new project
4. Add it to .env as VITE_GEMINI_API_KEY_2
5. The code below uses both keys alternately
*/

async function callGeminiAPI(messages, systemPrompt) {
  const apiKey1 = import.meta.env.VITE_GEMINI_API_KEY
  const apiKey2 = import.meta.env.VITE_GEMINI_API_KEY_2
  
  if (!apiKey1) throw new Error('NO_API_KEY')
  
  const API_KEYS = [apiKey1, apiKey2].filter(Boolean)
  
  const MODELS = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash-lite',
  ]
  
  // Build conversation history
  const filteredMessages = messages
    .filter(m => m.content && m.content.trim() !== '')
    .filter((_, i) => i > 0)
    .slice(-6)
  
  const conversationHistory = []
  let lastRole = null
  
  for (const msg of filteredMessages) {
    const role = msg.role === 'assistant' ? 'model' : 'user'
    if (role === lastRole && conversationHistory.length > 0) {
      conversationHistory[conversationHistory.length - 1]
        .parts[0].text += '\n' + msg.content
    } else {
      conversationHistory.push({
        role,
        parts: [{ text: msg.content }]
      })
      lastRole = role
    }
  }
  
  while (conversationHistory.length > 0 && 
         conversationHistory[0].role === 'model') {
    conversationHistory.shift()
  }
  
  // If no history just use current message
  if (conversationHistory.length === 0) {
    const lastUserMsg = messages
      .filter(m => m.role === 'user')
      .pop()
    if (lastUserMsg) {
      conversationHistory.push({
        role: 'user',
        parts: [{ text: lastUserMsg.content }]
      })
    }
  }
  
  const requestBody = {
    system_instruction: {
      parts: [{ text: systemPrompt }]
    },
    contents: conversationHistory,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 800,
    }
  }
  
  // Try every combination of key + model
  for (const apiKey of API_KEYS) {
    for (const model of MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
        
        const controller = new AbortController()
        const timeoutId = setTimeout(
          () => controller.abort(), 15000
        )
        
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        const data = await response.json()
        
        if (data.error) {
          const code = data.error.code
          console.log(`${model} (key${API_KEYS.indexOf(apiKey)+1}): error ${code}`)
          
          // Skip to next combination
          continue
        }
        
        const text = data.candidates?.[0]
          ?.content?.parts?.[0]?.text
        
        if (!text) {
          console.log(`${model}: empty response, trying next`)
          continue
        }
        
        console.log(`SciBot: success with ${model} key${API_KEYS.indexOf(apiKey)+1}`)
        return text
        
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log(`${model}: timeout`)
        } else {
          console.log(`${model}: ${err.message}`)
        }
        continue
      }
    }
  }
  
  // Every key + model combination failed
  throw new Error('ALL_MODELS_EXHAUSTED')
}

export function AssistantProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `Hi! I'm **SciBot** 🔬 — your personal science assistant!

I can help you with:
- 📖 Explaining theory concepts
- 🧪 Understanding simulations
- 🧠 Quiz preparation
- ⚗️ Solving science problems

What would you like to learn today?`,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [apiStatus, setApiStatus] = useState('good');
  const [currentTopic, setCurrentTopic] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);

  const sendMessage = useCallback(async (userMessage) => {
    // 1. Add user message to chat
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const systemPrompt = buildSystemPrompt(currentTopic, currentPage);
      const allMessages = [...messages, userMsg];
      
      const responseText = await callGeminiAPI(allMessages, systemPrompt, setRetryCount, setApiStatus);

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
      setApiStatus('good');
    } catch (error) {
      let errorContent = ''
      
      if (error.message === 'ALL_MODELS_EXHAUSTED') {
        setApiStatus('exhausted')
        errorContent = `⏳ **Daily limit reached**\n\nOur AI assistant has reached its free daily limit.\nIt resets automatically at midnight (IST ~1:30 PM).\n\n**Meanwhile you can:**\n- 📖 Read theory sections\n- 🧪 Try simulations\n- 🧠 Take a quiz\n\nSee you tomorrow! 😊`
      } else if (error.message === 'API_KEY_ERROR' ||
                 error.message === 'NO_API_KEY') {
        errorContent = `⚠️ **API key issue**\n\nPlease check the Gemini API key in your .env file.\nGet a free key at aistudio.google.com`
      } else {
        errorContent = `🔄 **Connection hiccup!**\n\nPlease try again — usually works right away! 😊`
      }
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: errorContent,
        timestamp: new Date(),
        isError: true
      }])
    } finally {
      setIsTyping(false);
    }
  }, [messages, currentTopic, currentPage]);

  const clearChat = () => {
    setMessages([{
      id: 1,
      role: 'assistant',
      content: `Chat cleared! I'm ready to help. What science question can I answer for you? 🔬`,
      timestamp: new Date()
    }]);
  };

  const openAssistant = () => {
    if (messages.length === 1 && currentTopic) {
      setMessages([{
        id: 1,
        role: 'assistant',
        content: `Hi! I see you're studying **${currentTopic}**! 🔬

I can help you:
- Explain difficult concepts simply
- Solve problems step by step
- Prepare for your quiz
- Connect topics to real life

What would you like to know? 😊`,
        timestamp: new Date()
      }]);
    }
    setIsOpen(true);
  };

  return (
    <AssistantContext.Provider value={{
      isOpen, setIsOpen, openAssistant,
      messages, setMessages, isTyping, retryCount,
      apiStatus, setApiStatus,
      sendMessage, clearChat,
      currentTopic, setCurrentTopic,
      currentPage, setCurrentPage
    }}>
      {children}
    </AssistantContext.Provider>
  );
}

export const useAssistant = () => useContext(AssistantContext);

function buildSystemPrompt(topic, page) {
  let context = '';
  
  if (topic) {
    context += `The student is currently studying: ${topic}. `;
  }
  if (page) {
    context += `They are on the ${page} page. `;
  }

  return `You are SciBot, a friendly AI science assistant for Learnova, powered by Google Gemini.
You help Indian students in Class 9 and 10 understand NCERT Science concepts.

${context}

YOUR PERSONALITY:
- Friendly, encouraging and patient
- Use simple language (14-16 year old level)
- Give relatable Indian examples (cricket, trains, chai, auto-rickshaws, festivals)
- Use emojis occasionally to be engaging
- Celebrate when students get things right

YOUR KNOWLEDGE:
- NCERT Class 9 Science: Motion, Laws of Motion, Gravitation, Matter, Atoms & Molecules, Structure of Atoms, Cells, Tissues
- NCERT Class 10 Science: Light, Human Eye, Acids Bases Salts, Carbon Compounds, Life Processes, Control & Coordination

RESPONSE RULES:
- Keep responses concise (3-5 sentences max for simple questions)
- For complex topics: use bullet points
- Always relate to NCERT curriculum
- If asked non-science questions: politely redirect
- Use **bold** for important terms
- Use simple formulas when needed
- End responses with a follow-up question to keep student engaged

NEVER:
- Give wrong scientific information
- Be discouraging or negative
- Answer questions completely unrelated to science
- Write very long paragraphs`;
}
