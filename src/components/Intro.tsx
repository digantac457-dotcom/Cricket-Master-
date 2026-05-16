import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy } from 'lucide-react';

export default function Intro({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div 
      className="fixed inset-0 bg-[#020617] flex items-center justify-center z-50 overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 40%), radial-gradient(circle at 20% 80%, #f97316 0%, transparent 40%)' }}></div>
      
      <div className="relative">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex items-center gap-6"
          >
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-4 rounded-xl font-black italic tracking-tighter text-4xl text-white shadow-2xl shadow-orange-500/20">
              DC
            </div>
            <div className="h-16 w-[2px] bg-white/10" />
            <div className="flex flex-col">
              <span className="text-5xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                CRICKET
              </span>
              <span className="text-xs font-black tracking-[0.8em] text-orange-500 uppercase ml-1">
                MASTER
              </span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.2 }}
            onAnimationComplete={() => {
              setTimeout(onComplete, 1200);
            }}
            className="h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent mt-8"
          />
        </div>
      </div>
    </motion.div>
  );
}
