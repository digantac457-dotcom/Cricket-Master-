import React from 'react';
import { motion } from 'motion/react';
import { Play, Shield, Settings, Info, Trophy, User } from 'lucide-react';

export default function MainMenu({ onStart, onPractice }: { onStart: () => void, onPractice: () => void }) {
  return (
    <div className="relative min-h-screen bg-[#020617] text-white font-sans overflow-hidden flex flex-col">
      {/* Background Gradients */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 40%), radial-gradient(circle at 20% 80%, #f97316 0%, transparent 40%)' }}></div>

      {/* Header */}
      <header className="h-20 px-6 md:px-10 flex items-center justify-between z-10 border-b border-white/10 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 px-3 py-1 rounded-lg font-black italic tracking-tighter text-xl">DC</div>
          <div className="text-xl md:text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            Cricket Master
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-[0.2em] text-orange-400 font-bold">Pro Player</span>
            <span className="text-sm font-bold uppercase">Ultimate Fan</span>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-orange-500 overflow-hidden bg-slate-800 flex items-center justify-center">
            <User className="w-6 h-6 text-slate-400" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row p-6 md:p-10 gap-10 z-10 overflow-y-auto">
        {/* Left column: Actions */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="group relative overflow-hidden bg-white text-black font-black text-2xl py-6 px-8 rounded-xl transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-400 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300"></div>
            <span className="relative z-10 flex items-center justify-between group-hover:text-white transition-colors duration-300">
              QUICK MATCH <span className="text-orange-600 group-hover:text-white">▶</span>
            </span>
          </motion.button>
          
          <button className="bg-slate-800/80 hover:bg-slate-700 text-left font-bold text-xl py-5 px-8 rounded-xl border border-white/10 transition-colors uppercase tracking-tight">WORLD CUP 2024</button>
          <button className="bg-slate-800/80 hover:bg-slate-700 text-left font-bold text-xl py-5 px-8 rounded-xl border border-white/10 transition-colors uppercase tracking-tight">MY ULTIMATE TEAM</button>
          <button 
            onClick={onPractice}
            className="bg-slate-800/80 hover:bg-slate-700 text-left font-bold text-xl py-5 px-8 rounded-xl border border-white/10 transition-colors uppercase tracking-tight"
          >
            PRACTICE NETS
          </button>
          <button className="bg-slate-800/80 hover:bg-slate-700 text-left font-bold text-xl py-5 px-8 rounded-xl border border-white/10 transition-colors uppercase tracking-tight">SETTINGS</button>
        </div>

        {/* Right Column: Featured match card */}
        <div className="flex-1 flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-8 border border-blue-400/30 shadow-2xl relative overflow-hidden flex-1 flex flex-col"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <span className="bg-orange-500 text-[10px] font-black px-2 py-1 rounded uppercase mb-2 inline-block">Featured Series</span>
                  <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">IND VS AUS</h2>
                  <p className="text-slate-300 text-sm mt-1 uppercase font-bold tracking-widest opacity-60">Border-Gavaskar Trophy • LIVE NOW</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-black">Difficulty</div>
                  <div className="flex gap-1 justify-end">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                    <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-around items-center py-10 scale-110">
                <div className="text-center group">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-blue-600 border-4 border-white/20 mb-3 flex items-center justify-center text-4xl font-black shadow-xl">IND</div>
                  <div className="font-black tracking-tight text-white/40 group-hover:text-white transition-colors uppercase">INDIA</div>
                </div>
                <div className="text-4xl md:text-6xl font-black italic text-white/10">VS</div>
                <div className="text-center group">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-yellow-500 border-4 border-white/20 mb-3 flex items-center justify-center text-4xl font-black text-black shadow-xl">AUS</div>
                  <div className="font-black tracking-tight text-white/40 group-hover:text-white transition-colors uppercase">AUSTRALIA</div>
                </div>
              </div>

              <button 
                onClick={onStart}
                className="w-full bg-orange-500 hover:bg-orange-400 text-white font-black py-5 rounded-xl shadow-lg shadow-orange-500/30 text-xl uppercase tracking-[0.2em] transition-all transform active:scale-[0.98]"
              >
                Enter Stadium
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-auto sm:h-32">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5 flex flex-col justify-center">
              <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Current Rank</div>
              <div className="text-2xl font-black italic tracking-tighter">PLATINUM III</div>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5 flex flex-col justify-center">
              <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Win Rate</div>
              <div className="text-2xl font-black italic tracking-tighter text-blue-400">72.4%</div>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5 flex flex-col justify-center">
              <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Tournaments</div>
              <div className="text-2xl font-black italic tracking-tighter text-orange-500">12 🏆</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-16 px-10 flex items-center justify-between bg-slate-950 border-t border-white/5 text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black">
        <div>© 2024 DC Cricket • All Rights Reserved</div>
        <div className="hidden sm:flex gap-6">
          <span className="hover:text-white cursor-pointer transition-colors">Facebook</span>
          <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
          <span className="hover:text-white cursor-pointer transition-colors">Discord</span>
        </div>
      </footer>
    </div>
  );
}
