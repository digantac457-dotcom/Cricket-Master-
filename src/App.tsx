import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Intro from './components/Intro';
import MainMenu from './components/MainMenu';
import TeamSelector from './components/TeamSelector';
import Match from './components/Match';
import PracticeMode from './components/PracticeMode';
import LineupView from './components/LineupView';
import TossView from './components/TossView';
import { Team, GameState, MatchState } from './types';
import { Volume2, VolumeX, Trophy, Mic2 } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('INTRO');
  const [match, setMatch] = useState<MatchState | null>(null);
  const [lastCommentary, setLastCommentary] = useState<string>('Welcome to the stadium!');
  const [isMuted, setIsMuted] = useState(false);

  const setupMatch = (myTeam: Team, opponent: Team) => {
    setMatch({
      myTeam,
      opponent,
      score: 0,
      wickets: 0,
      ballsRemaining: 12,
      target: 0,
      isBatting: true,
      history: []
    });
    setGameState('TOSS');
  };

  const handleTossComplete = (winner: 'me' | 'opponent', myChoice: 'bat' | 'bowl') => {
    setMatch(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        tossWinner: winner === 'me' ? prev.myTeam.name : prev.opponent.name,
        isBatting: winner === 'me' ? (myChoice === 'bat') : true, // Opponent always bats first if they win toss for simplicity
      };
    });
    setGameState('LINEUP');
  };

  const handleBallEnd = (runs: number, out: boolean, commentary: string) => {
    if (!match) return;
    setLastCommentary(commentary);

    setMatch(prev => {
      if (!prev) return prev;
      const newScore = prev.score + runs;
      const newWickets = prev.wickets + (out ? 1 : 0);
      const newBalls = prev.ballsRemaining - 1;
      
      const eventMsg = out ? "OUT!" : runs === 6 ? "SIX!" : runs === 4 ? "FOUR!" : `${runs} Runs`;

      if (newWickets >= 3 || newBalls <= 0) {
        setTimeout(() => setGameState('RESULTS'), 2500);
      }

      return {
        ...prev,
        score: newScore,
        wickets: newWickets,
        ballsRemaining: newBalls,
        history: [eventMsg, ...prev.history].slice(0, 5)
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-orange-500/30 overflow-hidden font-sans">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 40%), radial-gradient(circle at 20% 80%, #f97316 0%, transparent 40%)' }}></div>

      <div className="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
         <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
           Stadium Feed: Active
         </span>
         <button 
           onClick={() => setIsMuted(!isMuted)}
           className="text-white hover:text-orange-500 transition-colors"
         >
           {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
         </button>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'INTRO' && (
          <div key="intro">
            <Intro onComplete={() => setGameState('MENU')} />
          </div>
        )}

        {gameState === 'MENU' && (
          <div key="menu">
            <MainMenu 
              onStart={() => setGameState('TEAM_SELECT')} 
              onPractice={() => setGameState('PRACTICE')}
            />
          </div>
        )}

        {gameState === 'PRACTICE' && (
          <div key="practice">
            <PracticeMode onBack={() => setGameState('MENU')} />
          </div>
        )}

        {gameState === 'TEAM_SELECT' && (
          <div key="team_select">
            <TeamSelector 
              onSelect={setupMatch} 
              onBack={() => setGameState('MENU')} 
            />
          </div>
        )}

        {gameState === 'TOSS' && match && (
          <div key="toss">
            <TossView 
              myTeam={match.myTeam} 
              opponent={match.opponent} 
              onComplete={handleTossComplete} 
            />
          </div>
        )}

        {gameState === 'LINEUP' && match && (
           <div key="lineup">
              <LineupView 
                team={match.myTeam} 
                opponent={match.opponent} 
                onConfirm={() => setGameState('MATCH')} 
              />
           </div>
        )}

        {gameState === 'MATCH' && match && (
          <motion.div
            key="match"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 md:p-8 flex flex-col h-screen"
          >
            {/* HUD */}
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center justify-between bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-blue-500 to-red-500 opacity-50" />
                
                <div className="flex items-center gap-6 md:gap-10">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1 italic">{match.myTeam.name}</span>
                      <span className="text-4xl md:text-5xl font-black text-white tabular-nums tracking-tighter italic">
                          {match.score}<span className="text-white/20 ml-1">/{match.wickets}</span>
                      </span>
                    </div>
                    <div className="w-[1px] h-12 bg-white/10" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1 italic">Deliveries</span>
                      <span className="text-2xl md:text-3xl font-black text-white tabular-nums tracking-tight">
                          {Math.floor((12 - match.ballsRemaining) / 6)}.{ (12 - match.ballsRemaining) % 6 }
                      </span>
                    </div>
                </div>

                <div className="hidden lg:flex gap-3">
                  {match.history.map((event, i) => (
                      <motion.div 
                          initial={{ scale: 0, x: 20 }}
                          animate={{ scale: 1, x: 0 }}
                          key={i} 
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic border ${
                              event.includes('SIX') ? 'bg-orange-500 text-white border-orange-400' : 
                              event.includes('FOUR') ? 'bg-blue-600 text-white border-blue-400' :
                              event.includes('OUT') ? 'bg-red-600 text-white border-red-400' : 'bg-slate-800 text-white/60 border-white/5'
                          }`}
                      >
                          {event}
                      </motion.div>
                  ))}
                </div>

                <div className="flex items-center gap-6 text-right">
                    <div className="flex flex-col border-l border-white/10 pl-6">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1 italic">Bowling Team</span>
                      <span className="text-xl font-black text-white uppercase tracking-tighter italic">{match.opponent.name}</span>
                    </div>
                </div>
              </div>

              {/* Commentary Bar */}
              <motion.div 
                key={lastCommentary}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/5 border border-white/10 py-3 px-8 rounded-full flex items-center gap-4 self-center"
              >
                 <Mic2 className="w-4 h-4 text-orange-500" />
                 <span className="text-sm font-black italic tracking-wide text-white/80">{lastCommentary}</span>
              </motion.div>
            </div>

            <div className="flex-1 overflow-hidden">
               <Match 
                 myTeam={match.myTeam} 
                 opponent={match.opponent} 
                 onBallEnd={handleBallEnd} 
               />
            </div>
          </motion.div>
        )}

        {gameState === 'RESULTS' && match && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 flex items-center justify-center p-8 z-[200]"
            >
                <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-2xl" />
                <div className="relative w-full max-w-xl bg-slate-900 border border-white/10 rounded-[3rem] p-12 overflow-hidden shadow-[0_0_100px_rgba(249,115,22,0.1)]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -ml-32 -mb-32" />
                    
                    <div className="flex flex-col items-center text-center relative z-10">
                        <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl mb-8 rotate-3">
                          <Trophy className="w-14 h-14 text-white" />
                        </div>
                        
                        <h2 className="text-xl font-black text-orange-500 uppercase tracking-[0.4em] mb-4 italic">Match Summary</h2>
                        <h3 className="text-7xl font-black text-white tracking-tighter mb-4 italic">
                            {match.score}<span className="text-white/20">/{match.wickets}</span>
                        </h3>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-12">
                          Tournament: DC Master Series 2024
                        </p>

                        <div className="grid grid-cols-2 gap-6 w-full mb-12">
                            <div className="bg-slate-800/50 p-6 rounded-3xl border border-white/5">
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">My Strike Rate</p>
                                <p className="text-3xl font-black italic">{((match.score / (12 - match.ballsRemaining)) * 100).toFixed(1)}</p>
                            </div>
                            <div className="bg-slate-800/50 p-6 rounded-3xl border border-white/5">
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Economy Rate</p>
                                <p className="text-3xl font-black italic">6.4</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => setGameState('MENU')}
                            className="w-full py-6 bg-white text-black font-black uppercase text-xl rounded-2xl tracking-widest italic transition-all hover:bg-orange-500 hover:text-white transform active:scale-95 shadow-xl"
                        >
                            Back to Clubhouse
                        </button>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
