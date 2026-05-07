export default function ExampleBox({ example, accentColor, t }) {
  if (!example) return null;

  return (
    <div 
      className="my-[20px] p-[20px_24px] rounded-[2px]"
      style={{
        background: t.surfaceExample,
        border: `1px solid ${t.borderSubtle}`
      }}
    >
      <div className="flex items-center justify-between pointer-events-none">
        <div 
          style={{
            fontFamily: 'Space Grotesk',
            fontSize: '9px',
            textTransform: 'uppercase',
            color: t.textMuted,
            letterSpacing: '0.2em'
          }}
        >
          📌 EXAMPLE
        </div>
        <div 
          style={{
            fontFamily: 'Inter',
            fontSize: '11px',
            color: t.textSecondary
          }}
        >
          {example.title}
        </div>
      </div>
      
      <div className="w-full h-[1px] my-[12px]" style={{ background: t.borderSubtle }} />
      
      <div 
        style={{
          fontFamily: 'Inter',
          fontWeight: 400,
          fontSize: '13px',
          color: t.textPrimary,
          lineHeight: 1.7
        }}
      >
        {example.description}
      </div>
    </div>
  );
}
