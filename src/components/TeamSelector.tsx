import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TEAMS, Team } from '../types';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface TeamSelectorProps {
  onSelect: (myTeam: Team, opponent: Team) => void;
  onBack: () => void;
}

export default function TeamSelector({ onSelect, onBack }: TeamSelectorProps) {
  const [myTeam, setMyTeam] = useState<Team | null>(null);
  const [opponent, setOpponent] = useState<Team | null>(null);

  const handleSelect = (team: Team) => {
    if (!myTeam) {
      setMyTeam(team);
    } else if (!opponent && team.id !== myTeam.id) {
      setOpponent(team);
    }
  };

  const reset = () => {
    setMyTeam(null);
    setOpponent(null);
  };

  return (
    <div className="relative min-h-screen bg-[#020617] p-8 md:p-12 font-sans flex flex-col overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 40%), radial-gradient(circle at 20% 80%, #f97316 0%, transparent 40%)' }}></div>

      <div className="relative z-10 flex items-center justify-between mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors uppercase text-xs font-black tracking-[0.2em]"
        >
          <ChevronLeft className="w-5 h-5" /> Cancel Match
        </button>
        
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
            {!myTeam ? "Choose Your Nation" : !opponent ? "Nominate Opponent" : "Confirm Lineup"}
          </h2>
        </div>

        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full" />
      </div>

      <div className="relative z-10 flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full pb-20 overflow-y-auto pr-4 custom-scrollbar">
        {TEAMS.map((team) => {
          const isSelected = myTeam?.id === team.id || opponent?.id === team.id;
          const isDisabled = (myTeam && !opponent && team.id === myTeam.id);

          return (
            <motion.button
              key={team.id}
              whileHover={!isDisabled ? { scale: 1.05, rotate: isSelected ? 0 : 2 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
              onClick={() => handleSelect(team)}
              disabled={isDisabled}
              className={`relative h-56 rounded-3xl overflow-hidden text-left p-8 transition-all duration-500 ${
                isSelected 
                  ? 'bg-gradient-to-br from-orange-500 to-red-600 ring-4 ring-white shadow-2xl scale-105 z-20' 
                  : 'bg-slate-900/50 hover:bg-slate-800/80 border border-white/10'
              } ${isDisabled ? 'opacity-20 cursor-not-allowed grayscale' : 'cursor-pointer'}`}
            >
              <div 
                className={`absolute top-0 right-0 w-40 h-40 -mr-10 -mt-10 opacity-30 blur-3xl transition-opacity ${isSelected ? 'opacity-50' : ''}`} 
                style={{ backgroundColor: team.color }}
              />
              
              <div className="relative h-full flex flex-col justify-between">
                <div>
                  <span className={`text-5xl block mb-4 filter drop-shadow-lg ${isSelected ? 'animate-bounce' : ''}`}>{team.flag}</span>
                  <h3 className={`text-2xl font-black uppercase tracking-tighter italic ${isSelected ? 'text-white' : 'text-slate-200'}`}>{team.name}</h3>
                </div>
                
                <div className="space-y-3">
                  <div className={`flex justify-between text-[10px] uppercase font-black tracking-widest ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                    <span>Rating</span>
                    <span>{Math.round((team.stats.batting + team.stats.bowling) / 2)}</span>
                  </div>
                  <div className={`h-1.5 rounded-full overflow-hidden ${isSelected ? 'bg-black/20' : 'bg-slate-800'}`}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(team.stats.batting + team.stats.bowling) / 2}%` }}
                      className={`h-full ${isSelected ? 'bg-white' : 'bg-orange-500'}`} 
                    />
                  </div>
                </div>
              </div>

              {myTeam?.id === team.id && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-white text-orange-600 rounded-full text-[10px] font-black tracking-widest shadow-lg">CAPTAIN</div>
              )}
              {opponent?.id === team.id && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-black text-white rounded-full text-[10px] font-black tracking-widest shadow-lg">CHALLENGER</div>
              )}
            </motion.button>
          );
        })}
      </div>

      {myTeam && opponent && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-10 bg-slate-900 border border-white/10 px-12 py-6 rounded-full shadow-2xl backdrop-blur-xl"
        >
          <button 
            onClick={reset}
            className="text-white/40 font-black uppercase text-xs tracking-[0.3em] hover:text-white transition-colors"
          >
            Draft Again
          </button>
          
          <button
            onClick={() => onSelect(myTeam, opponent)}
            className="group px-12 py-4 bg-orange-500 rounded-full flex items-center gap-6 transition-all hover:scale-110 active:scale-95 shadow-lg shadow-orange-500/20"
          >
            <span className="text-white font-black uppercase tracking-widest text-lg italic">Enter Pitch</span>
            <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
