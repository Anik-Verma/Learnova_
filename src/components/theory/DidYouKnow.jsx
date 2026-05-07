export default function DidYouKnow({ text, accentColor, t }) {
  if (!text) return null;

  return (
    <div 
      className="relative my-[24px] rounded-[2px] p-[20px_24px_20px_52px]"
      style={{
        background: t.surfaceDidYouKnow,
        borderTop: `1px solid ${accentColor}30`,
        borderBottom: `1px solid ${accentColor}30`
      }}
    >
      <div 
        className="absolute left-[20px] top-[20px]"
        style={{ fontSize: '20px' }}
      >
        💡
      </div>
      
      <div 
        style={{
          fontFamily: 'Space Grotesk',
          fontSize: '9px',
          letterSpacing: '0.25em',
          color: accentColor,
          marginBottom: '6px'
        }}
      >
        DID YOU KNOW?
      </div>
      
      <div 
        style={{
          fontFamily: 'Inter',
          fontWeight: 400,
          fontSize: '13px',
          color: t.textSecondary,
          lineHeight: 1.7
        }}
      >
        {text}
      </div>
    </div>
  );
}
