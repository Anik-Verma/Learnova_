import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useLocation } from 'react-router-dom';
import { useAssistant } from '../../context/AssistantContext';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../utils/theme';

export default function AIAssistant() {
  const { 
    isOpen, openAssistant, setIsOpen, messages, setMessages,
    isTyping, retryCount, apiStatus, sendMessage, clearChat,
    currentTopic, currentPage
  } = useAssistant();
  const { isDark } = useTheme();
  const t = getTheme(isDark);
  const location = useLocation();
  
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const accentColor = '#00d4ff';

  const HINT_KEY = 'sv_scibot_hint_shown';
  const [showHint, setShowHint] = useState(!localStorage.getItem(HINT_KEY));

  useEffect(() => {
    if (showHint) {
      const timer = setTimeout(() => {
        setShowHint(false);
        localStorage.setItem(HINT_KEY, 'true');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showHint]);

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 480 : false;

  const hideOnPages = ['/login', '/register', '/forgot-password'];
  const shouldHide = hideOnPages.includes(location.pathname);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const prevPathRef = useRef(location.pathname);
  
  useEffect(() => {
    // If path changed and chat is open
    if (prevPathRef.current !== location.pathname && isOpen) {
      setIsOpen(false);
    }
    // Update the ref to current path
    prevPathRef.current = location.pathname;
  }, [location.pathname, isOpen, setIsOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  if (shouldHide) return null;

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    setShowSuggestions(false);
    sendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (text) => {
    setShowSuggestions(false);
    sendMessage(text);
  };

  const getDynamicSuggestions = () => {
    if (currentPage === 'Quiz') {
      return [
        'Give me a hint for this topic',
        'Explain the key concepts I should remember',
        'What are common mistakes in this chapter?',
        'Give me a quick summary'
      ];
    }
    
    if (currentPage === 'Theory') {
      return [
        'Explain this in simpler terms',
        'Give me a real world example',
        'What is the most important formula here?',
        'How does this connect to daily life?'
      ];
    }
    
    if (currentPage === 'Simulation') {
      return [
        'What should I observe in this experiment?',
        'What does this simulation teach?',
        'How do I interpret these results?',
        'What variables should I change first?'
      ];
    }
    
    return [
      "Explain Newton's Second Law simply",
      "What is the difference between speed and velocity?",
      "How does photosynthesis work?",
      "What is the pH scale?"
    ];
  };

  const suggestions = getDynamicSuggestions();

  return (
    <>
      {/* FLOATING BUTTON */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="scibot-button"
            className="scibot-float-btn"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            onClick={openAssistant}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00d4ff, #0090b3)',
              border: '2px solid rgba(255,255,255,0.2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2147483647,
              boxShadow: '0 4px 24px rgba(0,212,255,0.5), 0 2px 8px rgba(0,0,0,0.4)',
              pointerEvents: 'all',
              transform: 'translateZ(0)',
              willChange: 'transform',
              isolation: 'isolate'
            }}
          >
            <span style={{ fontSize: 26 }}>🔬</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* PULSING HINT LABEL */}
      {!isOpen && showHint && (
        <div style={{
          position: 'fixed',
          bottom: 88,
          right: 24,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0,212,255,0.3)',
          borderRadius: '8px 8px 2px 8px',
          padding: '8px 12px',
          zIndex: 999997,
          pointerEvents: 'none',
          animation: 'fadeInUp 0.4s ease'
        }}>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, color: '#00d4ff', whiteSpace: 'nowrap' }}>
            🔬 Ask SciBot anything!
          </div>
          <div style={{ fontFamily: 'Inter', fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
            Your AI science tutor
          </div>
          <div style={{
            position: 'absolute', bottom: -6, right: 16, width: 0, height: 0,
            borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
            borderTop: '6px solid rgba(0,212,255,0.3)'
          }}/>
        </div>
      )}

      {/* PULSE ANIMATION & GLOBAL STYLES */}
      <style>{`
        @keyframes pulse-ring {
          0% { box-shadow: 0 4px 20px rgba(0,212,255,0.4), 0 0 0 0 rgba(0,212,255,0.3); }
          70% { box-shadow: 0 4px 20px rgba(0,212,255,0.4), 0 0 0 12px rgba(0,212,255,0); }
          100% { box-shadow: 0 4px 20px rgba(0,212,255,0.4), 0 0 0 0 rgba(0,212,255,0); }
        }
        .scibot-message p { margin: 0 0 8px 0; }
        .scibot-message p:last-child { margin-bottom: 0; }
        .scibot-message ul { margin: 6px 0; padding-left: 20px; }
        .scibot-message li { margin-bottom: 4px; }
        .scibot-message strong { color: ${accentColor}; }
        .scibot-message code {
          background: rgba(0,212,255,0.1);
          padding: 1px 6px;
          border-radius: 2px;
          font-family: 'Orbitron', monospace;
          font-size: 0.85em;
        }
      `}</style>

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* BACKDROP (mobile) */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.5)',
                  zIndex: 998
                }}
              />
            )}

            <motion.div
              className="scibot-chat-window"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ 
                type: 'spring', 
                damping: 25, 
                stiffness: 300,
                duration: 0.2
              }}
              style={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                width: isMobile ? 'calc(100vw - 48px)' : 380,
                height: isMobile ? '70vh' : 580,
                zIndex: 999998,
                display: 'flex',
                flexDirection: 'column',
                background: isDark ? 'rgba(10,12,10,0.97)' : 'rgba(252,253,252,0.97)',
                backdropFilter: 'blur(24px)',
                border: `1px solid rgba(0,212,255,0.2)`,
                borderRadius: '12px 12px 4px 4px',
                overflow: 'hidden',
                boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,212,255,0.1)`
              }}
            >
              {/* HEADER */}
              <div style={{
                padding: '14px 16px',
                background: isDark ? 'rgba(0,212,255,0.08)' : 'rgba(0,212,255,0.06)',
                borderBottom: `1px solid rgba(0,212,255,0.15)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${accentColor}, #0090b3)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, flexShrink: 0
                  }}>
                    🔬
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'Orbitron', fontSize: 13, fontWeight: 700,
                      color: accentColor, letterSpacing: '0.05em'
                    }}>
                      SciBot
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                      {isTyping ? (
                        <span style={{
                          fontSize: 9,
                          color: '#39ff14',
                          fontFamily: 'Space Grotesk',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase'
                        }}>● THINKING...</span>
                      ) : (
                        <>
                          {apiStatus === 'good' && (
                            <span style={{
                              fontSize: 9,
                              color: '#39ff14',
                              fontFamily: 'Space Grotesk',
                              letterSpacing: '0.15em'
                            }}>● ONLINE</span>
                          )}

                          {apiStatus === 'limited' && (
                            <span style={{
                              fontSize: 9,
                              color: '#ffdd4c',
                              fontFamily: 'Space Grotesk',
                              letterSpacing: '0.15em'
                            }}>● LIMITED</span>
                          )}

                          {apiStatus === 'exhausted' && (
                            <span style={{
                              fontSize: 9,
                              color: '#ff4444',
                              fontFamily: 'Space Grotesk',
                              letterSpacing: '0.15em'
                            }}>● DAILY LIMIT</span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <button
                    onClick={clearChat}
                    title="Clear chat"
                    style={{
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      color: t.textMuted, fontSize: 14, padding: '6px 8px',
                      borderRadius: 4, display: 'flex', alignItems: 'center'
                    }}
                  >
                    🗑️
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    style={{
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      color: t.textMuted, fontSize: 18, padding: '4px 8px',
                      borderRadius: 4, lineHeight: 1
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* MESSAGES AREA */}
              <div style={{
                flex: 1, overflowY: 'auto', padding: '16px',
                display: 'flex', flexDirection: 'column', gap: 12,
                scrollbarWidth: 'thin', scrollbarColor: `rgba(0,212,255,0.2) transparent`
              }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                      gap: 8, alignItems: 'flex-end'
                    }}
                  >
                    {message.role === 'assistant' && (
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: `linear-gradient(135deg, ${accentColor}, #0090b3)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, flexShrink: 0, marginBottom: 2
                      }}>
                        🔬
                      </div>
                    )}

                    <div style={{
                      maxWidth: '78%', padding: '10px 14px',
                      borderRadius: message.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      background: message.role === 'user'
                        ? `linear-gradient(135deg, ${accentColor}, #0090b3)`
                        : isDark 
                          ? message.isError ? 'rgba(255,68,68,0.1)' : 'rgba(255,255,255,0.04)'
                          : message.isError ? 'rgba(255,68,68,0.08)' : 'rgba(0,0,0,0.04)',
                      border: message.role === 'assistant'
                        ? `1px solid ${message.isError ? 'rgba(255,68,68,0.2)' : 'rgba(255,255,255,0.06)'}`
                        : 'none',
                      color: message.role === 'user' ? '#003642' : t.textPrimary,
                      fontSize: 13, lineHeight: 1.6, fontFamily: 'Inter'
                    }}>
                      <div className="scibot-message">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                      
                      {message.isError && 
                       !message.content.includes('Too many') &&
                       !message.content.includes('API') && (
                        <button
                          onClick={() => {
                            // Remove the error message
                            setMessages(prev => 
                              prev.filter(m => m.id !== message.id)
                            )
                            // Find the last user message and resend it
                            const lastUserMsg = messages
                              .filter(m => m.role === 'user')
                              .pop()
                            if (lastUserMsg) {
                              sendMessage(lastUserMsg.content)
                            }
                          }}
                          style={{
                            marginTop: 8,
                            padding: '5px 12px',
                            background: 'transparent',
                            border: '1px solid rgba(0,212,255,0.3)',
                            borderRadius: 4,
                            color: '#00d4ff',
                            fontFamily: 'Space Grotesk',
                            fontSize: 10,
                            cursor: 'pointer',
                            letterSpacing: '0.1em'
                          }}
                        >
                          🔄 Try Again
                        </button>
                      )}

                      <div style={{
                        fontSize: 9, color: message.role === 'user' ? 'rgba(0,54,66,0.6)' : t.textMuted,
                        marginTop: 6, fontFamily: 'Space Grotesk', letterSpacing: '0.05em'
                      }}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    {message.role === 'user' && (
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)', border: `1px solid rgba(0,212,255,0.3)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, flexShrink: 0, marginBottom: 2,
                        color: accentColor, fontFamily: 'Orbitron', fontWeight: 700
                      }}>
                        S
                      </div>
                    )}
                  </div>
                ))}

                {/* TYPING INDICATOR */}
                {isTyping && (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${accentColor}, #0090b3)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, flexShrink: 0
                    }}>
                      🔬
                    </div>
                    <div style={{
                      padding: '12px 16px', borderRadius: '12px 12px 12px 2px',
                      background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      display: 'flex', flexDirection: 'column', gap: 6
                    }}>
                      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                        {[0,1,2].map(i => (
                          <div key={i} style={{
                            width: 7, height: 7, borderRadius: '50%',
                            background: accentColor,
                            animation: `bounce 1.2s ease-in-out ${i*0.2}s infinite`
                          }}/>
                        ))}
                      </div>
                      
                      {retryCount > 1 && (
                        <div style={{
                          fontSize: 9,
                          color: 'rgba(255,180,60,0.7)',
                          fontFamily: 'Space Grotesk',
                          letterSpacing: '0.05em'
                        }}>
                          Retrying... ({retryCount}/3)
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <style>{`
                  @keyframes bounce {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30% { transform: translateY(-6px); opacity: 1; }
                  }
                `}</style>

                {/* SUGGESTIONS */}
                {showSuggestions && messages.length === 1 && (
                  <div style={{ marginTop: 4 }}>
                    <div style={{
                      fontFamily: 'Space Grotesk', fontSize: 9, color: t.textCaption,
                      letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8
                    }}>
                      Try asking:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestion(s)}
                          style={{
                            padding: '6px 10px', background: 'rgba(0,212,255,0.06)',
                            border: '1px solid rgba(0,212,255,0.2)', borderRadius: 20,
                            color: accentColor, fontFamily: 'Inter', fontSize: 11,
                            cursor: 'pointer', lineHeight: 1.4, textAlign: 'left',
                            transition: 'all 0.2s'
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* INPUT AREA */}
              <div style={{
                padding: '12px', borderTop: `1px solid ${t.borderSubtle}`,
                background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)',
                flexShrink: 0
              }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything about science..."
                    rows={1}
                    style={{
                      flex: 1, background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                      border: `1px solid ${t.borderSubtle}`, borderRadius: 8,
                      padding: '10px 12px', color: t.textPrimary, fontFamily: 'Inter',
                      fontSize: 13, resize: 'none', outline: 'none', lineHeight: 1.5,
                      maxHeight: 100, overflowY: 'auto', transition: 'border-color 0.2s'
                    }}
                    onInput={e => {
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                    }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    style={{
                      width: 40, height: 40, borderRadius: 8,
                      background: input.trim() && !isTyping ? `linear-gradient(135deg, ${accentColor}, #0090b3)` : 'rgba(255,255,255,0.06)',
                      border: 'none', cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.2s', fontSize: 16
                    }}
                  >
                    {isTyping ? '⏳' : '↑'}
                  </button>
                </div>
                <div style={{
                  marginTop: 8, fontFamily: 'Space Grotesk', fontSize: 9,
                  color: t.textMuted, letterSpacing: '0.1em', textAlign: 'center'
                }}>
                  Press Enter to send · Shift+Enter for new line
                </div>

                <div style={{
                  textAlign: 'center',
                  marginTop: 4,
                  fontFamily: 'Space Grotesk',
                  fontSize: 8,
                  color: t.textMuted,
                  letterSpacing: '0.1em',
                  opacity: 0.5
                }}>
                  Powered by Google Gemini · Free AI
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
