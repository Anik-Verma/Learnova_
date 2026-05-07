import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, AreaChart, Area, CartesianGrid } from 'recharts';
import { getProgress, getStudent } from '../utils/storage';
import { TOPIC_PDF_MAP, SUBJECT_COLORS } from '../data/topicPDFMap';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../utils/theme';

export default function ProgressPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = getTheme(isDark);
  const student = getStudent();
  const progress = getProgress();

  const [activeTab, setActiveTab] = useState('overview');

  // Prepare chart data
  const chartData = Object.entries(progress).map(([id, data]) => {
    const topic = TOPIC_PDF_MAP[id];
    return {
      name: topic?.name.split(' ')[0] || id,
      score: data.lastScore,
      best: data.bestScore,
      subject: topic?.subject || 'physics',
      full: topic?.name
    };
  });

  const subjectAverages = ['physics', 'chemistry', 'biology'].map(subj => {
    const subjTopics = Object.entries(progress).filter(([id]) => TOPIC_PDF_MAP[id]?.subject === subj);
    const avg = subjTopics.length > 0 
      ? Math.round(subjTopics.reduce((acc, [_, d]) => acc + d.lastScore, 0) / subjTopics.length)
      : 0;
    return { subject: subj.toUpperCase(), avg, count: subjTopics.length };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 rounded border bg-black/80 backdrop-blur-xl border-white/10 shadow-2xl">
          <p className="font-orbitron text-[10px] text-accent mb-2">{payload[0].payload.full || payload[0].payload.subject}</p>
          <p className="text-xl font-orbitron text-white">{payload[0].value}%</p>
          <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1">Assessment Performance</p>
        </div>
      );
    }
    return null;
  };

  if (!student) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: t.bgBase, color: t.textPrimary }}>
      {/* Background Orbs */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-accent/3 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 px-8 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 backdrop-blur-md">
        <div>
          <button onClick={() => navigate('/dashboard')} className="text-[10px] font-space text-white/40 hover:text-accent tracking-[0.3em] uppercase transition-colors mb-4">← DASHBOARD</button>
          <h1 className="font-orbitron font-black text-3xl tracking-tighter uppercase leading-none">MY PROGRESS</h1>
          <p className="text-sm text-white/40 font-inter mt-3 tracking-wide">Track your science learning journey across all topics.</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-[2px] border border-white/5">
          {['overview', 'subjects', 'activity'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-[2px] font-space text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-accent text-dark' : 'text-white/40 hover:text-white/60'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative z-10 p-8 pt-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {activeTab === 'overview' && (
            <>
              {/* Top Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Assessments', value: Object.keys(progress).length, color: t.accentPhysics },
                  { label: 'Overall Mastery', value: chartData.length > 0 ? Math.round(chartData.reduce((a,b)=>a+b.score,0)/chartData.length) + '%' : '0%', color: t.accentBiology },
                  { label: 'Top Subject', value: subjectAverages.sort((a,b)=>b.avg-a.avg)[0]?.subject || '—', color: t.accentGold },
                  { label: 'Target Modules', value: '14', color: t.accentChemistry }
                ].map((m, i) => (
                  <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.1 }} key={m.label} className="p-6 rounded bg-white/5 border border-white/5 backdrop-blur-xl">
                    <div className="text-[9px] font-space tracking-widest text-white/30 uppercase mb-3">{m.label}</div>
                    <div className="font-orbitron text-2xl" style={{ color: m.color }}>{m.value}</div>
                  </motion.div>
                ))}
              </div>

              {/* Chart Block */}
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: 0.4 }} className="p-8 rounded bg-white/5 border border-white/5 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-10">
                  <div className="font-orbitron text-xs tracking-widest text-white/40 uppercase">Performance Distribution</div>
                  <div className="flex gap-4 text-[9px] font-space text-white/20">
                     <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent"></div> SCORE %</span>
                  </div>
                </div>
                
                <div className="h-[350px] w-full">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top:0, right:0, left: -30, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={9} fontFamily="Space Grotesk" tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} fontFamily="Space Grotesk" tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(168,232,255,0.03)' }} />
                        <Bar dataKey="score" radius={[2, 2, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={SUBJECT_COLORS[entry.subject].primary} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded">
                       <span className="font-space text-[11px] text-white/20 uppercase tracking-[0.2em]">Insufficent data vectors for analysis.</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Subject Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {subjectAverages.map((s, i) => (
                   <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={{ delay: 0.6 + (i*0.1) }} key={s.subject} className="p-6 rounded bg-white/5 border border-white/5">
                      <div className="flex items-center justify-between mb-6">
                        <div className="font-orbitron text-[10px] tracking-widest text-white/60">{s.subject}</div>
                        <div className="text-xl font-orbitron" style={{ color: SUBJECT_COLORS[s.subject.toLowerCase()].primary }}>{s.avg}%</div>
                      </div>
                      <div className="text-[9px] font-space text-white/30 uppercase tracking-widest mb-4">{s.count} modules attempted</div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${s.avg}%` }} 
                          className="h-full" 
                          style={{ background: SUBJECT_COLORS[s.subject.toLowerCase()].primary }} 
                        />
                      </div>
                   </motion.div>
                 ))}
              </div>
            </>
          )}

          {activeTab === 'activity' && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-4">
               <div className="font-orbitron text-xs tracking-widest text-white/40 uppercase mb-8">Temporal Log Summary</div>
               {chartData.length > 0 ? (
                 chartData.map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                       <div className="flex items-center gap-5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: SUBJECT_COLORS[d.subject].primary }} />
                          <div>
                             <div className="text-sm font-inter text-white mb-0.5">{d.full}</div>
                             <div className="text-[9px] font-space text-white/20 uppercase tracking-widest">{d.subject}</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="font-orbitron text-base text-white">{d.score}%</div>
                          <div className="text-[9px] font-space text-white/20 uppercase tracking-widest">Efficiency</div>
                       </div>
                    </div>
                 ))
               ) : (
                 <div className="py-20 text-center font-space text-white/20 uppercase tracking-widest">Log is empty.</div>
               )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
