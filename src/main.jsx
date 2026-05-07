import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { AssistantProvider } from './context/AssistantContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AssistantProvider>
        <App />
      </AssistantProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
