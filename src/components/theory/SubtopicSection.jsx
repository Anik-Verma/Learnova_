import React from 'react';
import { motion } from 'framer-motion';
import { getTheme } from '../../utils/theme';
import SubtopicAnimation from './SubtopicAnimation';
import TheoryGraph from './TheoryGraph';
import DidYouKnow from './DidYouKnow';
import ExampleBox from './ExampleBox';
import FormulaBox from './FormulaBox';
import KeyTerms from './KeyTerms';
import QuickCheck from './QuickCheck';
import FormulaRenderer from './FormulaRenderer';
import SubtopicDiagram from './SubtopicDiagram';
import ANIMATION_MAP from '../../data/animationMap';
import DIAGRAM_MAP from '../../data/diagramMap';

const InteractiveSimulation = ({ data }) => (
  <div className="p-4 my-8 border-2 border-dashed border-gray-500/30 rounded text-center text-sm opacity-50">
    Interactive Simulation Placeholder
  </div>
);

const SubtopicSection = ({ subtopic, accentColor, isDark }) => {
  const { 
    id, title, order, summary, theory, 
    didYouKnow, example, keyTerms, 
    hasGraph, graph, formula, quickCheck 
  } = subtopic;
  const tTheme = getTheme(isDark);
  
  const subtopicId = id || title;
  const hasInteractiveSim = subtopic.simulation !== undefined || subtopic.interactive !== undefined;

  // Function to highlight key terms in theory text
  const highlightTerms = (text) => {
    if (!keyTerms || keyTerms.length === 0) return text;
    let parts = [text];
    keyTerms.forEach((termObj) => {
      const term = termObj.term;
      const newParts = [];
      parts.forEach((part) => {
        if (typeof part !== 'string') {
          newParts.push(part);
          return;
        }
        const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp('(\\b' + escapedTerm + '\\b)', 'gi');
        const split = part.split(regex);
        split.forEach((textPart, index) => {
          if (textPart.toLowerCase() === term.toLowerCase()) {
            newParts.push(
              <span 
                key={term + '-' + index} 
                className="theory-term-highlight text-accent"
                style={{ whiteSpace: 'normal', display: 'inline' }}
              >
                {textPart}
                <span className="theory-tooltip">
                  <div className="font-bold text-accent mb-1 uppercase tracking-tighter text-[9px]">{term}</div>
                  {termObj.definition}
                </span>
              </span>
            );
          } else if (textPart !== '') {
            newParts.push(textPart);
          }
        });
      });
      parts = newParts;
    });
    return parts;
  };

  const renderTheoryContent = (text) => {
    if (!text) return null;
    const parts = text.split(/`([^`]+)`/);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        const isFormula = /[\\^_{}]|\\frac|\\vec|=|\+/.test(part);
        if (isFormula) {
          return (
            <FormulaRenderer 
              key={i}
              latex={part}
              display={false}
              color={accentColor}
            />
          );
        }
        return (
          <span key={i} style={{
            fontFamily: 'Orbitron',
            fontSize: '0.85em',
            color: accentColor,
            padding: '2px 6px',
            background: `${accentColor}15`,
            borderRadius: 2
          }}>
            {part}
          </span>
        );
      }
      return highlightTerms(part);
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-16"
      style={{ 
        width: '100%', 
        maxWidth: '100%', 
        boxSizing: 'border-box', 
        overflowX: 'hidden' 
      }}
    >
      <div className="flex items-center gap-4 mb-6">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
          style={{ background: accentColor + '20', color: accentColor, border: '1px solid ' + accentColor + '30' }}
        >
          {order}
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-orbitron tracking-tight" style={{ color: tTheme.textPrimary }}>{title}</h2>
          <div className="text-[10px] uppercase tracking-widest mt-1" style={{ color: tTheme.textCaption }}>~3 min read</div>
        </div>
      </div>

      <div 
        className="mb-6 pl-4 border-l-2 leading-relaxed text-sm italic"
        style={{ 
          borderColor: accentColor + '30',
          color: tTheme.textSummary,
          maxWidth: '100%', 
          wordWrap: 'break-word', 
          overflowWrap: 'break-word',
          whiteSpace: 'normal'
        }}
      >
        {summary}
      </div>

      <div 
        className="mb-8 leading-relaxed text-base md:text-lg font-inter"
        style={{ 
          color: tTheme.textBody,
          maxWidth: '100%', 
          wordBreak: 'break-word', 
          overflowWrap: 'break-word', 
          whiteSpace: 'normal',
          paddingRight: '24px'
        }}
      >
        {renderTheoryContent(theory)}
      </div>

      {!hasInteractiveSim && ANIMATION_MAP[subtopicId] && (
        <SubtopicAnimation subtopicId={subtopicId} accentColor={accentColor} isDark={isDark} />
      )}
      
      {hasInteractiveSim && (
        <InteractiveSimulation data={subtopic.simulation || subtopic.interactive} />
      )}
      
      {!ANIMATION_MAP[subtopicId] && !hasInteractiveSim && DIAGRAM_MAP[subtopicId] && (
        <SubtopicDiagram subtopicId={subtopicId} accentColor={accentColor} />
      )}

      {hasGraph && !ANIMATION_MAP[subtopicId] && !hasInteractiveSim && (
        <div 
          className="mt-8 p-6 border rounded-sm" 
          style={{ 
            background: isDark ? 'rgba(13,13,13,0.5)' : 'rgba(255,255,255,0.8)',
            borderColor: tTheme.borderSubtle 
          }}
        >
           <div 
             className="px-2 py-0.5 rounded-[2px] text-[9px] font-orbitron tracking-widest uppercase mb-4 inline-block"
             style={{ 
               background: accentColor + '10', 
               border: `1px solid ${accentColor}40`,
               color: accentColor 
             }}
           >
             Data Visualization
           </div>
           <TheoryGraph graph={graph} accentColor={accentColor} t={tTheme} isDark={isDark} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
         {didYouKnow && <DidYouKnow text={didYouKnow} accentColor={accentColor} t={tTheme} />}
         {example && <ExampleBox example={example} accentColor={accentColor} t={tTheme} />}
      </div>

      {formula && formula.exists && <FormulaBox formula={formula} accentColor={accentColor} t={tTheme} />}
      {keyTerms && <KeyTerms terms={keyTerms} accentColor={accentColor} t={tTheme} />}
      {quickCheck && <QuickCheck check={quickCheck} accentColor={accentColor} t={tTheme} />}

      <div className="theory-subtopic-divider" />
    </motion.div>
  );
};

export default SubtopicSection;
