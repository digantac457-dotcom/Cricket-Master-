import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Team } from '../types';
import { CircleDot, Swords, Shield } from 'lucide-react';

interface TossViewProps {
  myTeam: Team;
  opponent: Team;
  onComplete: (winner: 'me' | 'opponent', choice: 'bat' | 'bowl') => void;
}

export default function TossView({ myTeam, opponent, onComplete }: TossViewProps) {
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [winner, setWinner] = useState<'me' | 'opponent' | null>(null);

  const startToss = (call: 'heads' | 'tails') => {
    setFlipping(true);
    setTimeout(() => {
      const flip = Math.random() > 0.5 ? 'heads' : 'tails';
      setResult(flip);
      const win = flip === call ? 'me' : 'opponent';
      setWinner(win);
      setFlipping(false);
      
      // If opponent wins, they always bat first for this demo
      if (win === 'opponent') {
          setTimeout(() => onComplete('opponent', 'bowl'), 2000);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #3b82f633 0%, transparent 70%)' }}></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4">Toss Ceremony</h2>
        <p className="text-orange-500 font-bold uppercase tracking-[0.3em] text-xs">Stadium Live from London</p>
      </motion.div>

      <div className="relative w-80 h-80 mb-20 flex items-center justify-center">
         <AnimatePresence mode="wait">
            {flipping ? (
                <motion.div 
                  key="flipping"
                  animate={{ rotateY: [0, 720], scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="w-32 h-32 bg-yellow-500 rounded-full border-8 border-yellow-400 shadow-[0_0_50px_rgba(234,179,8,0.5)] flex items-center justify-center"
                >
                    <CircleDot className="w-16 h-16 text-yellow-200" />
                </motion.div>
            ) : winner ? (
                <motion.div 
                  key="result"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center"
                >
                    <div className="text-w-64 h-64 bg-slate-900 rounded-full border border-white/10 flex flex-col items-center justify-center p-8">
                        <span className="text-white/40 font-black uppercase text-[10px] tracking-widest mb-2">Toss Result</span>
                        <h3 className="text-3xl font-black text-white italic uppercase mb-1">{winner === 'me' ? myTeam.name : opponent.name}</h3>
                        <p className="text-orange-500 font-black text-xs uppercase tracking-widest">Won the Toss</p>
                    </div>
                </motion.div>
            ) : (
                <motion.div 
                  key="call"
                  className="flex gap-8"
                >
                    <button 
                        onClick={() => startToss('heads')}
                        className="w-32 h-32 bg-slate-900 border border-white/10 rounded-full flex flex-col items-center justify-center hover:bg-orange-500 hover:border-orange-400 transition-all transform hover:scale-110 active:scale-95 group"
                    >
                        <span className="text-2xl font-black text-white italic group-hover:scale-125 transition-transform">HEADS</span>
                    </button>
                    <button 
                        onClick={() => startToss('tails')}
                        className="w-32 h-32 bg-slate-900 border border-white/10 rounded-full flex flex-col items-center justify-center hover:bg-blue-500 hover:border-blue-400 transition-all transform hover:scale-110 active:scale-95 group"
                    >
                        <span className="text-2xl font-black text-white italic group-hover:scale-125 transition-transform">TAILS</span>
                    </button>
                </motion.div>
            )}
         </AnimatePresence>
      </div>

      {winner === 'me' && !flipping && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6"
          >
              <h4 className="text-white/60 font-black uppercase tracking-widest text-xs">Choose Your Objective</h4>
              <div className="flex gap-4">
                  <button 
                    onClick={() => onComplete('me', 'bat')}
                    className="flex items-center gap-3 bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-tighter italic hover:bg-orange-500 hover:text-white transition-all shadow-xl"
                  >
                      <Swords className="w-6 h-6" /> Bat First
                  </button>
                  <button 
                    onClick={() => onComplete('me', 'bowl')}
                    className="flex items-center gap-3 bg-slate-800 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-tighter italic hover:bg-blue-500 transition-all border border-white/5 shadow-xl"
                  >
                      <Shield className="w-6 h-6" /> Bowl First
                  </button>
              </div>
          </motion.div>
      )}

      {winner === 'opponent' && !flipping && (
          <div className="text-white/40 font-black uppercase tracking-[0.3em] text-xs animate-pulse italic">
              {opponent.name} is making their choice...
          </div>
      )}
    </div>
  );
}
