import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuickCheck({ quickCheck, accentColor, t }) {
  const [showAnswer, setShowAnswer] = useState(false);

  if (!quickCheck) return null;

  return (
    <div className="mt-[24px]">
      {!showAnswer ? (
        <div className="flex flex-col items-start gap-[12px]">
          <div style={{ fontFamily: 'Inter', fontSize: '13px', color: t.textPrimary }}>
            <span style={{ color: accentColor, fontWeight: 500 }}>🤔 Quick Check — </span>
            {quickCheck.question}
          </div>
          <button 
            onClick={() => setShowAnswer(true)}
            className="cursor-pointer bg-transparent border-none p-0 outline-none hover:opacity-80 transition-opacity"
            style={{ 
              color: accentColor, 
              borderBottom: `1px solid ${accentColor}`,
              fontFamily: 'Space Grotesk',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}
          >
            Reveal Answer
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-[12px]">
          <div style={{ fontFamily: 'Inter', fontSize: '13px', color: t.textMuted }}>
            {quickCheck.question}
          </div>
          
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="overflow-hidden"
            >
              <div 
                className="p-[12px_16px] rounded-r-[2px]"
                style={{
                  background: t.surfaceQuickCheck,
                  borderLeft: `2px solid ${accentColor}`,
                  borderTop: `1px solid ${t.borderSubtle}`,
                  borderBottom: `1px solid ${t.borderSubtle}`,
                  borderRight: `1px solid ${t.borderSubtle}`,
                  fontFamily: 'Inter',
                  color: t.textPrimary,
                  lineHeight: 1.6
                }}
              >
                {quickCheck.answer}
              </div>
            </motion.div>
          </AnimatePresence>

          <button 
            onClick={() => setShowAnswer(false)}
            className="cursor-pointer bg-transparent border-none p-0 outline-none hover:opacity-80 transition-opacity self-start mt-[4px]"
            style={{ 
              color: t.textMuted, 
              fontFamily: 'Inter',
              fontSize: '11px',
              textDecoration: 'underline'
            }}
          >
            Hide Answer
          </button>
        </div>
      )}
    </div>
  );
}
