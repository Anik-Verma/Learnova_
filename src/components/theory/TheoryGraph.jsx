import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter, 
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, 
  ResponsiveContainer, Label
} from 'recharts'

export default function TheoryGraph({ graph, accentColor, t, isDark }) {
  if (!graph || graph.type === 'none' || !graph.dataPoints || graph.dataPoints.length === 0) {
    return null;
  }

  const chartProps = {
    data: graph.dataPoints,
    margin: { top: 20, right: 30, left: 10, bottom: 20 }
  };

  const commonXAxis = (
    <XAxis 
      dataKey="x" 
      stroke={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'} 
      tick={{ fill: isDark ? 'rgba(255,255,255,0.4)' : '#888888', fontSize: 11 }}
    >
      <Label value={graph.xLabel} offset={-10} position="insideBottom" fill={isDark ? 'rgba(255,255,255,0.3)' : '#999999'} fontSize={11} />
    </XAxis>
  );

  const commonYAxis = (
    <YAxis 
      stroke={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'} 
      tick={{ fill: isDark ? 'rgba(255,255,255,0.4)' : '#888888', fontSize: 11 }}
    >
      <Label value={graph.yLabel} angle={-90} position="insideLeft" fill={isDark ? 'rgba(255,255,255,0.3)' : '#999999'} fontSize={11} />
    </YAxis>
  );

  const commonTooltip = (
    <Tooltip 
      contentStyle={{
        background: isDark ? 'rgba(19,19,19,0.95)' : '#ffffff',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.1)',
        borderRadius: '2px',
        fontFamily: 'Inter',
        fontSize: '12px',
        color: isDark ? '#ffffff' : '#0a1628'
      }}
      itemStyle={{ color: accentColor }}
    />
  );

  const renderAnnotations = () => {
    if (!graph.annotations) return null;
    return graph.annotations.map((ann, i) => (
      <ReferenceLine key={i} x={ann.x} stroke={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'} strokeDasharray="4 4">
        <Label value={ann.text} position="top" fill={isDark ? 'rgba(255,255,255,0.5)' : '#666666'} fontSize={10} />
      </ReferenceLine>
    ));
  };

  let ChartComponent;
  if (graph.type === 'line') {
    ChartComponent = (
      <LineChart {...chartProps}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'} />
        {commonXAxis}
        {commonYAxis}
        {commonTooltip}
        {renderAnnotations()}
        <Line type="monotone" dataKey="y" stroke={accentColor} strokeWidth={2} dot={{ fill: accentColor, r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    );
  } else if (graph.type === 'bar') {
    ChartComponent = (
      <BarChart {...chartProps}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'} />
        {commonXAxis}
        {commonYAxis}
        {commonTooltip}
        {renderAnnotations()}
        <Bar dataKey="y" fill={accentColor} />
      </BarChart>
    );
  } else if (graph.type === 'scatter') {
    ChartComponent = (
      <ScatterChart {...chartProps}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'} />
        {commonXAxis}
        {commonYAxis}
        {commonTooltip}
        {renderAnnotations()}
        <Scatter data={graph.dataPoints} fill={accentColor} />
      </ScatterChart>
    );
  } else {
    return null;
  }

  return (
    <div className="mt-[24px] border rounded-sm p-[24px]" style={{ background: t.surfaceHigh, borderColor: t.borderSubtle }}>
      <div 
        className="uppercase mb-[12px]"
        style={{ fontFamily: 'Space Grotesk', fontSize: '11px', color: t.textMuted, letterSpacing: '0.1em' }}
      >
        {graph.title}
      </div>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {ChartComponent}
        </ResponsiveContainer>
      </div>
      {graph.description && (
        <div 
          className="mt-[16px] italic"
          style={{ fontFamily: 'Inter', fontSize: '11px', color: t.textSecondary }}
        >
          Observation: {graph.description}
        </div>
      )}
    </div>
  );
}
