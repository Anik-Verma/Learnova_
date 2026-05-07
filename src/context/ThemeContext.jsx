import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('sv_theme')
    const dark = saved ? saved === 'dark' : true
    
    // BUG FIX: Synchronous theme application to prevent layout/color flash
    if (dark) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
      document.body.style.background = '#000000'
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
      document.body.style.background = '#f4f6f8'
    }
    
    return dark
  })

  useEffect(() => {
    localStorage.setItem('sv_theme', isDark ? 'dark' : 'light')
    
    // Update theme classes when isDark changes
    if (isDark) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
      document.body.style.background = '#000000'
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
      document.body.style.background = '#f4f6f8'
    }
  }, [isDark])

  const toggleTheme = () => {
    // Add transitioning class to body briefly
    document.body.classList.add('theme-transitioning')
    
    setIsDark(prev => !prev)
    
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning')
    }, 400)
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
