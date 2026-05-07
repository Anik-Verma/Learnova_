export default function KeyTerms({ terms, accentColor, t }) {
  if (!terms || terms.length === 0) return null;

  return (
    <div className="mt-[24px]">
      <div 
        style={{
          fontFamily: 'Space Grotesk',
          fontSize: '9px',
          textTransform: 'uppercase',
          letterSpacing: '0.25em',
          color: t.textMuted,
          marginBottom: '12px'
        }}
      >
        KEY TERMS
      </div>
      
      <div className="flex flex-col">
        {terms.map((term, i) => (
          <div 
            key={i}
            className="flex flex-col py-[12px] px-[8px] transition-colors rounded-[2px]"
            style={{ 
              borderBottom: `1px solid ${t.borderSubtle}` 
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = t.surfaceHigh}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div 
              style={{
                fontFamily: 'Orbitron',
                fontSize: '12px',
                color: accentColor,
                marginBottom: '4px'
              }}
            >
              {term.term}
            </div>
            <div 
              style={{
                fontFamily: 'Inter',
                fontSize: '12px',
                color: t.textSecondary
              }}
            >
              {term.definition}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
