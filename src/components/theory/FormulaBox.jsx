import FormulaRenderer from './FormulaRenderer';

export default function FormulaBox({ formula, accentColor, t }) {
  if (!formula || !formula.exists) return null;

  return (
    <div 
      className="mt-[20px] p-[20px_24px] rounded-r-[2px]"
      style={{
        background: t.surfaceFormula,
        borderLeft: `2px solid ${accentColor}`,
        borderTop: `1px solid ${t.borderSubtle}`,
        borderBottom: `1px solid ${t.borderSubtle}`,
        borderRight: `1px solid ${t.borderSubtle}`
      }}
    >
      <FormulaRenderer 
        latex={formula.latex}
        display={true}
        color={accentColor}
      />
      
      <div 
        style={{
          fontFamily: 'Inter',
          fontWeight: 400,
          fontSize: '12px',
          color: t.textSecondary,
          marginBottom: '16px'
        }}
      >
        {formula.plain}
      </div>

      {formula.variables && formula.variables.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <div 
            style={{
              fontFamily: 'Space Grotesk',
              fontSize: '9px',
              textTransform: 'uppercase',
              color: t.textMuted,
              letterSpacing: '0.1em',
              marginBottom: '8px'
            }}
          >
            VARIABLES
          </div>
          
          <div className="flex flex-col gap-[6px]">
            {formula.variables.map((v, i) => (
              <div 
                key={i} 
                className="flex items-center pb-[6px]"
                style={{ borderBottom: `1px solid ${t.borderSubtle}` }}
              >
                <div style={{ fontFamily: 'Orbitron', color: accentColor, width: '40px' }}>
                  {v.symbol}
                </div>
                <div style={{ fontFamily: 'Inter', fontSize: '11px', color: t.textPrimary, flex: 1 }}>
                  {v.meaning}
                </div>
                <div style={{ fontFamily: 'Inter', fontSize: '11px', color: t.textSecondary, textAlign: 'right' }}>
                  {v.unit}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
