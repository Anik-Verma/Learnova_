import { useTheme } from '../../context/ThemeContext'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      marginBottom: 20
    }}>
      
      {/* Label left side */}
      <div style={{ display:'flex', 
        alignItems:'center', gap:10 }}>
        
        {/* Moon or Sun icon */}
        <span style={{ 
          fontSize: 16,
          transition: 'all 0.3s'
        }}>
          {isDark ? '🌙' : '☀️'}
        </span>
        
        <span style={{
          font: '500 9px Space Grotesk',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: isDark ? '#bbc9cf' : '#666666'
        }}>
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      </div>

      {/* Toggle switch */}
      <motion.div
        onClick={toggleTheme}
        style={{
          width: 52,
          height: 28,
          borderRadius: 2,
          background: isDark ? '#00d4ff' : 'rgba(0,0,0,0.1)',
          position: 'relative',
          cursor: 'pointer',
          flexShrink: 0,
          boxShadow: isDark 
            ? '0 0 12px rgba(0,212,255,0.4)' 
            : 'none',
          transition: 'background 0.3s, box-shadow 0.3s'
        }}
      >
        {/* Icons inside track */}
        <span style={{
          position: 'absolute',
          left: 7, top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 10,
          opacity: isDark ? 0 : 0.5,
          transition: 'opacity 0.3s'
        }}>☀️</span>
        
        <span style={{
          position: 'absolute',
          right: 7, top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 10,
          opacity: isDark ? 0.8 : 0,
          transition: 'opacity 0.3s'
        }}>🌙</span>

        {/* Sliding thumb */}
        <motion.div
          animate={{ x: isDark ? 26 : 2 }}
          transition={{ 
            type: 'spring', 
            damping: 20, 
            stiffness: 300 
          }}
          style={{
            position: 'absolute',
            top: 3,
            width: 22,
            height: 22,
            borderRadius: 2,
            background: isDark ? '#003642' : '#ffffff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
          }}
        />
      </motion.div>
    </div>
  )
}
