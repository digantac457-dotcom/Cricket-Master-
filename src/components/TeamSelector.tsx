import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TEAMS, Team, Player } from '../types';
import { ChevronRight, ChevronLeft, Users, Trophy, BarChart3, Info } from 'lucide-react';

interface TeamSelectorProps {
  onSelect: (myTeam: Team, opponent: Team) => void;
  onBack: () => void;
}

export default function TeamSelector({ onSelect, onBack }: TeamSelectorProps) {
  const [myTeam, setMyTeam] = useState<Team | null>(null);
  const [opponent, setOpponent] = useState<Team | null>(null);
  const [showSquadId, setShowSquadId] = useState<string | null>(null);

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

      <div className="relative z-10 flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full pb-32 overflow-y-auto pr-4 custom-scrollbar">
        {TEAMS.map((team) => {
          const isSelected = myTeam?.id === team.id || opponent?.id === team.id;
          const isDisabled = (myTeam && !opponent && team.id === myTeam.id);

          return (
            <div key={team.id} className="relative group">
              <motion.button
                whileHover={!isDisabled ? { scale: 1.02, y: -5 } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
                onClick={() => handleSelect(team)}
                disabled={isDisabled}
                className={`w-full relative h-64 rounded-3xl overflow-hidden text-left p-8 transition-all duration-500 ${
                  isSelected 
                    ? 'bg-gradient-to-br from-orange-500 to-red-600 ring-4 ring-white shadow-2xl z-20' 
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
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white text-orange-600 rounded-full text-[10px] font-black tracking-widest shadow-lg">PLAYER 1</div>
                )}
                {opponent?.id === team.id && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black text-white rounded-full text-[10px] font-black tracking-widest shadow-lg">CPU</div>
                )}
              </motion.button>
              
              <button 
                onClick={(e) => { e.stopPropagation(); setShowSquadId(showSquadId === team.id ? null : team.id); }}
                className="absolute bottom-4 right-4 z-30 p-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/5 transition-colors"
                title="View Squad Stats"
              >
                <Info className="w-4 h-4 text-white" />
              </button>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {showSquadId && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-8 pointer-events-none"
          >
            <div className="bg-slate-900 border border-white/10 w-full max-w-4xl max-h-[80vh] rounded-[40px] shadow-3xl overflow-hidden pointer-events-auto flex flex-col">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{TEAMS.find(t => t.id === showSquadId)?.flag}</span>
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{TEAMS.find(t => t.id === showSquadId)?.name} Squad</h3>
                    <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">Player Statistics</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSquadId(null)}
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-4 custom-scrollbar">
                {TEAMS.find(t => t.id === showSquadId)?.players.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-white/20 uppercase font-black tracking-widest italic">Squad Data Restricted</div>
                ) : (
                  TEAMS.find(t => t.id === showSquadId)?.players.map((player, idx) => (
                    <motion.div 
                      key={player.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white/5 rounded-2xl p-5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-colors"
                    >
                      <div>
                        <p className="text-white font-black text-lg tracking-tight uppercase">{player.name}</p>
                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">{player.role}</p>
                      </div>
                      <div className="flex gap-4">
                        {player.avg ? (
                          <div className="text-right">
                             <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">Avg</p>
                             <p className="text-lg font-black text-orange-500 italic">{player.avg}</p>
                          </div>
                        ) : (
                          <div className="text-right">
                             <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">Wkts</p>
                             <p className="text-lg font-black text-blue-500 italic">{player.wickets}</p>
                          </div>
                        )}
                        <div className="w-[1px] h-8 bg-white/5 self-center" />
                        <div className="text-right">
                           <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">{player.sr ? 'SR' : 'Eco'}</p>
                           <p className="text-lg font-black text-white italic">{player.sr || player.economy}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
