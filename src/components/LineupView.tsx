import React from 'react';
import { motion } from 'motion/react';
import { Team, PLAYERS } from '../types';
import { ChevronRight, Users, ShieldCheck } from 'lucide-react';

interface LineupViewProps {
  team: Team;
  opponent: Team;
  onConfirm: () => void;
}

export default function LineupView({ team, opponent, onConfirm }: LineupViewProps) {
  return (
    <div className="min-h-screen bg-[#020617] p-8 md:p-12 font-sans flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 40%), radial-gradient(circle at 20% 80%, #f97316 0%, transparent 40%)' }}></div>

      <header className="relative z-10 flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-xl">{team.flag}</div>
            <div>
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">{team.name} Squad</h2>
                <p className="text-orange-500 font-black text-xs uppercase tracking-widest">Match Day 11</p>
            </div>
        </div>
        <div className="text-right">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Opponent</span>
            <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-white italic">{opponent.name}</span>
                <span className="text-2xl">{opponent.flag}</span>
            </div>
        </div>
      </header>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto w-full flex-1">
        <div className="bg-slate-900/50 rounded-[40px] border border-white/10 p-10 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
                <Users className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Starting XI</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                {PLAYERS.map((player, i) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={player} 
                        className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5"
                    >
                        <span className="text-xs font-black text-white/20 w-4">{i + 1}</span>
                        <div className="flex-1">
                            <p className="text-sm font-black text-white uppercase tracking-tight">{player}</p>
                            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">{i < 6 ? 'Batsman' : i < 9 ? 'All-Rounder' : 'Bowler'}</span>
                        </div>
                        {i === 0 && <ShieldCheck className="w-4 h-4 text-orange-500" />}
                    </motion.div>
                ))}
            </div>
        </div>

        <div className="flex flex-col gap-6">
            <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 rounded-[40px] p-10 border border-blue-500/20 relative overflow-hidden">
                <div className="relative z-10">
                    <h4 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-2">Team Strategy</h4>
                    <p className="text-slate-300 leading-relaxed font-medium">Aggressive opening with middle-order stability. Bowling focused on late-swing and spin dominance in the middle overs.</p>
                </div>
            </div>

            <div className="bg-slate-900/50 rounded-[40px] p-10 border border-white/10 flex-1 flex flex-col justify-center items-center text-center">
                <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mb-6">
                    <div className="w-4 h-4 bg-orange-500 rounded-full animate-ping" />
                </div>
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-4">Fans Are Cheering</h4>
                <p className="text-white/40 text-sm max-w-xs mb-8">The stadium is packed! 50,000 fans are chanting for {team.name}.</p>
                
                <button 
                    onClick={onConfirm}
                    className="w-full py-5 bg-white text-black font-black uppercase text-xl rounded-2xl tracking-tighter italic transition-all hover:bg-orange-500 hover:text-white transform active:scale-95 shadow-xl"
                >
                    TAKE THE FIELD
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
