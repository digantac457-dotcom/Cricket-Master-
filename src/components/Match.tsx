import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Team, MatchState, COMMENTARY } from '../types';
import { Trophy, Volume2, Info, ChevronRight, RotateCcw, MessageSquare, Target, Zap, Shield, Swords } from 'lucide-react';

interface GameCanvasProps {
  myTeam: Team;
  opponent: Team;
  onBallEnd: (runs: number, out: boolean, commentary: string) => void;
}

type ShotType = 'DEFEND' | 'PUSH' | 'LOFT';
type Footwork = 'FRONT' | 'BACK';

export default function GameCanvas({ myTeam, opponent, onBallEnd }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'IDLE' | 'BOWLING' | 'HIT' | 'RESULT'>('IDLE');
  const [lang, setLang] = useState<'en' | 'hi' | 'bn'>('en');
  const [resultMsg, setResultMsg] = useState<string>('');
  const [aimAngle, setAimAngle] = useState(0); // -45 to 45 degrees
  const [selectedShot, setSelectedShot] = useState<ShotType>('PUSH');
  const [footwork, setFootwork] = useState<Footwork>('FRONT');

  // Ball properties
  const ballPos = useRef({ x: 400, y: 100, z: 200 });
  const ballVel = useRef({ x: 0, y: 0, z: 0 });
  const frameRef = useRef<number>(0);
  const lastTime = useRef<number>(0);

  const startBowling = () => {
    if (gameState !== 'IDLE') return;
    setGameState('BOWLING');
    setResultMsg('');
    
    // Vary the delivery based on typical RC24 logic
    const drift = (Math.random() - 0.5) * 4;
    ballPos.current = { x: 400 + drift, y: 150, z: 200 };
    ballVel.current = { 
        x: (Math.random() - 0.5) * 2, 
        y: 6 + Math.random() * 4, 
        z: -14 - Math.random() * 6 // Faster pace
    };
  };

  const handleHit = () => {
    if (gameState !== 'BOWLING') return;
    
    const distance = Math.abs(ballPos.current.z);
    let runs = 0;
    let out = false;

    // Timing window: 12 units around z=0
    if (distance < 12) {
      const timingQuality = 1 - (distance / 12);
      const luck = Math.random();

      if (selectedShot === 'LOFT') {
          if (timingQuality > 0.7) {
              runs = luck > 0.5 ? 6 : 4;
              setResultMsg(runs === 6 ? '🏆 MAXIMUM!' : '🔥 BOUNDARY!');
              // Trigger Visual Effects
              document.body.style.filter = 'brightness(1.5)';
              setTimeout(() => document.body.style.filter = 'none', 100);
          } else if (timingQuality > 0.4) {
              runs = 1 + Math.floor(Math.random() * 2);
              setResultMsg(`✅ ${runs} Runs`);
          } else {
              out = true;
              setResultMsg('❌ CAUGHT!');
          }
      } else if (selectedShot === 'PUSH') {
          if (timingQuality > 0.3) {
              runs = Math.floor(Math.random() * 2) + 1;
              setResultMsg(`✅ ${runs} Run(s)`);
          } else {
              setResultMsg('⚡ DOT BALL');
              runs = 0;
          }
      } else { // DEFEND
          setResultMsg('🛡️ DEFENDED');
          runs = 0;
      }
    } else {
      runs = 0;
      out = true;
      const isReview = Math.random() > 0.7;
      setResultMsg(isReview ? '🔍 VAR CHECKING...' : '❌ CLEAN BOWLED!');
      
      if (isReview) {
          setTimeout(() => setResultMsg('❌ OUT OUT OUT!'), 1500);
      }
    }

    setGameState('HIT');
    
    if (!out && runs > 0) {
        // Ball direction influenced by Aim
        const rad = (aimAngle * Math.PI) / 180;
        ballVel.current = {
            x: Math.sin(rad) * 40,
            y: (selectedShot === 'LOFT' ? -15 : -2),
            z: Math.cos(rad) * 40
        };
    } else {
        ballVel.current = { x: 0, y: 0, z: 0 };
    }

    const pool = COMMENTARY[lang];
    const comm = pool[Math.floor(Math.random() * pool.length)];

    setTimeout(() => {
        onBallEnd(runs, out, comm);
        setGameState('IDLE');
    }, 2000);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = (time: number) => {
      const dt = (time - lastTime.current) / 16;
      lastTime.current = time;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Sky & Background Stadium
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 150);
      skyGrad.addColorStop(0, '#020617');
      skyGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, 150);

      // Floodlights
      ctx.fillStyle = '#ffffff22';
      for(let i=0; i<4; i++) {
        ctx.beginPath(); ctx.arc(100 + i*200, 40, 30, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(100 + i*200, 40, 2, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#ffffff22';
      }

      // 2. Pitch (Enhanced 3D depth)
      ctx.fillStyle = '#C2B280';
      ctx.beginPath();
      ctx.moveTo(370, 150); ctx.lineTo(430, 150); ctx.lineTo(650, 600); ctx.lineTo(150, 600);
      ctx.fill();

      // Grass texture
      ctx.fillStyle = '#14532d33';
      ctx.fillRect(0, 150, canvas.width, canvas.height - 150);

      // Stumps
      const ds = (x: number, y: number, s: number) => {
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 3*s;
        for(let i=-1; i<=1; i++) {
          ctx.beginPath(); ctx.moveTo(x + i*12*s, y); ctx.lineTo(x + i*12*s, y-40*s); ctx.stroke();
        }
      };
      ds(400, 160, 0.4); ds(400, 580, 1);

      // Batter Shadow
      ctx.fillStyle = '#00000033';
      ctx.beginPath(); ctx.ellipse(440, 555, 30, 10, 0, 0, Math.PI*2); ctx.fill();

      // Batter Animation
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(440, 500, 12, 0, Math.PI*2); ctx.fill(); // Head
      ctx.fillStyle = '#fbbf24'; // Team Jersey
      ctx.fillRect(428, 512, 24, 45); // Body
      
      // Bat
      ctx.save();
      ctx.translate(440, 540);
      ctx.rotate(gameState === 'HIT' ? -Math.PI/1.5 : 0.5 + (aimAngle * 0.01));
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-4, 0, 8, 60);
      ctx.restore();

      // Ball Update
      if (gameState === 'BOWLING' || gameState === 'HIT') {
          ballPos.current.x += ballVel.current.x * dt;
          ballPos.current.y += ballVel.current.y * dt;
          ballPos.current.z += ballVel.current.z * dt;

          const scale = 1 + (ballPos.current.z / 100);
          const sx = 400 + (ballPos.current.x - 400) * scale;
          const sy = 550 - (ballPos.current.z * 2.5);

          ctx.fillStyle = '#800000';
          ctx.beginPath();
          ctx.arc(sx, sy, Math.max(3, 10 * scale), 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fef3c7'; ctx.lineWidth = 1; ctx.stroke();
      }

      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frameRef.current);
  }, [gameState, aimAngle]);

  return (
    <div className="relative w-full h-[600px] bg-[#020617] rounded-[3rem] border border-white/10 overflow-hidden flex flex-col items-center justify-center select-none shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#3b82f622] to-transparent pointer-events-none" />

      <canvas 
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full object-cover"
      />

      {/* Language Selector Overlay */}
      <div className="absolute top-6 left-6 z-20 flex gap-2">
         {(['en', 'hi', 'bn'] as const).map(l => (
            <button 
                key={l}
                onClick={(e) => { e.stopPropagation(); setLang(l); }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black border transition-all ${lang === l ? 'bg-orange-500 border-orange-400 text-white shadow-lg' : 'bg-slate-900/80 border-white/10 text-white/40'}`}
            >
                {l.toUpperCase()}
            </button>
         ))}
      </div>
      
      {/* MOBILE CONTROLS - LIKES REAL CRICKET 24 */}
      <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between pointer-events-none">
        
        {/* Left: Direction Pad (Analog Style) */}
        <div className="pointer-events-auto flex flex-col items-center gap-4">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Aim Shot</span>
            <div className="relative w-32 h-32 bg-slate-900/80 rounded-full border border-white/10 p-2 overflow-hidden shadow-2xl backdrop-blur-xl">
               <input 
                 type="range" 
                 min="-45" 
                 max="45" 
                 value={aimAngle} 
                 onChange={(e) => setAimAngle(Number(e.target.value))}
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
               />
               <motion.div 
                 animate={{ rotate: aimAngle }}
                 className="w-full h-full flex flex-col items-center justify-center pointer-events-none"
               >
                  <div className="w-1.5 h-14 bg-gradient-to-t from-blue-500 to-white rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                  <Target className="w-4 h-4 text-white mt-1 opacity-20" />
               </motion.div>
            </div>
        </div>

        {/* Center: Play Button */}
        {gameState === 'IDLE' && (
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={startBowling}
                className="pointer-events-auto px-16 py-5 bg-white text-black rounded-full font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-500 hover:text-white transition-all transform italic flex items-center gap-3 z-50"
            >
                <Zap className="w-6 h-6 fill-current" />
                Play Delivery
            </motion.button>
        )}

        {/* Right: Shot Buttons (RC24 Style) */}
        <div className="pointer-events-auto flex flex-col gap-3">
             <div className="flex gap-2 justify-end mb-2">
                <button 
                    onClick={() => setFootwork('FRONT')}
                    className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all ${footwork === 'FRONT' ? 'bg-blue-500 border-blue-400 text-white' : 'bg-slate-900 text-white/40 border-white/5'}`}
                >
                    FRONT FT
                </button>
                <button 
                    onClick={() => setFootwork('BACK')}
                    className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all ${footwork === 'BACK' ? 'bg-blue-500 border-blue-400 text-white' : 'bg-slate-900 text-white/40 border-white/5'}`}
                >
                    BACK FT
                </button>
             </div>
             
             <span className="text-[10px] font-black text-white/20 uppercase tracking-widest text-right">Shot Type</span>
             <div className="flex gap-3">
                <ShotButton 
                    active={selectedShot === 'DEFEND'} 
                    onClick={() => setSelectedShot('DEFEND')}
                    icon={<Shield className="w-5 h-5" />}
                    label="DEFN"
                />
                <ShotButton 
                    active={selectedShot === 'PUSH'} 
                    onClick={() => setSelectedShot('PUSH')}
                    icon={<Swords className="w-5 h-5" />}
                    label="PRO"
                />
                <ShotButton 
                    active={selectedShot === 'LOFT'} 
                    onClick={() => setSelectedShot('LOFT')}
                    icon={<Zap className="w-5 h-5" />}
                    label="LOFT"
                />
             </div>
             
             {gameState === 'BOWLING' && (
                <button 
                  onClick={handleHit}
                  className="mt-2 py-5 bg-orange-500 text-white font-black uppercase tracking-widest rounded-2xl animate-pulse shadow-xl shadow-orange-500/20 italic text-sm"
                >
                  TAP TO STRIKE
                </button>
             )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {resultMsg && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 pointer-events-none">
                <motion.div
                    key={resultMsg}
                    initial={{ scale: 0.5, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 1.5, opacity: 0, y: -20 }}
                    className={`text-7xl font-black italic drop-shadow-[0_0_30px_rgba(234,88,12,0.4)] uppercase tracking-tighter ${
                        resultMsg.includes('SIX') || resultMsg.includes('MAXIMUM') ? 'text-orange-500' : 
                        resultMsg.includes('FOUR') || resultMsg.includes('BOUNDARY') ? 'text-blue-500' : 'text-white'
                    }`}
                >
                    {resultMsg}
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      <div className="absolute top-6 right-6 text-right opacity-20 pointer-events-none">
         <p className="text-[10px] font-black text-white uppercase tracking-widest italic">3D-G ENGINE ACTIVE</p>
         <p className="text-[8px] font-bold text-white uppercase opacity-40">DC REALISM PK 4.2</p>
      </div>
    </div>
  );
}

function ShotButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button 
            onClick={onClick}
            className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border transition-all ${active ? 'bg-orange-500 border-orange-400 text-white shadow-lg scale-110' : 'bg-slate-900/80 border-white/5 text-white/40 hover:bg-slate-800'}`}
        >
            {icon}
            <span className="text-[8px] font-black mt-1 uppercase">{label}</span>
        </button>
    );
}
