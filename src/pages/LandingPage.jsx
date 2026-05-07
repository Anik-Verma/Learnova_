import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudent } from '../utils/storage';

export default function LandingPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const student = getStudent();
    if (student) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);
  
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div style={{ backgroundColor: '#000000', color: 'white', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* SECTION 1 — NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%',
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,212,255,0.1)', height: 60,
        padding: '0 40px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', zIndex: 1000,
        boxSizing: 'border-box'
      }}>
        {/* LEFT: Logo */}
        <div style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold', fontSize: 22, cursor: 'pointer' }} onClick={() => scrollTo('home')}>
          <span style={{ color: 'white' }}>Learn</span>
          <span style={{ color: '#00d4ff' }}>ova</span>
        </div>

        {/* CENTER: Links */}
        <div className="hidden md:flex" style={{
          gap: 32
        }}>
          {['HOME', 'FEATURES', 'SUBJECTS', 'HOW IT WORKS'].map((item) => (
            <span
              key={item}
              onClick={() => scrollTo(item.toLowerCase().replace(/ /g, '-'))}
              style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.6)', letterSpacing: '0.15em', cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = 'white'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}
            >
              {item}
            </span>
          ))}
        </div>

        {/* RIGHT: Buttons */}
        <div style={{ display: 'flex', gap: 16 }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              border: '1px solid rgba(255,255,255,0.3)', background: 'transparent',
              color: 'white', padding: '8px 20px', fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 11, textTransform: 'uppercase', borderRadius: 2, cursor: 'pointer'
            }}
          >
            LOGIN
          </button>
          <button
            onClick={() => navigate('/register')}
            style={{
              background: '#00d4ff', color: '#003642', padding: '8px 20px',
              fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 11, textTransform: 'uppercase', borderRadius: 2, cursor: 'pointer', border: 'none'
            }}
          >
            SIGN UP
          </button>
        </div>
      </nav>

      {/* SECTION 2 — HERO */}
      <section id="home" style={{
        minHeight: '100vh', paddingTop: 60,
        background: 'linear-gradient(135deg, #000000 0%, #0a0f1e 50%, #030a03 100%)',
        backgroundImage: 'linear-gradient(135deg, #000000 0%, #0a0f1e 50%, #030a03 100%), radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
        backgroundSize: '100% 100%, 20px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 40px'
      }}>
        <div style={{ display: 'flex', width: '100%', maxWidth: 1200, margin: '0 auto', flexWrap: 'wrap' }}>
          {/* LEFT COLUMN */}
          <div style={{ width: '55%', paddingRight: 40, boxSizing: 'border-box' }} className="w-full md:w-[55%] pb-12 md:pb-0">
            <div style={{ marginBottom: 16 }}>
              {/* Brand name - large and prominent */}
              <div style={{
                fontFamily: 'Orbitron',
                fontSize: 52,
                fontWeight: 900,
                letterSpacing: '0.08em',
                lineHeight: 1,
                marginBottom: 8
              }}>
                <span style={{ color: '#ffffff' }}>Learn</span>
                <span style={{ 
                  color: '#00d4ff',
                  textShadow: '0 0 30px rgba(0,212,255,0.5)'
                }}>ova</span>
              </div>
              
              {/* Tagline under brand name */}
              <div style={{
                fontFamily: 'Space Grotesk',
                fontSize: 10,
                color: 'rgba(0,212,255,0.7)',
                letterSpacing: '0.35em',
                textTransform: 'uppercase'
              }}>
                NCERT Science Learning Platform
              </div>
            </div>

            {/* Divider line between brand and headline */}
            <div style={{
              width: 60,
              height: 2,
              background: 'linear-gradient(90deg, #00d4ff, transparent)',
              marginBottom: 20
            }}/>
            
            <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold', fontSize: 48, color: 'white', lineHeight: 1.1, margin: 0 }}>
              Explore Science
            </h1>
            <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold', fontSize: 48, color: '#00d4ff', lineHeight: 1.1, margin: 0 }}>
              Like Never Before
            </h1>
            
            <p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.7, maxWidth: 480, marginTop: 20, marginBottom: 36
            }}>
              Master NCERT Class 9-10 Science through high-fidelity visual experiments and interactive simulations. A specialized research-grade environment for future scientists.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36, gap: 24 }}>
              <div>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 28, color: '#00d4ff' }}>25+</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Experiments</div>
              </div>
              <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.1)' }}></div>
              <div>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 28, color: '#00d4ff' }}>120+</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Quiz Questions</div>
              </div>
              <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.1)' }}></div>
              <div>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 28, color: '#00d4ff' }}>14</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>NCERT Chapters</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              <button
                onClick={() => navigate('/register')}
                style={{
                  background: '#00d4ff', color: '#003642', padding: '14px 28px',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 12,
                  textTransform: 'uppercase', letterSpacing: '0.15em', borderRadius: 2,
                  border: 'none', cursor: 'pointer', transition: 'filter 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.filter = 'brightness(1.1)'}
                onMouseLeave={(e) => e.target.style.filter = 'brightness(1)'}
              >
                START LEARNING
              </button>
              <button
                onClick={() => scrollTo('subjects')}
                style={{
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.25)',
                  color: 'white', padding: '14px 28px', fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.15em',
                  borderRadius: 2, cursor: 'pointer', transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                EXPLORE TOPICS
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ width: '45%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="w-full md:w-[45%] mt-12 md:mt-0">
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,212,255,0.15)',
              borderRadius: 8, padding: 16, backdropFilter: 'blur(10px)',
              boxShadow: '0 0 80px rgba(0,212,255,0.08)', width: '100%', position: 'relative'
            }}>
              {/* Top bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#27c93f' }} />
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 8, color: 'rgba(255,255,255,0.4)', marginLeft: 8 }}>
                  LEARNOVA
                </div>
              </div>

              {/* Mockup Content */}
              <div style={{ background: '#0a0a0a', borderRadius: 4, padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', width: 200, height: 200, borderRadius: '50%',
                  border: '1px dashed rgba(0,212,255,0.2)', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)'
                }} />
                <div style={{
                  position: 'absolute', width: 120, height: 120, borderRadius: '50%',
                  border: '1px solid rgba(0,212,255,0.1)', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)'
                }} />
                
                <div style={{ display: 'flex', gap: 40, zIndex: 1 }}>
                  {['Theory', 'Simulation', 'Quiz'].map((lbl, i) => (
                    <div key={lbl} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: '50%', background: 'rgba(0,212,255,0.1)',
                        border: '1px solid #00d4ff', boxShadow: '0 0 20px rgba(0,212,255,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00d4ff',
                        fontFamily: 'Orbitron, sans-serif', fontSize: 16
                      }}>
                        {i === 0 ? '📚' : i === 1 ? '🧪' : '🎯'}
                      </div>
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, color: 'white', textTransform: 'uppercase' }}>{lbl}</span>
                    </div>
                  ))}
                </div>

                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 40, zIndex: 1 }}>
                  Class 9 · 8 Topics Ready
                </div>
              </div>
            </div>

            {/* Badges */}
            <div style={{ position: 'absolute', top: -10, right: -20, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: 20, fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: 'white' }}>
              🧪 Live Simulations
            </div>
            <div style={{ position: 'absolute', bottom: 20, left: -30, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: 20, fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: 'white' }}>
              ⚡ Instant Feedback
            </div>
            <div style={{ position: 'absolute', top: 40, left: -20, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: 20, fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: 'white' }}>
              🤖 AI Assistant
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — FEATURES */}
      <section id="features" style={{ paddingTop: 100, paddingBottom: 100, background: '#000000' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, textTransform: 'uppercase', color: '#00d4ff', letterSpacing: '0.3em' }}>
            PLATFORM CORE FEATURES
          </div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', marginTop: 8 }}>
            SCIENTIFIC PRECISION MEETS INTERACTION
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, maxWidth: 1000, margin: '0 auto', padding: '0 40px' }}>
          {[
            { icon: '🎯', title: 'Interactive Lessons', desc: 'Engage with dynamic simulations that transform complex theories into tactile experiences.' },
            { icon: '📚', title: 'NCERT Coverage', desc: 'Exhaustive curriculum alignment for Class 9 and 10, strictly following scientific accuracy protocols.' },
            { icon: '🧠', title: 'Adaptive Quizzes', desc: 'AI-driven assessments that map your knowledge gaps and reinforce understanding.' },
            { icon: '👁️', title: 'Visual Learning', desc: 'Proprietary 3D models and schematic diagrams designed for immediate cognitive clarity.' },
            { icon: '📊', title: 'Progress Tracking', desc: 'Granular analytics dashboard providing real-time data on your scientific proficiency.' },
            { icon: '💬', title: 'AI Doubt Solving', desc: 'Direct connection to SciBot — your personal AI science tutor available 24/7.' },
          ].map((feat) => (
            <div key={feat.title} style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, padding: 28, transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = '1px solid rgba(0,212,255,0.2)';
              e.currentTarget.style.background = 'rgba(0,212,255,0.03)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{ fontSize: 32, marginBottom: 16 }}>{feat.icon}</div>
              <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 600, fontSize: 14, color: 'white', margin: '0 0 8px 0' }}>{feat.title}</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, margin: 0 }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4 — SUBJECTS */}
      <section id="subjects" style={{ paddingTop: 80, paddingBottom: 80, background: 'rgba(0,0,0,0.95)' }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, textTransform: 'uppercase', color: '#00d4ff', letterSpacing: '0.3em', textAlign: 'center', marginBottom: 40 }}>
          EXPLORE BY SUBJECT
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, maxWidth: 1000, margin: '0 auto', padding: '0 40px' }}>
          {[
            { num: '01', title: 'Physics', color: '#00d4ff', topics: 'Forces, Gravitation, Work & Energy, Sound, and Light reflection.' },
            { num: '02', title: 'Chemistry', color: '#ffdd4c', topics: 'Atoms & Molecules, Structure of Atoms, Carbon Compounds, and Chemical reactions.' },
            { num: '03', title: 'Biology', color: '#39ff14', topics: 'Life Processes, Tissues, Heredity, and Health & Diseases.' },
          ].map((subj) => (
            <div key={subj.title} style={{
              flex: '1 1 300px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
              borderLeft: `3px solid ${subj.color}`, padding: '36px 28px', borderRadius: 2
            }}>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 48, color: subj.color, opacity: 0.15, lineHeight: 1 }}>{subj.num}</div>
              <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold', fontSize: 28, color: 'white', margin: '8px 0 12px 0' }}>{subj.title}</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: 0 }}>{subj.topics}</p>
              <div 
                onClick={() => navigate('/register')}
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, textTransform: 'uppercase', color: subj.color, marginTop: 20, cursor: 'pointer', display: 'inline-block', transition: 'letter-spacing 0.2s' }}
                onMouseEnter={(e) => e.target.style.letterSpacing = '0.05em'}
                onMouseLeave={(e) => e.target.style.letterSpacing = 'normal'}
              >
                ACCESS LAB →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5 — HOW IT WORKS */}
      <section id="how-it-works" style={{ paddingTop: 80, paddingBottom: 80, background: '#000000' }}>
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold', fontSize: 32, color: 'white', textAlign: 'center', marginBottom: 60, marginTop: 0 }}>
          Scientific Methodology
        </h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, maxWidth: 1000, margin: '0 auto', padding: '0 40px', position: 'relative' }}>
          {[
            { num: '01', title: 'Choose Class', desc: 'Select your NCERT curriculum level (Class 9 or 10) to initialize your research path.' },
            { num: '02', title: 'Interactive Learning', desc: 'Engage with visual simulations and technical theory modules tailored for age wisdom.' },
            { num: '03', title: 'Practice Protocol', desc: 'Solve adaptive problem sets and objective assessments to validate your understanding.' },
            { num: '04', title: 'Track Progress', desc: 'Review your performance telemetry and identify areas for accelerated learning.' },
          ].map((step, i) => (
            <div key={step.num} style={{ position: 'relative', flex: '1 1 200px' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%', border: '1px solid rgba(0,212,255,0.4)',
                background: 'rgba(0,212,255,0.06)', color: '#00d4ff', fontFamily: 'Orbitron, sans-serif',
                fontWeight: 'bold', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20, position: 'relative', zIndex: 2
              }}>{step.num}</div>
              
              {i < 3 && (
                <div style={{ position: 'absolute', top: 24, left: 48, right: -24, borderTop: '1px dashed rgba(255,255,255,0.08)', zIndex: 1 }} className="hidden md:block"></div>
              )}
              
              <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 16, color: 'white', margin: '0 0 12px 0' }}>{step.title}</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.5 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>



      {/* SECTION 8 — CTA BANNER */}
      <section style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(57,255,20,0.04))', borderTop: '1px solid rgba(0,212,255,0.1)', borderBottom: '1px solid rgba(0,212,255,0.1)', padding: '80px 40px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold', fontSize: 40, color: 'white', margin: '0 0 12px 0' }}>Join Learnova Today</h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.55)', margin: '0 0 32px 0' }}>Enter the next generation of scientific education.<br/>Precision, interactivity, and excellence combined.</p>
        <button onClick={() => navigate('/register')} style={{ background: '#00d4ff', color: '#003642', padding: '16px 40px', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.2em', borderRadius: 2, border: 'none', cursor: 'pointer' }}>
          GET STARTED FOR FREE →
        </button>
      </section>

      {/* SECTION 9 — FOOTER */}
      <footer style={{ background: '#000000', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '60px 40px 30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, maxWidth: 1200, margin: '0 auto' }}>
          
          <div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold', fontSize: 22, marginBottom: 16 }}>
              <span style={{ color: 'white' }}>Learn</span>
              <span style={{ color: '#00d4ff' }}>ova</span>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)', maxWidth: 200, margin: '0 0 24px 0', lineHeight: 1.6 }}>
              Empowering Indian science education through precision, interactivity, and measurable outcomes.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ width: 32, height: 32, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%' }} />
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', margin: '0 0 20px 0' }}>LEARNING NODES</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Physics Lab', 'Chemistry Lab', 'Biology Lab', 'Simulation Hub'].map(link => (
                <span key={link} onClick={() => navigate('/login')} style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.45)', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.45)'}>{link} →</span>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', margin: '0 0 20px 0' }}>RESOURCE MATRIX</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Theory Library', 'Quiz Database', 'Progress Tracker', 'AI Assistant'].map(link => (
                <span key={link} onClick={() => navigate('/login')} style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.45)', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.45)'}>{link}</span>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', margin: '0 0 20px 0' }}>CONTACT CONTROL</h4>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: '0 0 16px 0' }}>Operational contact via the digital interface.</p>
            <div style={{ display: 'flex' }}>
              <input type="email" placeholder="transmit@learnova.app" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRight: 'none', padding: '8px 12px', color: 'white', fontFamily: 'Inter, sans-serif', fontSize: 12, outline: 'none', width: '100%' }} />
              <button style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderLeft: 'none', color: '#00d4ff', padding: '0 12px', cursor: 'pointer' }}>→</button>
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: 40, paddingTop: 20, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 20, maxWidth: 1200, margin: '40px auto 0 auto' }}>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>© 2026 Learnova. All rights reserved.</div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>Privacy Policy · Terms · License</div>
        </div>
      </footer>

    </div>
  );
}
