import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheory } from '../hooks/useTheory';
import { SUBJECT_COLORS } from '../data/topicPDFMap';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../utils/theme';
import SubtopicSection from '../components/theory/SubtopicSection';
import TheorySidebar from '../components/theory/TheorySidebar';
import ThemeToggle from '../components/shared/ThemeToggle';

export default function TheoryPage() {
  const { topicId } = useParams();
  console.log('TopicId from URL:', topicId);
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = getTheme(isDark);
  
  const { data, loading, error } = useTheory(topicId);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeId, setActiveId] = useState('');
  const contentRef = useRef(null);

  const accentColor = useMemo(() => {
    if (!data) return '#00d4ff';
    return SUBJECT_COLORS[data.subject]?.primary || '#00d4ff';
  }, [data]);

  const handleScroll = () => {
    if (!contentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(Math.min(100, progress));
    setShowScrollTop(scrollTop > 400);
    
    // Update active subtopic
    if (!data?.subtopics) return;
    for (let i = data.subtopics.length - 1; i >= 0; i--) {
      const el = document.getElementById(data.subtopics[i].id);
      if (el) {
        const rect = el.getBoundingClientRect();
        // Since contentRef is scrollable, getBoundingClientRect is relative to viewport
        // But the subtopics are inside the scrollable area.
        // rect.top <= 150 works if the subtopic reaches the top of the viewport
        if (rect.top <= 150) {
          setActiveId(data.subtopics[i].id);
          break;
        }
      }
    }
  };

  const scrollToSubtopic = (id) => {
    const el = document.getElementById(id);
    if (el && contentRef.current) {
      // Use scrollTo on the container
      const container = contentRef.current;
      const targetY = el.offsetTop - 20;
      container.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: t.bgBase }}>
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full mb-6"
          style={{ borderColor: accentColor, borderTopColor: 'transparent' }}
        />
        <div className="font-orbitron text-xs tracking-widest uppercase" style={{ color: t.textMuted }}>Initializing Theory Matrix...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
       <div className="min-h-screen flex items-center justify-center p-6" style={{ background: t.bgBase }}>
         <div className="max-w-md p-10 border border-white/5 bg-white/5 backdrop-blur-xl text-center">
            <div className="text-4xl mb-4">🗃️</div>
            <h2 className="font-orbitron text-xl mb-4" style={{ color: t.textHeading }}>Theory Archive Unreachable</h2>
            <p className="text-sm mb-8" style={{ color: t.textMuted }}>{error || 'Data packet lost in transit.'}</p>
            <button onClick={() => navigate('/dashboard')} className="px-8 py-3 bg-accent text-dark font-bold uppercase text-[10px] tracking-widest rounded transition-all">Back to Command Center</button>
         </div>
       </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: isDark ? '#0e0e0e' : '#f4f6f8',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      
      {/* TOP NAVBAR - fixed height */}
      <div style={{
        height: 60,
        flexShrink: 0,
        background: t.surfaceNavbar,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${t.borderNavbar}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 30
      }}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded transition-all font-space text-[10px] tracking-widest hover:bg-white/10"
            style={{ background: t.borderSubtle, color: t.textSecondary }}
          >
            ← DASHBOARD
          </button>
          <div className="h-4 w-px hidden md:block" style={{ background: t.borderSubtle }} />
          <div className="hidden md:block">
            <div className="font-space text-[8px] tracking-[0.2em] uppercase" style={{ color: accentColor }}>{data.subject}</div>
            <div className="font-orbitron text-[10px]" style={{ color: t.textPrimary }}>{data.chapterTitle}</div>
          </div>
        </div>

        <div className="flex gap-4 items-center">
           <button 
              onClick={() => navigate(`/topic/${topicId}/quiz`)}
              className="bg-accent/10 border border-accent/20 px-4 py-2 rounded text-[10px] font-orbitron text-accent tracking-widest uppercase hover:bg-accent hover:text-dark transition-all"
              style={{ color: accentColor, borderColor: `${accentColor}40` }}
           >
             Take Quiz
           </button>
           <ThemeToggle />
        </div>
      </div>

      {/* SCROLL PROGRESS BAR */}
      <div style={{
        height: 2,
        background: t.progressTrack,
        flexShrink: 0
      }}>
        <div style={{
          height: '100%',
          width: scrollProgress + '%',
          background: accentColor,
          transition: 'width 0.1s linear'
        }} />
      </div>

      {/* BODY ROW - takes remaining height */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        minHeight: 0
      }}>

        {/* LEFT SIDEBAR */}
        <div style={{
          width: 240,
          flexShrink: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          background: t.surfaceSidebar,
          borderRight: `1px solid ${t.borderSidebar}`,
          padding: '24px 0'
        }}>
          <TheorySidebar 
            chapterTitle={data.chapterTitle}
            subtopics={data.subtopics}
            activeId={activeId}
            onSelect={scrollToSubtopic}
            accentColor={accentColor}
            summary={data.summary}
            t={t}
          />
        </div>

        {/* RIGHT SCROLLABLE CONTENT */}
        <div
          ref={contentRef}
          onScroll={handleScroll}
          style={{
            flex: 1,
            overflowY: 'scroll',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: 120,
            padding: '40px max(24px, 4vw)'
          }}
        >
          <div className="max-w-[900px] mx-auto">
            <header className="mb-20">
              <div className="font-space text-[9px] tracking-[0.5em] mb-4 uppercase" style={{ color: t.textCaption }}>NCERT CLASS {data.standard} — {data.subject}</div>
              <h1 className="font-orbitron font-black text-4xl md:text-6xl tracking-tighter uppercase leading-[1.1] mb-8" style={{ color: t.textHeading }}>
                {data.chapterTitle}
              </h1>
              <div className="h-px w-24 mb-8" style={{ background: `${accentColor}40` }} />
              <p className="font-inter text-lg leading-relaxed italic" style={{ color: t.textSummary }}>
                {data.summary}
              </p>
            </header>

            <div className="space-y-4">
              {data.subtopics.map((sub) => (
                <div key={sub.id} id={sub.id} className="subtopic-scroll-target">
                  <SubtopicSection 
                    subtopic={sub} 
                    accentColor={accentColor} 
                    isDark={isDark} 
                  />
                </div>
              ))}
            </div>
            
            <div className="h-40" /> {/* Bottom Spacer */}
          </div>
        </div>

      </div>

      {/* BACK TO TOP BUTTON */}
      {showScrollTop && (
        <button
          onClick={() => contentRef.current?.scrollTo({
            top: 0, behavior: 'smooth'
          })}
          style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            width: 44,
            height: 44,
            background: isDark ? 'rgba(0,212,255,0.1)' : 'rgba(0,212,255,0.12)',
            border: '1px solid rgba(0,212,255,0.3)',
            color: '#00d4ff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 40,
            fontSize: 18,
            borderRadius: '50%',
            boxShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          ↑
        </button>
      )}

    </div>
  );
}
