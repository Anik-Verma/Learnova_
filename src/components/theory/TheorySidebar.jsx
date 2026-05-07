import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TheorySidebar({ chapterTitle, subtopics, activeId, onSelect, accentColor, summary, t }) {
  const [summaryOpen, setSummaryOpen] = useState(false);

  if (!subtopics) return null;

  const total = subtopics.length;
  const completedIdx = subtopics.findIndex(s => s.id === activeId);
  const completed = completedIdx === -1 ? 0 : Math.max(completedIdx, 1);

  return (
    <div 
      className="sticky top-0 w-full md:w-[240px] pr-[16px] flex flex-col shrink-0 no-scrollbar"
      style={{
        height: '100vh',
        overflowY: 'auto',
        scrollbarWidth: 'none', // firefox
        msOverflowStyle: 'none', // IE
        paddingTop: '100px',
        paddingBottom: '40px'
      }}
    >
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <div 
        style={{
          fontFamily: 'Space Grotesk', fontSize: '9px', letterSpacing: '0.25em',
          color: t.textCaption, marginBottom: '16px'
        }}
      >
        CONTENTS
      </div>
      
      <div 
        style={{
          fontFamily: 'Orbitron', fontSize: '12px', color: t.textPrimary,
          marginBottom: '20px', lineHeight: 1.4
        }}
      >
        {chapterTitle}
      </div>

      <div className="flex flex-col gap-[4px] flex-1">
        {subtopics.map(sub => {
          const isActive = sub.id === activeId;
          return (
              <div
              key={sub.id}
              onClick={() => {
                if(onSelect) onSelect(sub.id);
              }}
              className="p-[10px_12px] flex items-center gap-[10px] cursor-pointer rounded-[2px] transition-all"
              style={{
                background: isActive ? `color-mix(in srgb, ${accentColor} 8%, transparent)` : 'transparent',
                borderLeft: isActive ? `2px solid ${accentColor}` : '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                if(!isActive) e.currentTarget.style.background = t.surfaceHigh;
              }}
              onMouseLeave={(e) => {
                if(!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <div 
                style={{
                  fontFamily: 'Orbitron', fontSize: '10px', width: '20px',
                  color: isActive ? accentColor : t.textCaption
                }}
              >
                {sub.order}
              </div>
              <div 
                style={{
                  fontFamily: 'Inter', fontSize: '12px', lineHeight: 1.3,
                  color: isActive ? t.textPrimary : t.textMuted
                }}
              >
                {sub.title}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto pt-[24px]">
        <div style={{ fontFamily: 'Space Grotesk', fontSize: '9px', color: t.textSecondary, marginBottom: '8px' }}>
          {completed} of {total} completed
        </div>
        <div className="w-full h-[2px] relative" style={{ background: t.borderSubtle }}>
          <div 
            className="absolute left-0 top-0 h-full transition-all duration-300"
            style={{ width: `${(completed/total)*100}%`, background: accentColor }}
          />
        </div>
      </div>

      {summary && (
        <div className="mt-[24px]">
           <button 
             onClick={() => setSummaryOpen(!summaryOpen)}
             className="w-full text-left bg-transparent border-none p-0 uppercase text-[9px] tracking-[0.2em] cursor-pointer flex justify-between outline-none"
             style={{ fontFamily: 'Space Grotesk', color: t.textMuted }}
           >
             <span>CHAPTER SUMMARY</span>
             <span>{summaryOpen ? '−' : '+'}</span>
           </button>
           <AnimatePresence>
             {summaryOpen && (
               <motion.div
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 exit={{ opacity: 0, height: 0 }}
                 className="overflow-hidden mt-[12px]"
               >
                 <div style={{ fontFamily: 'Inter', fontSize: '11px', color: t.textSecondary, lineHeight: 1.6 }}>
                   {summary}
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      )}
    </div>
  );
}
