import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Target, Trophy, Zap, Wind, Shield } from 'lucide-react';

type DrillType = 'BATTING_PACE' | 'BATTING_SPIN' | 'BOWLING_ACCURACY' | 'FIELDING_CATCH';

export default function PracticeMode({ onBack }: { onBack: () => void }) {
  const [activeDrill, setActiveDrill] = useState<DrillType | null>(null);
  const [score, setScore] = useState(0);
  const [drillState, setDrillState] = useState<'IDLE' | 'ACTIVE' | 'RESULT'>('IDLE');
  const [feedback, setFeedback] = useState('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballPos = useRef({ x: 400, y: 200, z: 200 });
  const ballVel = useRef({ x: 0, y: 0, z: 0 });
  const frameRef = useRef<number>(0);
  const lastTime = useRef<number>(0);

  const startDrill = (type: DrillType) => {
    setActiveDrill(type);
    setDrillState('IDLE');
    setScore(0);
    setFeedback('');
  };

  const deliverBall = () => {
    if (drillState === 'ACTIVE') return;
    setDrillState('ACTIVE');
    setFeedback('');

    if (activeDrill?.startsWith('BATTING')) {
      const isSpin = activeDrill === 'BATTING_SPIN';
      ballPos.current = { x: 400, y: 200, z: 200 };
      ballVel.current = {
        x: isSpin ? (Math.random() - 0.5) * 4 : (Math.random() - 0.5) * 2,
        y: isSpin ? 4 + Math.random() * 2 : 8 + Math.random() * 4,
        z: isSpin ? -4 - Math.random() * 3 : -12 - Math.random() * 6
      };
    } else if (activeDrill === 'BOWLING_ACCURACY') {
      // Bowling accuracy involves the user aiming
      setFeedback('Aim for the stumps!');
      ballPos.current = { x: 400, y: 550, z: 0 };
    } else if (activeDrill === 'FIELDING_CATCH') {
      ballPos.current = { x: 400, y: 200, z: 200 };
      ballVel.current = {
        x: (Math.random() - 0.5) * 8,
        y: -2 - Math.random() * 2,
        z: -15 - Math.random() * 10
      };
    }
  };

  const handleAction = (e: React.MouseEvent) => {
    if (!activeDrill) return;

    if (activeDrill.startsWith('BATTING') || activeDrill === 'FIELDING_CATCH') {
      if (drillState !== 'ACTIVE') return;
      
      const dist = Math.abs(ballPos.current.z);
      if (dist < 20) {
        if (activeDrill === 'FIELDING_CATCH') {
            setScore(s => s + 15);
            setFeedback('STUNNING CATCH!');
            ballVel.current = { x: 0, y: 0, z: 0 };
        } else {
            const quality = 1 - (dist / 15);
            if (quality > 0.8) {
              setScore(s => s + 10);
              setFeedback('PERFECT TIMING!');
            } else {
              setScore(s => s + 5);
              setFeedback('GOOD HIT');
            }
            ballVel.current = { x: (Math.random() - 0.5) * 20, y: -5, z: 20 };
        }
      } else {
        setFeedback(activeDrill === 'FIELDING_CATCH' ? 'DROPPED!' : 'MISSED');
      }
      
      setTimeout(() => setDrillState('IDLE'), 1500);
    } else if (activeDrill === 'BOWLING_ACCURACY') {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Target is the stumps at far end (x=400, y=160 approx)
        const dx = Math.abs(x - 400);
        const dy = Math.abs(y - 150);

        if (dx < 30 && dy < 50) {
            setScore(s => s + 20);
            setFeedback('BULLSEYE!');
        } else {
            setFeedback('MISS');
        }
        setDrillState('IDLE');
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !activeDrill) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = (time: number) => {
      const dt = (time - lastTime.current) / 16;
      lastTime.current = time;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Pitch
      ctx.fillStyle = '#C2B280';
      ctx.beginPath();
      ctx.moveTo(350, 100); ctx.lineTo(450, 100); ctx.lineTo(600, 600); ctx.lineTo(200, 600);
      ctx.fill();

      // Draw Stumps
      const drawStumps = (x: number, y: number, scale: number) => {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2 * scale;
        for(let i = -1; i <= 1; i++) {
          ctx.beginPath();
          ctx.moveTo(x + (i * 8 * scale), y);
          ctx.lineTo(x + (i * 8 * scale), y - 30 * scale);
          ctx.stroke();
        }
      };
      drawStumps(400, 110, 0.5);
      drawStumps(400, 580, 1);

      if (drillState === 'ACTIVE' && activeDrill.startsWith('BATTING')) {
        ballPos.current.x += ballVel.current.x * dt;
        ballPos.current.y += ballVel.current.y * dt;
        ballPos.current.z += ballVel.current.z * dt;

        if (activeDrill === 'BATTING_SPIN' && ballPos.current.z > 50 && ballPos.current.z < 150) {
          ballVel.current.x += (Math.sin(time/200) * 0.2);
        }

        const scale = 1 + (ballPos.current.z / 100);
        const sx = 400 + (ballPos.current.x - 400) * scale;
        const sy = 550 - (ballPos.current.z * 2.5);

        ctx.fillStyle = '#800000';
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(3, 8 * scale), 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.stroke();

        if (ballPos.current.z < -20) setDrillState('IDLE');
      }

      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frameRef.current);
  }, [activeDrill, drillState]);

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col font-sans p-8 md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 40%), radial-gradient(circle at 20% 80%, #f97316 0%, transparent 40%)' }}></div>
      
      <header className="relative z-10 flex items-center justify-between mb-12">
        <button 
          onClick={activeDrill ? () => setActiveDrill(null) : onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors uppercase text-xs font-black tracking-widest"
        >
          <ChevronLeft className="w-5 h-5" /> {activeDrill ? 'Exit Drill' : 'Back to Menu'}
        </button>
        <div className="text-center">
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Practice Facility</h2>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Training Score</span>
            <span className="text-2xl font-black tabular-nums">{score}</span>
        </div>
      </header>

      {!activeDrill ? (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
            <DrillCard 
                title="Pace Battery" 
                desc="Face high-speed fast bowlers at 150km/h." 
                icon={<Zap className="w-8 h-8"/>} 
                color="orange"
                onClick={() => startDrill('BATTING_PACE')}
            />
            <DrillCard 
                title="Spin Wizardry" 
                desc="Master the art of reading the googly and leg-break." 
                icon={<Wind className="w-8 h-8"/>} 
                color="blue"
                onClick={() => startDrill('BATTING_SPIN')}
            />
            <DrillCard 
                title="Bowling Accuracy" 
                desc="Target practice to hit the off-stump consistently." 
                icon={<Target className="w-8 h-8"/>} 
                color="red"
                onClick={() => startDrill('BOWLING_ACCURACY')}
            />
            <DrillCard 
                title="Reflex Catching" 
                desc="Sharp reflex training. Catch those high-speed screamers." 
                icon={<Shield className="w-8 h-8"/>} 
                color="blue"
                onClick={() => startDrill('FIELDING_CATCH')}
            />
        </div>
      ) : (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-4xl aspect-[4/3] bg-slate-900/50 rounded-[40px] border border-white/10 overflow-hidden" onClick={handleAction}>
                <canvas ref={canvasRef} width={800} height={600} className="w-full h-full" />
                
                <div className="absolute top-10 left-1/2 -translate-x-1/2">
                    <AnimatePresence mode="wait">
                        {feedback && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                exit={{ opacity: 0, scale: 2 }}
                                className="text-5xl font-black text-white italic tracking-tighter drop-shadow-2xl"
                            >
                                {feedback}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
                    {drillState === 'IDLE' && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); deliverBall(); }}
                            className="bg-orange-500 hover:bg-orange-400 px-12 py-4 rounded-full text-white font-black uppercase tracking-widest shadow-xl shadow-orange-500/20"
                        >
                            Next Ball
                        </button>
                    )}
                    {activeDrill.startsWith('BATTING') && drillState === 'ACTIVE' && (
                        <div className="text-white/40 uppercase font-black text-xs tracking-[0.5em] animate-pulse">Timing is Everything</div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

function DrillCard({ title, desc, icon, color, onClick }: { title: string, desc: string, icon: React.ReactNode, color: string, onClick: () => void }) {
    const colorClass = color === 'orange' ? 'from-orange-500 to-red-600' : color === 'blue' ? 'from-blue-500 to-indigo-600' : 'from-red-500 to-rose-600';
    return (
        <motion.button
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="group relative h-80 rounded-[40px] overflow-hidden bg-slate-900 border border-white/10 p-10 text-left transition-all hover:border-white/30"
        >
            <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${colorClass} opacity-10 blur-3xl -mr-10 -mt-10 group-hover:opacity-30 transition-opacity`} />
            <div className={`w-16 h-16 bg-gradient-to-br ${colorClass} rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl`}>
                {icon}
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 italic">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            <div className="mt-8 flex items-center gap-2 text-xs font-black text-white/20 uppercase tracking-widest group-hover:text-orange-500 transition-colors">
                Start Training <ChevronRight className="w-4 h-4" />
            </div>
        </motion.button>
    );
}
