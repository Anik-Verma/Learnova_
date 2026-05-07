import katex from 'katex'
import { useEffect, useRef } from 'react'

export default function FormulaRenderer({ 
  latex, 
  display = false,
  color = '#00d4ff' 
}) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current || !latex) return
    
    try {
      katex.render(latex, ref.current, {
        displayMode: display,
        throwOnError: false,
        errorColor: '#ff4444',
        macros: {
          "\\degree": "^{\\circ}"
        }
      })
      
      if (ref.current) {
        ref.current.style.color = color
      }
    } catch (e) {
      if (ref.current) {
        ref.current.textContent = latex
      }
    }
  }, [latex, display, color])

  return (
    <span 
      ref={ref}
      style={{
        display: display ? 'block' : 'inline',
        textAlign: display ? 'center' : 'left',
        margin: display ? '12px 0' : '0 4px',
        fontSize: display ? '1.3em' : '1em'
      }}
    />
  )
}
