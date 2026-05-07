import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuiz, calculateResults, getBadge } from '../hooks/useQuiz';
import { QUIZ_DATA_MAP, SUBJECT_COLORS } from '../data/quizDataMap';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../utils/theme';
import { saveTopicResult } from '../utils/storage';

export default function QuizPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = getTheme(isDark);
  
  const diffStyles = {
    easy: { bg: 'rgba(57,255,20,0.1)', border: '1px solid rgba(57,255,20,0.3)', color: '#39ff14' },
    medium: { bg: 'rgba(255,184,0,0.1)', border: '1px solid rgba(255,184,0,0.3)', color: '#ffb800' },
    hard: { bg: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', color: '#ff4444' }
  };
  
  const quizInfo = QUIZ_DATA_MAP[topicId];
  const accentColor = quizInfo 
    ? SUBJECT_COLORS[quizInfo.subject].primary 
    : '#00d4ff';
  const glowColor = quizInfo
    ? SUBJECT_COLORS[quizInfo.subject].glow
    : 'rgba(0,212,255,0.15)';

  const { questions, loading, error, reshuffle } = useQuiz(topicId);

  const [phase, setPhase] = useState('loading');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [results, setResults] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Timer
  useEffect(() => {
    if (phase !== 'quiz') return;
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  const formatTime = (seconds) => {
    const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
    const ss = (seconds % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  useEffect(() => {
    if (questions.length > 0 && phase === 'loading') {
      setPhase('quiz');
    }
  }, [questions, phase]);

  useEffect(() => {
    if (error) setPhase('error');
  }, [error]);

  const handleAnswer = (optionId) => {
    if (showExplanation) return;
    setAnswers(prev => ({ ...prev, [currentIndex]: optionId }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    setShowHint(false);
    if (currentIndex === questions.length - 1) {
      const res = calculateResults(questions, answers);
      saveTopicResult(topicId, res.score);
      setResults(res);
      setPhase('results');
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Enter' && showExplanation) {
        handleNext();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showExplanation, currentIndex]);

  if (phase === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ background: t.pageBg }}>
        <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mb-6" style={{ borderColor: `${accentColor}44`, borderTopColor: accentColor }} />
        <h2 className="font-orbitron text-lg tracking-widest uppercase mb-2" style={{ color: t.textPrimary }}>Preparing your quiz...</h2>
        <div className="font-space text-xs tracking-[0.2em] mb-4" style={{ color: t.textCaption }}>{quizInfo?.name || topicId}</div>
        <div className="px-3 py-1 rounded-full text-[9px] uppercase font-bold tracking-widest" style={{ background: glowColor, color: accentColor }}>{quizInfo?.subject}</div>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: t.pageBg }}>
        <div className="max-w-md w-full p-8 rounded border backdrop-blur-xl text-center" style={{ background: t.surfaceModal, borderColor: t.borderSubtle }}>
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="font-orbitron text-xl mb-4" style={{ color: t.textPrimary }}>Quiz Coming Soon</h2>
          <p className="font-inter text-sm mb-8 leading-relaxed" style={{ color: t.textSecondary }}>{error || "This quiz is currently being calibrated in our labs. Check back shortly!"}</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate(`/topic/${topicId}/theory`)} className="w-full py-3 border rounded font-space text-[10px] tracking-widest uppercase transition-all" style={{ background: t.surfaceLow, borderColor: t.borderSubtle, color: t.textPrimary }}>Study Theory First</button>
            <button onClick={() => navigate('/dashboard')} className="w-full py-3 rounded font-space text-[10px] tracking-widest uppercase transition-all" style={{ background: accentColor, color: '#003642' }}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'results') {
    const badge = getBadge(results.score, quizInfo?.subject);
    return (
      <div className="min-h-screen flex flex-col pt-24 pb-12 px-6" style={{ background: t.pageBg }}>
        <div className="max-w-3xl mx-auto w-full">
          <div className="text-center mb-12">
            <div className="font-space text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: t.textCaption }}>Quiz Complete</div>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-4">
              <span className="font-orbitron text-7xl md:text-9xl font-black" style={{ color: t.textPrimary }}>{results.score}</span>
              <span className="font-orbitron text-3xl md:text-5xl" style={{ color: accentColor }}>%</span>
            </motion.div>
            <div className="font-inter text-sm tracking-wide" style={{ color: t.textMuted }}>{results.correct} correct out of {results.totalQuestions} questions</div>
          </div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="p-8 rounded border text-center mb-12" style={{ background: t.surfaceCard, borderColor: t.borderSubtle }}>
            <div className="text-6xl mb-4">{badge.emoji}</div>
            <h2 className="font-orbitron text-2xl mb-1 uppercase tracking-widest" style={{ color: badge.color }}>{badge.title}</h2>
            <div className="font-inter text-sm opacity-60" style={{ color: t.textPrimary }}>{badge.subtitle}</div>
          </motion.div>

          {/* Subtopic breakdown */}
          <div className="mb-12">
             <div className="font-space text-[10px] tracking-[0.2em] uppercase mb-6" style={{ color: t.textCaption }}>Performance by Subtopic</div>
             <div className="space-y-6">
                {results.subtopicResults.map((st, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div className="font-inter text-xs" style={{ color: t.textPrimary }}>{st.name}</div>
                      <div className="font-orbitron text-[10px]" style={{ color: st.percentage >= 80 ? accentColor : st.percentage >= 50 ? '#ffdd4c' : '#ff6b6b' }}>{st.percentage}%</div>
                    </div>
                    <div className="w-full h-0.5" style={{ background: t.progressTrack }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${st.percentage}%` }} transition={{ duration: 1, delay: 0.5 + i*0.1 }} className="h-full" style={{ background: st.percentage >= 80 ? accentColor : st.percentage >= 50 ? '#ffdd4c' : '#ff6b6b' }} />
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
             <button onClick={() => { reshuffle(); setPhase('quiz'); setCurrentIndex(0); setAnswers({}); setShowExplanation(false); setTimeElapsed(0); }} className="px-8 py-3 rounded border font-space text-[10px] tracking-widest uppercase transition-all hover:bg-white/5" style={{ borderColor: t.borderSubtle, color: t.textPrimary }}>Try Again 🔄</button>
             <button onClick={() => navigate(`/topic/${topicId}/theory`)} className="px-8 py-3 rounded border font-space text-[10px] tracking-widest uppercase transition-all hover:bg-white/5" style={{ borderColor: t.borderSubtle, color: t.textPrimary }}>Study Theory 📖</button>
             <button onClick={() => navigate('/dashboard')} className="px-8 py-3 rounded font-space text-[10px] tracking-widest uppercase transition-all shadow-xl" style={{ background: accentColor, color: '#003642' }}>Back to Lab 🔬</button>
          </div>
          
          <div className="text-center mt-12 font-inter text-[10px] opacity-40 uppercase tracking-widest" style={{ color: t.textPrimary }}>Progress saved to your profile</div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: '100vh', background: isDark ? '#0a0a0a' : '#f4f6f8' }}>
      
      {/* Top Navbar (Fixed 56px) */}
      <div className="flex items-center justify-between px-6 z-50 border-b shrink-0" 
           style={{ height: '56px', background: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', borderColor: t.borderNavbar }}>
        <button onClick={() => navigate('/dashboard')} 
                className="font-space text-[10px] tracking-[0.15em] uppercase text-muted hover:text-white transition-colors"
                style={{ color: t.textMuted }}>
           ← Back
        </button>
        <div className="font-orbitron text-[14px] font-medium tracking-[0.06em] truncate px-4" style={{ color: t.textPrimary }}>
          {quizInfo?.name}
        </div>
        <div className="font-orbitron font-semibold text-[12px] tracking-widest" style={{ color: accentColor }}>
          ⏱ {formatTime(timeElapsed)}
        </div>
      </div>

      {/* Progress Bar Row (Fixed 40px) */}
      <div className="flex items-center justify-between px-6 z-40 border-b shrink-0" 
           style={{ height: '40px', background: t.pageBg, borderColor: t.borderSubtle }}>
        <div className="font-space text-[10px] font-medium tracking-[0.15em] uppercase" style={{ color: t.textMuted }}>
          Question {String(currentIndex + 1).padStart(2, '0')} of {questions.length}
        </div>
        
        <div className="flex-1 flex justify-center">
          <span className="font-space text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-[2px]"
                style={diffStyles[currentQ.difficulty] || diffStyles.medium}>
            {currentQ.difficulty}
          </span>
        </div>

        <div className="font-orbitron font-bold text-[11px] uppercase tracking-wider" style={{ color: '#39ff14' }}>
          ✓ {Object.values(answers).filter((a, i) => a === questions[i].correctId).length}
        </div>
      </div>

      {/* Dynamic Progress Indicator (Hairsbreadth under info row) */}
      <div className="w-full h-[2px]" style={{ background: t.progressTrack }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full transition-all duration-300" 
                    style={{ background: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
      </div>

      {/* Main Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex justify-center items-start scrollbar-hide" 
           style={{ padding: '40px 24px 140px 24px' }}>
        <div className="w-full mx-auto" style={{ maxWidth: '680px' }}>
          <AnimatePresence mode="wait">
            <motion.div key={currentIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
              
              <div className="inline-flex px-3 py-1 font-space text-[9px] font-bold uppercase tracking-[0.2em] rounded-[2px] mb-4" 
                   style={{ background: t.topicRowBg, border: `1px solid ${t.borderSubtle}`, color: t.textCaption }}>
                {currentQ.subtopic}
              </div>
              
              <div className="mb-8">
                <h2 className="font-inter font-medium leading-[1.7]" style={{ fontSize: '18px', color: t.textPrimary }}>
                  <span className="font-orbitron font-bold mr-3 opacity-40 shadow-sm" style={{ color: accentColor }}>Q{String(currentIndex+1).padStart(2,'0')}</span>
                  {currentQ.question}
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {currentQ.options.map((opt) => {
                  const isAnswered = answers[currentIndex] !== undefined;
                  const isSelected = answers[currentIndex] === opt.id;
                  const isCorrect = opt.id === currentQ.correctId;
                  
                  let borderColor = t.borderSubtle;
                  let bgColor = isDark ? 'rgba(25,25,25,0.8)' : 'rgba(255,255,255,0.9)';
                  let letterBorder = t.borderInput;
                  let letterColor = t.textMuted;
                  let letterBg = 'transparent';

                  if (isAnswered) {
                    if (isCorrect) {
                       borderColor = '#39ff14';
                       bgColor = 'rgba(57,255,20,0.06)';
                       letterBorder = '#39ff14';
                       letterColor = isDark ? '#000' : '#fff';
                       letterBg = '#39ff14';
                    } else if (isSelected) {
                       borderColor = '#ff4444';
                       bgColor = 'rgba(255,68,68,0.06)';
                       letterBorder = '#ff4444';
                       letterColor = '#fff';
                       letterBg = '#ff4444';
                    } else {
                       // No changes for other options
                    }
                  }

                  return (
                    <button 
                      key={opt.id}
                      disabled={isAnswered}
                      onClick={() => handleAnswer(opt.id)}
                      className="group w-full flex items-center gap-4 transition-all duration-200 border box-border hover:border-accent"
                      style={{ 
                        padding: '14px 20px', 
                        borderRadius: '2px',
                        background: bgColor, 
                        borderColor: isSelected ? borderColor : t.borderSubtle,
                        opacity: isAnswered && !isSelected && !isCorrect ? 0.4 : 1,
                        boxShadow: isSelected ? `0 0 15px ${borderColor}22` : 'none'
                      }}
                    >
                      <div className="flex items-center justify-center rounded-[2px] border font-orbitron font-bold shrink-0 transition-all" 
                           style={{ width: '36px', height: '36px', minWidth: '36px', fontSize: '13px', borderColor: letterBorder, color: letterColor, background: letterBg, boxShadow: isSelected ? `0 0 10px ${letterBorder}44` : 'none' }}>
                        {opt.id}
                      </div>
                      <div className="flex-1 font-inter font-normal leading-relaxed" style={{ fontSize: '14px', color: t.textPrimary }}>
                        {opt.text}
                      </div>
                      {isAnswered && isCorrect && <div className="text-[#39ff14] text-lg">✓</div>}
                      {isAnswered && isSelected && !isCorrect && <div className="text-[#ff4444] text-lg">✗</div>}
                    </button>
                  );
                })}
              </div>

              {/* Hint Trigger */}
              {!answers[currentIndex] && (
                <div className="mt-8 flex justify-center">
                  {showHint ? (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="w-full p-4 rounded border-l-2 bg-black/20" style={{ borderColor: accentColor }}>
                      <div className="font-inter text-xs italic tracking-wide" style={{ color: t.textSecondary }}>{currentQ.hint}</div>
                    </motion.div>
                  ) : (
                    <button onClick={() => setShowHint(true)} 
                            className="font-space text-[11px] font-medium tracking-[0.2em] uppercase opacity-40 hover:opacity-100 transition-all cursor-pointer">
                      💡 Need a hint?
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Explanation Panel (Fixed Bottom with Blur) */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }} 
                      className="fixed bottom-0 left-0 right-0 z-50 border-t shadow-2xl overflow-hidden" 
                      style={{ background: isDark ? 'rgba(10,10,10,0.98)' : 'rgba(252,253,255,0.98)', backdropFilter: 'blur(24px)', borderColor: answers[currentIndex] === currentQ.correctId ? '#39ff14' : '#ff4444', padding: '20px 24px' }}>
             
             <div className="mx-auto flex flex-col md:flex-row gap-6 items-start justify-between" style={{ maxWidth: '680px' }}>
                <div className="flex-1">
                   <div className="flex items-center gap-3 mb-3">
                      <div className="font-orbitron text-[10px] font-bold tracking-[0.2em]" style={{ color: answers[currentIndex] === currentQ.correctId ? '#39ff14' : '#ff4444' }}>
                        {answers[currentIndex] === currentQ.correctId ? 'CORRECT!' : 'INCORRECT'}
                      </div>
                   </div>
                   
                   {answers[currentIndex] !== currentQ.correctId && (
                     <div className="font-inter text-[13px] mb-4" style={{ color: t.textSecondary }}>
                       CORRECT ANSWER: <span className="font-bold">{currentQ.options.find(o => o.id === currentQ.correctId)?.text}</span>
                     </div>
                   )}

                   <p className="font-inter text-[14px] leading-relaxed" style={{ color: t.textSecondary }}>
                     {currentQ.explanation.main}
                   </p>
                </div>

                <div className="w-full md:w-auto flex flex-col items-center gap-2">
                   <button onClick={handleNext} className="w-full md:w-44 py-3 rounded-[2px] font-space text-[12px] font-bold tracking-widest uppercase transition-all shadow-lg active:scale-95" 
                           style={{ background: accentColor, color: '#003642' }}>
                      {currentIndex === questions.length - 1 ? "Results" : "Next"}
                   </button>
                   <div className="font-inter text-[9px] font-medium opacity-30 tracking-widest uppercase mt-1" style={{ color: t.textMuted }}>Enter ⏎</div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
